import { useAuth } from '@/core';
import { Text, View } from '@/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export default function LogoutButton() {
  // Hooks
  const auth = useAuth();

  // Functions
  function handleLogout() {
    auth.signOut();
    impactAsync(ImpactFeedbackStyle.Heavy);
  }

  const createTwoButtonAlert = () =>
    Alert.alert('Odjava', 'Jeste li sigurni da se želite odjaviti?', [
      {
        text: 'Odustani',
        style: 'cancel',
      },
      {
        text: 'Odjava',
        style: 'destructive',
        onPress: handleLogout,
      },
    ]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={createTwoButtonAlert}>
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
