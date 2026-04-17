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

const AVATAR_PALETTE = ['#7B61FF', '#FF6B9D', '#00C9A7', '#FF8C42', '#4ECDC4', '#A78BFA', '#FFB347'];

const getAvatarColor = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
};

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

  const avatarColor = getAvatarColor(user.name);

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
      <StatusBar barStyle="light-content" backgroundColor={AppColors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero header ── */}
        <View style={styles.hero}>
          <View style={[styles.avatarGlow, { shadowColor: avatarColor }]}>
            <View style={[styles.avatar, { backgroundColor: avatarColor + '28', borderColor: avatarColor + '60' }]}>
              <Text style={[styles.avatarText, { color: avatarColor }]}>
                {user.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.greeting}>Good to see you,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={[styles.statusPill, isAdvertising ? styles.statusActive : styles.statusIdle]}>
            <View style={[styles.statusDot, isAdvertising ? styles.dotGreen : styles.dotGray]} />
            <Text style={[styles.statusLabel, isAdvertising ? styles.statusLabelActive : styles.statusLabelIdle]}>
              {isAdvertising ? 'Live' : 'Hidden'}
            </Text>
          </View>
        </View>

        {/* ── Discovery ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Discovery</Text>
          <VisibilityToggle isVisible={isVisible} onToggle={updateVisibility} />
        </View>

        {/* ── Profile card ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Profile</Text>
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
                  placeholderTextColor={AppColors.textMuted}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelBtnText}>✕</Text>
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
            <Text style={styles.cardHint}>Visible to people you discover nearby</Text>
          </View>
        </View>

        {/* ── How it works ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How it works</Text>
          <View style={styles.stepsCard}>
            {[
              { icon: '📡', text: 'Toggle visibility to broadcast your presence via Bluetooth.' },
              { icon: '👋', text: 'Nearby IceBreaker users will see your display name.' },
              { icon: '💬', text: 'Tap someone in the Nearby tab to start a private chat.' },
            ].map((step, i) => (
              <View key={i} style={[styles.step, i < 2 && styles.stepBorder]}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 36, gap: 24 },

  // Hero
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  avatarGlow: {
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: { fontSize: 21, fontWeight: '800' },
  heroText: { flex: 1 },
  greeting: { fontSize: 13, color: AppColors.textSecondary },
  userName: { fontSize: 21, fontWeight: '700', color: AppColors.text, marginTop: 1 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusActive: { backgroundColor: AppColors.successBg, borderWidth: 1, borderColor: AppColors.success + '50' },
  statusIdle: { backgroundColor: AppColors.surface, borderWidth: 1, borderColor: AppColors.border },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  dotGreen: { backgroundColor: AppColors.success },
  dotGray: { backgroundColor: AppColors.textMuted },
  statusLabel: { fontSize: 12, fontWeight: '600' },
  statusLabelActive: { color: AppColors.success },
  statusLabelIdle: { color: AppColors.textSecondary },

  // Section
  section: { gap: 10 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: 2,
  },

  // Card
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardHint: { fontSize: 12, color: AppColors.textMuted },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameText: { fontSize: 17, fontWeight: '600', color: AppColors.text, flex: 1 },
  editBtn: {
    backgroundColor: AppColors.primaryGlow,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: AppColors.borderAccent,
  },
  editBtnText: { color: AppColors.primaryLight, fontWeight: '600', fontSize: 13 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editInput: {
    flex: 1,
    backgroundColor: AppColors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 16,
    color: AppColors.text,
    borderWidth: 1,
    borderColor: AppColors.borderAccent,
  },
  saveBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelBtn: {
    backgroundColor: AppColors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cancelBtnText: { color: AppColors.textSecondary, fontSize: 14 },

  // Steps
  stepsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  stepBorder: { borderBottomWidth: 1, borderBottomColor: AppColors.border },
  stepIcon: { fontSize: 20, marginTop: 1 },
  stepText: { flex: 1, fontSize: 13, color: AppColors.textSecondary, lineHeight: 19 },
});

