import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
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
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.bg}
      resizeMode="cover">
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconEmoji}>❄️</Text>
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.title}>IceBreaker</Text>
        <Text style={styles.sub}>
          Discover and chat with people nearby via Bluetooth. Set a name to get started.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Your display name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex"
          placeholderTextColor={AppColors.textMuted}
          autoFocus
          maxLength={30}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, (!name.trim() || loading) && styles.btnDisabled]}
        onPress={handleSave}
        disabled={!name.trim() || loading}
        activeOpacity={0.85}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Get Started →</Text>
        )}
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 24,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: AppColors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.borderAccent,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 4,
  },
  iconEmoji: { fontSize: 40 },
  textGroup: { alignItems: 'center', gap: 8 },
  title: { fontSize: 32, fontWeight: '800', color: AppColors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: AppColors.textSecondary, textAlign: 'center', lineHeight: 21 },
  formGroup: { width: '100%', gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: AppColors.text,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  btn: {
    width: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: AppColors.surfaceElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
});
