import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AppColors } from './tokens';

interface Props {
  onSave: (name: string) => Promise<void>;
}

/** SRP: only captures the initial user name setup form. */
export function UserSetup({ onSave }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    await onSave(trimmed);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to IceBreaker</Text>
      <Text style={styles.sub}>
        Set a name so nearby people can recognize you via Bluetooth.
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={AppColors.textSecondary}
        autoFocus
        maxLength={30}
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      <TouchableOpacity
        style={[styles.btn, !name.trim() && styles.btnDisabled]}
        onPress={handleSave}
        disabled={!name.trim() || loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Get Started</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  title: { fontSize: 26, fontWeight: '700', color: AppColors.text, textAlign: 'center' },
  sub: { fontSize: 14, color: AppColors.textSecondary, textAlign: 'center', lineHeight: 20 },
  input: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: AppColors.text,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  btn: {
    width: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: AppColors.border },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
