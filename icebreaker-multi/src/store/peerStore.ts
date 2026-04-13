import { create } from 'zustand';
import type { Peer } from '../models/Peer';

interface PeerState {
  peers: Map<string, Peer>;
  upsertPeer: (peer: Peer) => void;
  removePeer: (peerId: string) => void;
  markConnected: (peerId: string, connected: boolean) => void;
  clearPeers: () => void;
  getPeerList: () => Peer[];
}

/** SRP: only manages the collection of discovered nearby peers. */
export const usePeerStore = create<PeerState>((set, get) => ({
  peers: new Map(),

  upsertPeer: (peer: Peer) =>
    set((state) => {
      const next = new Map(state.peers);
      next.set(peer.id, peer);
      return { peers: next };
    }),

  removePeer: (peerId: string) =>
    set((state) => {
      const next = new Map(state.peers);
      next.delete(peerId);
      return { peers: next };
    }),

  markConnected: (peerId: string, connected: boolean) =>
    set((state) => {
      const existing = state.peers.get(peerId);
      if (!existing) return state;
      const next = new Map(state.peers);
      next.set(peerId, { ...existing, isConnected: connected });
      return { peers: next };
    }),

  clearPeers: () => set({ peers: new Map() }),

  getPeerList: () => Array.from(get().peers.values()),
}));
