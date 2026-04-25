import { BleManager, State, type Device, type Subscription } from 'react-native-ble-plx';
import type { IScanner, PeerDiscoveredCallback, PeerLostCallback, ScanErrorCallback } from '../../interfaces/IScanner';
import type { Peer } from '../../models/Peer';
import { BLE_SERVICE_UUID, PEER_LOST_TIMEOUT_MS } from './constants';

/**
 * Extracts the IceBreaker display name from manufacturer-specific advertisement data.
 * BleAdvertiser encodes the name as bytes after the 2-byte company ID.
 * Falls back to the system device name if no valid manufacturer data is present.
 */
function parsePeerName(device: Device): string {
  if (device.manufacturerData) {
    try {
      const bytes = Buffer.from(device.manufacturerData, 'base64');
      // First 2 bytes = company ID, remainder = UTF-8 user name
      if (bytes.length > 2) {
        const name = bytes.slice(2).toString('utf8').replace(/\0/g, '').trim();
        if (name.length > 0) return name;
      }
    } catch {
      // malformed manufacturer data — fall through
    }
  }
  return device.localName ?? device.name ?? 'Unknown';
}

/**
 * SRP: only responsible for BLE central scanning (not connecting or messaging).
 * DIP: depends on IScanner abstraction — BleManager injected via constructor (DI).
 */
export class BleScanner implements IScanner {
  private _isScanning = false;
  private lostTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private stateSubscription: Subscription | null = null;
  private pendingCallbacks: {
    onDiscovered: PeerDiscoveredCallback;
    onLost?: PeerLostCallback;
    onError?: ScanErrorCallback;
  } | null = null;

  constructor(private readonly bleManager: BleManager) {}

  get isScanning(): boolean {
    return this._isScanning;
  }

  startScan(
    onDiscovered: PeerDiscoveredCallback,
    onLost?: PeerLostCallback,
    onError?: ScanErrorCallback,
  ): void {
    if (this._isScanning) return;
    this._isScanning = true;
    this.pendingCallbacks = { onDiscovered, onLost, onError };

    // Unsubscribe any previous state listener
    this.stateSubscription?.remove();

    // Subscribe to BLE state changes and emit the current value immediately.
    // This ensures we wait for PoweredOn before calling startDeviceScan, which
    // fixes the silent failure that occurs when the scan starts before BT is ready.
    this.stateSubscription = this.bleManager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        this._startDeviceScan();
      } else if (state === State.PoweredOff || state === State.Resetting) {
        // BT was turned off — stop the hardware scan but keep _isScanning=true
        // so we resume automatically if the user turns BT back on.
        this.bleManager.stopDeviceScan();
        this.lostTimers.forEach(clearTimeout);
        this.lostTimers.clear();
      } else if (state === State.Unauthorized || state === State.Unsupported) {
        // Unrecoverable — stop fully and report the error.
        this._stopInternal();
        onError?.(new Error(`Bluetooth is ${state === State.Unauthorized ? 'not authorized' : 'not supported'} on this device.`));
      }
    }, true /* emitCurrentValue — triggers immediately with current BT state */);
  }

  private _startDeviceScan(): void {
    if (!this.pendingCallbacks) return;
    const { onDiscovered, onLost, onError } = this.pendingCallbacks;

    this.bleManager.startDeviceScan(
      [BLE_SERVICE_UUID],
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          onError?.(error);
          return;
        }
        if (!device) return;

        const peer: Peer = {
          id: device.id,
          name: parsePeerName(device),
          rssi: device.rssi ?? -100,
          isConnected: false,
          lastSeen: new Date(),
        };
        onDiscovered(peer);

        if (onLost) {
          if (this.lostTimers.has(device.id)) {
            clearTimeout(this.lostTimers.get(device.id)!);
          }
          const timer = setTimeout(() => {
            onLost(device.id);
            this.lostTimers.delete(device.id);
          }, PEER_LOST_TIMEOUT_MS);
          this.lostTimers.set(device.id, timer);
        }
      },
    );
  }

  private _stopInternal(): void {
    this.bleManager.stopDeviceScan();
    this.stateSubscription?.remove();
    this.stateSubscription = null;
    this.pendingCallbacks = null;
    this.lostTimers.forEach(clearTimeout);
    this.lostTimers.clear();
    this._isScanning = false;
  }

  stopScan(): void {
    this._stopInternal();
  }
}
