import { create } from 'zustand';
import type { Message } from '../models/Message';

interface ChatState {
  /** Map of peerId → ordered message list */
  conversations: Record<string, Message[]>;
  addMessage: (message: Message) => void;
  getMessages: (peerId: string) => Message[];
  clearConversation: (peerId: string) => void;
  unreadCount: (peerId: string) => number;
  markRead: (peerId: string) => void;
  unread: Record<string, number>;
}

/** SRP: only manages chat history and unread counts. */
export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {},
  unread: {},

  addMessage: (message: Message) =>
    set((state) => {
      const existing = state.conversations[message.peerId] ?? [];
      const unread = state.unread;
      const increment = message.direction === 'received' ? 1 : 0;
      return {
        conversations: {
          ...state.conversations,
          [message.peerId]: [...existing, message],
        },
        unread: {
          ...unread,
          [message.peerId]: (unread[message.peerId] ?? 0) + increment,
        },
      };
    }),

  getMessages: (peerId: string) => get().conversations[peerId] ?? [],

  clearConversation: (peerId: string) =>
    set((state) => {
      const { [peerId]: _, ...rest } = state.conversations;
      return { conversations: rest };
    }),

  unreadCount: (peerId: string) => get().unread[peerId] ?? 0,

  markRead: (peerId: string) =>
    set((state) => ({ unread: { ...state.unread, [peerId]: 0 } })),
}));
