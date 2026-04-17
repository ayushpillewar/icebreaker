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
  row: { paddingHorizontal: 16, marginVertical: 3 },
  rowRight: { alignItems: 'flex-end' },
  rowLeft: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sent: {
    backgroundColor: AppColors.primary,
    borderBottomRightRadius: 5,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  received: {
    backgroundColor: AppColors.surface,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  text: { fontSize: 15, lineHeight: 21 },
  sentText: { color: '#fff' },
  receivedText: { color: AppColors.text },
  time: { fontSize: 10, marginTop: 4 },
  sentTime: { color: 'rgba(255,255,255,0.55)', textAlign: 'right' },
  receivedTime: { color: AppColors.textMuted },
});
