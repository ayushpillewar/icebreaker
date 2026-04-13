import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useChat } from '../../src/hooks/useChat';
import { ChatBubble } from '../../src/components/ChatBubble';
import { MessageInput } from '../../src/components/MessageInput';
import { EmptyState } from '../../src/components/EmptyState';
import { AppColors } from '../../src/components/tokens';
import type { Message } from '../../src/models/Message';

export default function ChatScreen() {
  const { peerId, name } = useLocalSearchParams<{ peerId: string; name: string }>();
  const router = useRouter();
  const listRef = useRef<FlatList<Message>>(null);

  const decoded = decodeURIComponent(peerId ?? '');
  const peerName = decodeURIComponent(name ?? 'Chat');

  const { messages, sendMessage, isConnecting, isConnected } = useChat(decoded);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const handleSend = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: peerName,
          headerStyle: { backgroundColor: AppColors.background },
          headerTintColor: AppColors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => (
            <View style={styles.headerStatus}>
              <View style={[styles.dot, isConnected ? styles.dotGreen : styles.dotGray]} />
              <Text style={styles.headerStatusText}>
                {isConnecting ? 'Connecting…' : isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          ),
        }}
      />

      {isConnecting ? (
        <View style={styles.connecting}>
          <ActivityIndicator color={AppColors.primary} />
          <Text style={styles.connectingText}>Connecting to {peerName}…</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messageList,
              messages.length === 0 && styles.messageListEmpty,
            ]}
            ListEmptyComponent={
              <EmptyState
                icon="💬"
                title={`Chat with ${peerName}`}
                description="Say hello! Your messages go directly over Bluetooth."
              />
            }
            renderItem={({ item }) => <ChatBubble message={item} />}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />
          <MessageInput onSend={handleSend} disabled={!isConnected} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotGreen: { backgroundColor: AppColors.success },
  dotGray: { backgroundColor: AppColors.border },
  headerStatusText: { fontSize: 12, color: AppColors.textSecondary },
  connecting: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  connectingText: { fontSize: 15, color: AppColors.textSecondary },
  messageList: { paddingVertical: 12 },
  messageListEmpty: { flex: 1, justifyContent: 'center' },
});
