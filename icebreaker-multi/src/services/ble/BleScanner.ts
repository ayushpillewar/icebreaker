import { BleManager, type Device } from 'react-native-ble-plx';
import type { IScanner, PeerDiscoveredCallback, PeerLostCallback } from '../../interfaces/IScanner';
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

  constructor(private readonly bleManager: BleManager) {}

  get isScanning(): boolean {
    return this._isScanning;
  }

  startScan(onDiscovered: PeerDiscoveredCallback, onLost?: PeerLostCallback): void {
    if (this._isScanning) return;
    this._isScanning = true;

    this.bleManager.startDeviceScan(
      [BLE_SERVICE_UUID],
      { allowDuplicates: true },
      (error, device) => {
        if (error || !device) return;

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

  stopScan(): void {
    this.bleManager.stopDeviceScan();
    this.lostTimers.forEach(clearTimeout);
    this.lostTimers.clear();
    this._isScanning = false;
  }
}
