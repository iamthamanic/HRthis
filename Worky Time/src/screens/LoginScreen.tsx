import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

export const LoginScreen = () => {
  const [email, setEmail] = useState('max.mustermann@workytime.de');
  const [password, setPassword] = useState('password');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Anmeldung fehlgeschlagen', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="mb-12">
            <Text className="text-4xl font-bold text-center text-blue-600 mb-2">
              WorkyTime
            </Text>
            <Text className="text-lg text-gray-600 text-center">
              Mitarbeiter Portal
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                E-Mail
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="ihre.email@firma.de"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Passwort
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Passwort eingeben"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              className={cn(
                "bg-blue-600 rounded-lg py-4 items-center mt-6",
                isLoading && "opacity-50"
              )}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 p-4 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600 mb-2 font-medium">Demo-Anmeldedaten:</Text>
            <Text className="text-xs text-gray-500">Mitarbeiter: max.mustermann@workytime.de</Text>
            <Text className="text-xs text-gray-500">Admin: anna.admin@workytime.de</Text>
            <Text className="text-xs text-gray-500">Passwort: password</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};