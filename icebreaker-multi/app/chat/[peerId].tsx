import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
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
          headerStyle: { backgroundColor: AppColors.surface },
          headerTintColor: AppColors.text,
          headerTitleStyle: { fontWeight: '700', color: AppColors.text },
          headerShadowVisible: false,
          headerRight: () => (
            <View style={styles.headerStatus}>
              <View style={[styles.statusDot, isConnected ? styles.dotGreen : styles.dotGray]} />
              <Text style={styles.statusText}>
                {isConnecting ? 'Connecting…' : isConnected ? 'Connected' : 'Offline'}
              </Text>
            </View>
          ),
        }}
      />

      {isConnecting ? (
        <View style={styles.connecting}>
          <View style={styles.connectingCard}>
            <ActivityIndicator color={AppColors.primary} size="large" />
            <Text style={styles.connectingTitle}>Connecting</Text>
            <Text style={styles.connectingText}>
              Establishing Bluetooth link with {peerName}…
            </Text>
          </View>
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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="💬"
                title={`Chat with ${peerName}`}
                description="Say hello! Messages travel directly over Bluetooth."
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

  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotGreen: { backgroundColor: AppColors.success },
  dotGray: { backgroundColor: AppColors.textMuted },
  statusText: { fontSize: 12, color: AppColors.textSecondary, fontWeight: '500' },

  connecting: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  connectingCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.borderAccent,
    width: '100%',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
  },
  connectingTitle: { fontSize: 18, fontWeight: '700', color: AppColors.text },
  connectingText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  messageList: { paddingVertical: 16 },
  messageListEmpty: { flex: 1 },
});

