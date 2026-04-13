import type { Peer } from '../models/Peer';

export type PeerDiscoveredCallback = (peer: Peer) => void;
export type PeerLostCallback = (peerId: string) => void;

/** ISP: only scanning responsibility — no advertising, no connecting */
export interface IScanner {
  startScan(onDiscovered: PeerDiscoveredCallback, onLost?: PeerLostCallback): void;
  stopScan(): void;
  readonly isScanning: boolean;
}
