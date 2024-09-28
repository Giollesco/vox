import { useAuth } from '@/core';
import { Text, View } from '@/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export default function LogoutButton() {
  // Hooks
  const auth = useAuth();

  // Functions
  function handleLogout() {
    auth.signOut();
    impactAsync(ImpactFeedbackStyle.Heavy);
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
      <View className="flex-1 items-center justify-center pt-2">
        <MaterialIcons
          name="logout"
          size={18}
          color="black"
          style={{ opacity: 0.5 }}
        />
        <Text className="text-center text-sm" style={{ paddingTop: 2 }}>
          Odjava
        </Text>
      </View>
    </TouchableOpacity>
  );
}
