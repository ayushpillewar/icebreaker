import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from './tokens';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

/** SRP: only captures and emits a text message. */
export function MessageInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const canSend = !!text.trim() && !disabled;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={disabled ? 'Waiting for connection…' : 'Message…'}
          placeholderTextColor={AppColors.textMuted}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!disabled}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, canSend ? styles.sendBtnActive : styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!canSend}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.surfaceElevated,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 15,
    color: AppColors.text,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: AppColors.surfaceElevated },
});
