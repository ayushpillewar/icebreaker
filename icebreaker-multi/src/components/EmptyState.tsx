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
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
