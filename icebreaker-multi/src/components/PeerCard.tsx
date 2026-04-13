import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Peer } from '../models/Peer';
import { AppColors } from './tokens';

interface Props {
  peer: Peer;
  unreadCount?: number;
  onPress: (peer: Peer) => void;
}

const rssiToBars = (rssi: number): number => {
  if (rssi >= -60) return 3;
  if (rssi >= -75) return 2;
  return 1;
};

/** SRP: only renders a single nearby-peer card. */
export function PeerCard({ peer, unreadCount = 0, onPress }: Props) {
  const bars = rssiToBars(peer.rssi);
  const initials = peer.name.slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(peer)} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{peer.name}</Text>
        <Text style={styles.signal}>
          {'▌'.repeat(bars)}{'░'.repeat(3 - bars)} {peer.rssi} dBm
        </Text>
      </View>

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}

      {peer.isConnected && <View style={styles.connectedDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: AppColors.text },
  signal: { fontSize: 12, color: AppColors.textSecondary, marginTop: 2 },
  badge: {
    backgroundColor: AppColors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  connectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.success,
    marginLeft: 4,
  },
});
