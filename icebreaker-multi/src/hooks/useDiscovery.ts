import { useEffect, useCallback } from 'react';
import { useServices } from '../container/ServiceProvider';
import { usePeerStore } from '../store/peerStore';
import { useUserStore } from '../store/userStore';

/**
 * SRP: orchestrates BLE scanning + advertising together as one "discovery" concern.
 * DIP: depends on IScanner/IAdvertiser via the service container, not concrete classes.
 */
export function useDiscovery() {
  const { scanner, advertiser } = useServices();
  const { upsertPeer, removePeer, clearPeers } = usePeerStore();
  const user = useUserStore((s) => s.user);
  const isVisible = useUserStore((s) => s.isVisible);
  const isScanning = scanner.isScanning;
  const isAdvertising = advertiser.isAdvertising;

  const startDiscovery = useCallback(() => {
    clearPeers();
    scanner.startScan(
      (peer) => upsertPeer(peer),
      (peerId) => removePeer(peerId),
    );
  }, [scanner, upsertPeer, removePeer, clearPeers]);

  const stopDiscovery = useCallback(() => {
    scanner.stopScan();
  }, [scanner]);

  // Automatically advertise when visibility is toggled on
  useEffect(() => {
    if (isVisible && user) {
      advertiser.startAdvertising(user).catch(console.error);
    } else {
      advertiser.stopAdvertising();
    }
    return () => {
      advertiser.stopAdvertising();
    };
  }, [isVisible, user, advertiser]);

  return { startDiscovery, stopDiscovery, isScanning, isAdvertising };
}
