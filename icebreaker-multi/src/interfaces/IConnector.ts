/** ISP: only connection lifecycle — no scanning, no messaging */
export interface IConnector {
  connect(peerId: string): Promise<void>;
  disconnect(peerId: string): void;
  isConnected(peerId: string): boolean;
}
