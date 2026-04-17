import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Peer } from '../models/Peer';
import { AppColors } from './tokens';

interface Props {
  peer: Peer;
  unreadCount?: number;
  onPress: (peer: Peer) => void;
}

const AVATAR_PALETTE = ['#7B61FF', '#FF6B9D', '#00C9A7', '#FF8C42', '#4ECDC4', '#A78BFA', '#FFB347'];

const getAvatarColor = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
};

const rssiToSignal = (rssi: number): number => {
  if (rssi >= -60) return 4;
  if (rssi >= -70) return 3;
  if (rssi >= -80) return 2;
  return 1;
};

/** SRP: only renders a single nearby-peer card. */
export function PeerCard({ peer, unreadCount = 0, onPress }: Props) {
  const bars = rssiToSignal(peer.rssi);
  const initials = peer.name.slice(0, 2).toUpperCase();
  const color = getAvatarColor(peer.name);

  return (
    <TouchableOpacity
      style={[styles.card, peer.isConnected && styles.cardConnected]}
      onPress={() => onPress(peer)}
      activeOpacity={0.75}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: color + '20', borderColor: color + '50' }]}>
        <Text style={[styles.avatarText, { color }]}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{peer.name}</Text>
        <View style={styles.signalRow}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.bar,
                { height: 4 + i * 2.5 },
                i <= bars ? styles.barActive : styles.barInactive,
              ]}
            />
          ))}
          <Text style={styles.rssi}>{peer.rssi} dBm</Text>
        </View>
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}

      {/* Connected indicator */}
      {peer.isConnected && (
        <View style={styles.connectedPill}>
          <Text style={styles.connectedText}>Connected</Text>
        </View>
      )}

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardConnected: {
    borderColor: AppColors.success + '50',
    shadowColor: AppColors.success,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  avatarText: { fontWeight: '700', fontSize: 16 },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 16, fontWeight: '600', color: AppColors.text },
  signalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 2 },
  barActive: { backgroundColor: AppColors.success },
  barInactive: { backgroundColor: AppColors.border },
  rssi: { fontSize: 11, color: AppColors.textMuted, marginLeft: 5 },
  badge: {
    backgroundColor: AppColors.danger,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: AppColors.danger,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  connectedPill: {
    backgroundColor: AppColors.successBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: AppColors.success + '40',
  },
  connectedText: { fontSize: 11, color: AppColors.success, fontWeight: '600' },
  chevron: { fontSize: 20, color: AppColors.textMuted, fontWeight: '300' },
});
