export type MessageDirection = 'sent' | 'received';

export interface Message {
  readonly id: string;
  readonly peerId: string;
  readonly text: string;
  readonly direction: MessageDirection;
  readonly timestamp: Date;
}
