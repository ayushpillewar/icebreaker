export interface Peer {
  readonly id: string;
  name: string;
  rssi: number;
  isConnected: boolean;
  lastSeen: Date;
}
