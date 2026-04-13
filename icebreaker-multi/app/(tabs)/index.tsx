import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useUserProfile } from '../../src/hooks/useUserProfile';
import { useDiscovery } from '../../src/hooks/useDiscovery';
import { VisibilityToggle } from '../../src/components/VisibilityToggle';
import { UserSetup } from '../../src/components/UserSetup';
import { AppColors } from '../../src/components/tokens';

export default function HomeScreen() {
  const { user, isVisible, saveName, updateVisibility } = useUserProfile();
  const { isAdvertising } = useDiscovery();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <UserSetup onSave={saveName} />
      </SafeAreaView>
    );
  }

  const handleEditName = () => {
    setDraftName(user.name);
    setEditing(true);
  };

  const handleSaveName = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a valid name.');
      return;
    }
    await saveName(trimmed);
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>

        {/* Status banner */}
        <View style={[styles.banner, isAdvertising ? styles.bannerActive : styles.bannerIdle]}>
          <Text style={styles.bannerDot}>{isAdvertising ? '🟢' : '⚪'}</Text>
          <Text style={styles.bannerText}>
            {isAdvertising ? 'Broadcasting your presence nearby' : 'Currently hidden from others'}
          </Text>
        </View>

        {/* Name card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Display Name</Text>
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.editInput}
                value={draftName}
                onChangeText={setDraftName}
                autoFocus
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{user.name}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={handleEditName}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.cardHint}>
            This is the name others will see when you are discoverable.
          </Text>
        </View>

        {/* Visibility toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery</Text>
          <VisibilityToggle isVisible={isVisible} onToggle={updateVisibility} />
        </View>

        {/* Info section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoLine}>📡  Toggle visibility so your phone broadcasts via Bluetooth.</Text>
          <Text style={styles.infoLine}>👋  Nearby users running IceBreaker will see your name.</Text>
          <Text style={styles.infoLine}>💬  Tap a person in the Nearby tab to start chatting.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  scroll: { padding: 20, gap: 16 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  avatar: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: AppColors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  greeting: { fontSize: 14, color: AppColors.textSecondary },
  userName: { fontSize: 22, fontWeight: '700', color: AppColors.text },

  banner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  bannerActive: { backgroundColor: '#DCFCE7' },
  bannerIdle: { backgroundColor: AppColors.surface },
  bannerDot: { fontSize: 16 },
  bannerText: { fontSize: 13, color: AppColors.text, flex: 1 },

  card: {
    backgroundColor: AppColors.surface, borderRadius: 14, padding: 16, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardLabel: {
    fontSize: 12, fontWeight: '600', color: AppColors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  cardHint: { fontSize: 12, color: AppColors.textSecondary },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameText: { fontSize: 18, fontWeight: '600', color: AppColors.text, flex: 1 },
  editBtn: {
    backgroundColor: AppColors.primary + '18', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  editBtnText: { color: AppColors.primary, fontWeight: '600', fontSize: 13 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editInput: {
    flex: 1, backgroundColor: AppColors.background, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, color: AppColors.text,
    borderWidth: 1, borderColor: AppColors.border,
  },
  saveBtn: {
    backgroundColor: AppColors.primary, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  cancelBtn: { paddingHorizontal: 8, paddingVertical: 8 },
  cancelBtnText: { color: AppColors.textSecondary, fontSize: 13 },

  section: { gap: 10 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: AppColors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  infoCard: {
    backgroundColor: AppColors.primary + '0D', borderRadius: 14, padding: 16, gap: 8,
    borderWidth: 1, borderColor: AppColors.primary + '30',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: AppColors.primary },
  infoLine: { fontSize: 13, color: AppColors.text, lineHeight: 20 },
});
