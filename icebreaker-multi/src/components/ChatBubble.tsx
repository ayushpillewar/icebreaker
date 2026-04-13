import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Message } from '../models/Message';
import { AppColors } from './tokens';

interface Props {
  message: Message;
}

/** SRP: only renders a single chat bubble. */
export function ChatBubble({ message }: Props) {
  const isSent = message.direction === 'sent';
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.row, isSent ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.bubble, isSent ? styles.sent : styles.received]}>
        <Text style={[styles.text, isSent ? styles.sentText : styles.receivedText]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isSent ? styles.sentTime : styles.receivedTime]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, marginVertical: 3 },
  rowRight: { alignItems: 'flex-end' },
  rowLeft: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sent: {
    backgroundColor: AppColors.primary,
    borderBottomRightRadius: 4,
  },
  received: {
    backgroundColor: AppColors.surface,
    borderBottomLeftRadius: 4,
  },
  text: { fontSize: 15, lineHeight: 20 },
  sentText: { color: '#fff' },
  receivedText: { color: AppColors.text },
  time: { fontSize: 10, marginTop: 3 },
  sentTime: { color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  receivedTime: { color: AppColors.textSecondary },
});
