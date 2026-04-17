import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from './tokens';

interface Props {
  title: string;
  description: string;
  icon?: string;
}

/** SRP: renders a screen-level empty / placeholder state. */
export function EmptyState({ title, description, icon = '📡' }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    gap: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 4,
  },
  icon: { fontSize: 36 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
