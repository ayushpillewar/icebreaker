import type { IConnector } from '../../interfaces/IConnector';

/**
 * SRP: only responsible for simulating peer connection lifecycle.
 */
export class MockConnector implements IConnector {
  private connected = new Set<string>();

  async connect(peerId: string): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 800)); // simulate handshake delay
    this.connected.add(peerId);
  }

  disconnect(peerId: string): void {
    this.connected.delete(peerId);
  }

  isConnected(peerId: string): boolean {
    return this.connected.has(peerId);
  }
}
