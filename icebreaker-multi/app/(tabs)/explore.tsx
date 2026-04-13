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
  }, [permissionState]);

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
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

      {/* Header bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Nearby</Text>
          <Text style={styles.subtitle}>
            {isScanning ? 'Scanning for people…' : `${peers.length} found`}
          </Text>
        </View>
        <View style={styles.scanBadge}>
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
          <Text style={styles.hintText}>
            💡 Enable visibility on the Home tab so others can see you too.
          </Text>
        </View>
      )}

      {/* Peer list */}
      <FlatList
        data={peers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, peers.length === 0 && styles.listEmpty]}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: { fontSize: 26, fontWeight: '700', color: AppColors.text },
  subtitle: { fontSize: 13, color: AppColors.textSecondary, marginTop: 2 },
  scanBadge: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: AppColors.surface, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scanIcon: { fontSize: 20 },
  hint: {
    marginHorizontal: 20, marginBottom: 8,
    backgroundColor: AppColors.warning + '20',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: AppColors.warning + '40',
  },
  hintText: { fontSize: 12, color: AppColors.text, lineHeight: 18 },
  list: { padding: 16 },
  listEmpty: { flex: 1, justifyContent: 'center' },
  permBtn: {
    margin: 24, backgroundColor: AppColors.primary,
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  permBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
