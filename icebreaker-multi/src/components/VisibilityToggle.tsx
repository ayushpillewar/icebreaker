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
    <View style={[styles.card, isVisible && styles.cardActive]}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{isVisible ? '📡' : '👻'}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label}>Visible to others</Text>
        <Text style={[styles.sub, isVisible ? styles.subActive : undefined]}>
          {isVisible ? 'Broadcasting — others can find you' : 'Hidden — you won\'t appear nearby'}
        </Text>
      </View>
      <Switch
        value={isVisible}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: AppColors.surfaceElevated, true: AppColors.primary }}
        thumbColor="#fff"
        ios_backgroundColor={AppColors.surfaceElevated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardActive: {
    borderColor: AppColors.borderAccent,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AppColors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  textBlock: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: AppColors.text },
  sub: { fontSize: 12, color: AppColors.textSecondary, marginTop: 2 },
  subActive: { color: AppColors.success },
});
