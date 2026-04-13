import { Tabs } from 'expo-router';
import React from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '../../src/components/tokens';

// ── Stable reference — defined outside the component so the object identity
//    never changes between renders. React Navigation compares by reference;
//    a new object on every render causes an infinite setState loop.
const TAB_BAR_STYLE = {
  backgroundColor: '#fff',
  borderTopColor: AppColors.border,
} as const;

const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  tabBarActiveTintColor: AppColors.primary,
  headerShown: false,
  tabBarButton: HapticTab,
  tabBarStyle: TAB_BAR_STYLE,
};

const HOME_OPTIONS = {
  title: 'Home',
  tabBarIcon: ({ color }: { color: string }) => (
    <IconSymbol size={26} name="house.fill" color={color} />
  ),
} as const;

const NEARBY_OPTIONS = {
  title: 'Nearby',
  tabBarIcon: ({ color }: { color: string }) => (
    <IconSymbol size={26} name="antenna.radiowaves.left.and.right" color={color} />
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
