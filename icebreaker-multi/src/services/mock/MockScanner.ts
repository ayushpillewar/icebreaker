import type { IScanner, PeerDiscoveredCallback, PeerLostCallback } from '../../interfaces/IScanner';
import type { Peer } from '../../models/Peer';

const MOCK_PEERS: Peer[] = [
  { id: 'mock-alice', name: 'Alice', rssi: -65, isConnected: false, lastSeen: new Date() },
  { id: 'mock-bob', name: 'Bob', rssi: -72, isConnected: false, lastSeen: new Date() },
  { id: 'mock-charlie', name: 'Charlie', rssi: -58, isConnected: false, lastSeen: new Date() },
  { id: 'mock-diana', name: 'Diana', rssi: -80, isConnected: false, lastSeen: new Date() },
];

/**
 * SRP: only responsible for simulating BLE scanning.
 * OCP: swappable with BleScanner without changing callers (both implement IScanner).
 */
export class MockScanner implements IScanner {
  private _isScanning = false;
  private interval: ReturnType<typeof setInterval> | null = null;
  private peerIndex = 0;

  get isScanning(): boolean {
    return this._isScanning;
  }

  startScan(onDiscovered: PeerDiscoveredCallback, onLost?: PeerLostCallback): void {
    if (this._isScanning) return;
    this._isScanning = true;
    this.peerIndex = 0;

    this.interval = setInterval(() => {
      if (this.peerIndex < MOCK_PEERS.length) {
        const peer: Peer = { ...MOCK_PEERS[this.peerIndex], lastSeen: new Date() };
        onDiscovered(peer);
        this.peerIndex++;
      } else if (onLost && Math.random() < 0.1) {
        // Occasionally simulate a peer going out of range
        const randomIndex = Math.floor(Math.random() * MOCK_PEERS.length);
        onLost(MOCK_PEERS[randomIndex].id);
      }
    }, 2500);
  }

  stopScan(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this._isScanning = false;
  }
}
