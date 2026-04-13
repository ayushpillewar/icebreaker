import type { IMessageSender, IMessageReceiver, MessageReceivedCallback } from '../../interfaces/IMessaging';
import type { Message } from '../../models/Message';

const AUTO_REPLIES = [
  "Hey! Nice to meet you!",
  "How's it going?",
  "Cool, what brings you here?",
  "That's awesome!",
  "Are you local?",
  "What do you do?",
  "Great to connect!",
];

const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

/**
 * SRP: message sending & receiving in one class — they are intrinsically coupled
 *      (same transport channel). Separated by ISP via IMessageSender / IMessageReceiver.
 * OCP: BleMessaging can replace this without changing callers.
 */
export class MockMessaging implements IMessageSender, IMessageReceiver {
  private callbacks: MessageReceivedCallback[] = [];

  async sendMessage(peerId: string, _text: string): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 300)); // simulate BLE write latency
    // Simulate the remote peer typing a reply
    setTimeout(() => {
      const reply: Message = {
        id: uid(),
        peerId,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        direction: 'received',
        timestamp: new Date(),
      };
      this.callbacks.forEach((cb) => cb(reply));
    }, 1200 + Math.random() * 800);
  }

  onMessageReceived(callback: MessageReceivedCallback): () => void {
    this.callbacks = [...this.callbacks, callback];
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }
}
