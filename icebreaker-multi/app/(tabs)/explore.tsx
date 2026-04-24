import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDiscovery } from '../../src/hooks/useDiscovery';
import { usePermissions } from '../../src/hooks/usePermissions';
import { useShallow } from 'zustand/react/shallow';
import { usePeerStore } from '../../src/store/peerStore';
import { useChatStore } from '../../src/store/chatStore';
import { useUserStore } from '../../src/store/userStore';
import { PeerCard } from '../../src/components/PeerCard';
import { EmptyState } from '../../src/components/EmptyState';
import { AppColors } from '../../src/components/tokens';
import type { Peer } from '../../src/models/Peer';

export default function NearbyScreen() {
  const router = useRouter();
  const { permissionState, requestPermissions } = usePermissions();
  const { startDiscovery, stopDiscovery, isScanning } = useDiscovery();
  const peers = usePeerStore(useShallow((s) => s.getPeerList()));
  const unreadCount = useChatStore((s) => s.unreadCount);
  const isVisible = useUserStore((s) => s.isVisible);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (permissionState === 'granted') {
      startDiscovery();
    }
    return () => stopDiscovery();
  }, [permissionState, startDiscovery, stopDiscovery]);

  const handlePeerPress = (peer: Peer) => {
    router.push(`/chat/${encodeURIComponent(peer.id)}?name=${encodeURIComponent(peer.name)}`);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon="👤"
          title="Set up your profile first"
          description="Go to the Home tab and enter your name to get started."
        />
      </SafeAreaView>
    );
  }

  if (permissionState === 'denied') {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon="🔒"
          title="Bluetooth access needed"
          description="IceBreaker needs Bluetooth permission to discover nearby people."
        />
        <TouchableOpacity style={styles.permBtn} onPress={requestPermissions}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nearby</Text>
          <Text style={styles.subtitle}>
            {isScanning
              ? 'Scanning for people…'
              : peers.length === 0
              ? 'No one found'
              : `${peers.length} ${peers.length === 1 ? 'person' : 'people'} found`}
          </Text>
        </View>
        <View style={[styles.scanBadge, isScanning && styles.scanBadgeActive]}>
          {isScanning ? (
            <ActivityIndicator size="small" color={AppColors.primary} />
          ) : (
            <Text style={styles.scanIcon}>📡</Text>
          )}
        </View>
      </View>

      {/* Visibility reminder */}
      {!isVisible && (
        <View style={styles.hint}>
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>
            Enable visibility on the Home tab so others can see you too.
          </Text>
        </View>
      )}

      {/* Peer list */}
      <FlatList
        data={peers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, peers.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isScanning ? null : (
            <EmptyState
              icon="🔍"
              title="Nobody nearby yet"
              description="Make sure other IceBreaker users are around with visibility turned on."
            />
          )
        }
        renderItem={({ item }) => (
          <PeerCard
            peer={item}
            unreadCount={unreadCount(item.id)}
            onPress={handlePeerPress}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  title: { fontSize: 28, fontWeight: '800', color: AppColors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: AppColors.textSecondary, marginTop: 2 },

  scanBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  scanBadgeActive: {
    borderColor: AppColors.borderAccent,
    backgroundColor: AppColors.primaryGlow,
  },
  scanIcon: { fontSize: 20 },

  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: AppColors.warningBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: AppColors.warning + '40',
    gap: 8,
  },
  hintIcon: { fontSize: 14, marginTop: 1 },
  hintText: { flex: 1, fontSize: 13, color: AppColors.warning, lineHeight: 18 },

  list: { paddingHorizontal: 20, paddingBottom: 24 },
  listEmpty: { flex: 1 },

  permBtn: {
    margin: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: AppColors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

