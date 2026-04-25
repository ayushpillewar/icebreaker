import type { Peer } from '../models/Peer';

export type PeerDiscoveredCallback = (peer: Peer) => void;
export type PeerLostCallback = (peerId: string) => void;
export type ScanErrorCallback = (error: Error) => void;

/** ISP: only scanning responsibility — no advertising, no connecting */
export interface IScanner {
  startScan(
    onDiscovered: PeerDiscoveredCallback,
    onLost?: PeerLostCallback,
    onError?: ScanErrorCallback,
  ): void;
  stopScan(): void;
  readonly isScanning: boolean;
}
