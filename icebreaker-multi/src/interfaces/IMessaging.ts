import type { Message } from '../models/Message';

export type MessageReceivedCallback = (message: Message) => void;

/** ISP: split into two narrow interfaces */
export interface IMessageSender {
  sendMessage(peerId: string, text: string): Promise<void>;
}

export interface IMessageReceiver {
  /** Returns an unsubscribe function */
  onMessageReceived(callback: MessageReceivedCallback): () => void;
}
