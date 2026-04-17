import { Tabs } from 'expo-router';
import React from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '../../src/components/tokens';

const TAB_BAR_STYLE = {
  backgroundColor: AppColors.surface,
  borderTopWidth: 1,
  borderTopColor: AppColors.border,
  height: 62,
  paddingBottom: 10,
  paddingTop: 8,
  elevation: 0,
} as const;

const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  tabBarActiveTintColor: AppColors.primary,
  tabBarInactiveTintColor: AppColors.textMuted,
  headerShown: false,
  tabBarButton: HapticTab,
  tabBarStyle: TAB_BAR_STYLE,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
};

const HOME_OPTIONS = {
  title: 'Home',
  tabBarIcon: ({ color }: { color: string }) => (
    <IconSymbol size={24} name="house.fill" color={color} />
  ),
} as const;

const NEARBY_OPTIONS = {
  title: 'Nearby',
  tabBarIcon: ({ color }: { color: string }) => (
    <IconSymbol size={24} name="antenna.radiowaves.left.and.right" color={color} />
  ),
} as const;

export default function TabLayout() {
  return (
    <Tabs screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen name="index" options={HOME_OPTIONS} />
      <Tabs.Screen name="explore" options={NEARBY_OPTIONS} />
    </Tabs>
  );
}
