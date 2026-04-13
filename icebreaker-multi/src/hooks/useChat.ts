import { useEffect, useCallback, useState } from 'react';
import { useServices } from '../container/ServiceProvider';
import { usePeerStore } from '../store/peerStore';
import { useChatStore } from '../store/chatStore';

const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

/**
 * SRP: orchestrates connecting to a peer and exchanging messages.
 * DIP: depends on IConnector, IMessageSender, IMessageReceiver via the container.
 */
export function useChat(peerId: string) {
  const { connector, messageSender, messageReceiver } = useServices();
  const { markConnected } = usePeerStore();
  const { addMessage, getMessages, markRead } = useChatStore();
  const [isConnecting, setConnecting] = useState(false);

  const messages = getMessages(peerId);

  useEffect(() => {
    markRead(peerId);

    // Subscribe to incoming messages
    const unsubscribe = messageReceiver.onMessageReceived((message) => {
      if (message.peerId === peerId) {
        addMessage(message);
      }
    });

    // Auto-connect when the hook mounts
    if (!connector.isConnected(peerId)) {
      setConnecting(true);
      connector
        .connect(peerId)
        .then(() => {
          markConnected(peerId, true);
        })
        .catch(console.error)
        .finally(() => setConnecting(false));
    }

    return () => {
      unsubscribe();
    };
  }, [peerId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const message = {
        id: uid(),
        peerId,
        text,
        direction: 'sent' as const,
        timestamp: new Date(),
      };
      addMessage(message);
      await messageSender.sendMessage(peerId, text);
    },
    [peerId, messageSender, addMessage],
  );

  const disconnect = useCallback(() => {
    connector.disconnect(peerId);
    markConnected(peerId, false);
  }, [peerId, connector, markConnected]);

  return { messages, sendMessage, disconnect, isConnecting, isConnected: connector.isConnected(peerId) };
}
