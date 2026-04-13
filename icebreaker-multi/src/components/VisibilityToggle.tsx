import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { AppColors } from './tokens';

interface Props {
  isVisible: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

/** SRP: only renders the "allow others to see me" toggle with its label. */
export function VisibilityToggle({ isVisible, onToggle, disabled = false }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>Visible to others</Text>
        <Text style={styles.sub}>
          {isVisible ? 'You are discoverable nearby' : 'You are hidden from others'}
        </Text>
      </View>
      <Switch
        value={isVisible}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: AppColors.border, true: AppColors.primary }}
        thumbColor={isVisible ? '#fff' : AppColors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  textBlock: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: AppColors.text },
  sub: { fontSize: 12, color: AppColors.textSecondary, marginTop: 2 },
});
