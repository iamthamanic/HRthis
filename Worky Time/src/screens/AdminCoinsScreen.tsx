import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useCoinsStore } from '../state/coins';
import { cn } from '../utils/cn';

export const AdminCoinsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { 
    userCoins, 
    addCoinsToUser, 
    redemptions, 
    approveBenefitRedemption,
    rejectBenefitRedemption,
    benefits,
    isLoading 
  } = useCoinsStore();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [coinsToAdd, setCoinsToAdd] = useState('');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState<'distribute' | 'redemptions'>('distribute');

  // Mock users for admin panel (in real app, this would come from API)
  const mockUsers = [
    { id: '1', name: 'Max Mustermann', email: 'max.mustermann@workytime.de' },
    { id: '3', name: 'Tom Klein', email: 'tom.klein@workytime.de' },
    { id: '4', name: 'Lisa Schmidt', email: 'lisa.schmidt@workytime.de' },
    { id: '5', name: 'Julia Bauer', email: 'julia.bauer@workytime.de' },
    { id: '6', name: 'Marco Lehmann', email: 'marco.lehmann@workytime.de' }
  ];

  const handleDistributeCoins = async () => {
    if (!user || !selectedUserId || !coinsToAdd || !reason) {
      Alert.alert('Fehler', 'Bitte alle Felder ausfüllen.');
      return;
    }

    const coins = parseInt(coinsToAdd);
    if (isNaN(coins) || coins <= 0) {
      Alert.alert('Fehler', 'Bitte eine gültige Anzahl Coins eingeben.');
      return;
    }

    try {
      await addCoinsToUser(selectedUserId, coins, reason, user.id);
      Alert.alert(
        'Erfolgreich!',
        `${coins} Coins wurden erfolgreich verteilt.`,
        [{ text: 'OK' }]
      );
      
      // Reset form
      setSelectedUserId('');
      setCoinsToAdd('');
      setReason('');
    } catch (error) {
      Alert.alert('Fehler', 'Coins konnten nicht verteilt werden.');
    }
  };

  const handleApproveRedemption = (redemptionId: string) => {
    Alert.alert(
      'Antrag genehmigen',
      'Möchten Sie diesen Benefit-Antrag genehmigen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Genehmigen',
          onPress: () => {
            approveBenefitRedemption(redemptionId);
            Alert.alert('Genehmigt', 'Der Antrag wurde genehmigt.');
          }
        }
      ]
    );
  };

  const handleRejectRedemption = (redemptionId: string) => {
    Alert.alert(
      'Antrag ablehnen',
      'Grund für die Ablehnung (optional):',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Ablehnen',
          onPress: () => {
            rejectBenefitRedemption(redemptionId, 'Vom Administrator abgelehnt');
            Alert.alert('Abgelehnt', 'Der Antrag wurde abgelehnt und die Coins wurden zurückerstattet.');
          }
        }
      ]
    );
  };

  const getUserName = (userId: string) => {
    const mockUser = mockUsers.find(u => u.id === userId);
    return mockUser?.name || 'Unbekannter Benutzer';
  };

  const getBenefitTitle = (benefitId: string) => {
    const benefit = benefits.find(b => b.id === benefitId);
    return benefit?.title || 'Unbekannter Benefit';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingRedemptions = redemptions.filter(r => r.status === 'PENDING');

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-4xl mb-4">🚫</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Zugang verweigert
        </Text>
        <Text className="text-gray-600 text-center px-8 mb-4">
          Diese Funktion ist nur für Administratoren verfügbar.
        </Text>
        <Pressable 
          onPress={() => navigation.goBack()}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Coin Verwaltung
          </Text>
        </View>

        {/* Admin Badge */}
        <View className="bg-orange-100 border border-orange-200 rounded-lg p-3 mb-6">
          <Text className="text-orange-800 font-medium text-center">
            👑 Administrator Panel
          </Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6 shadow-sm">
          <Pressable
            onPress={() => setActiveTab('distribute')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              activeTab === 'distribute' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              activeTab === 'distribute' ? "text-white" : "text-gray-700"
            )}>
              Coins verteilen
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('redemptions')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              activeTab === 'redemptions' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <View className="flex-row items-center justify-center">
              <Text className={cn(
                "font-medium mr-1",
                activeTab === 'redemptions' ? "text-white" : "text-gray-700"
              )}>
                Anträge
              </Text>
              {pendingRedemptions.length > 0 && (
                <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {pendingRedemptions.length}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        {activeTab === 'distribute' ? (
          <>
            {/* Coin Distribution Form */}
            <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                🪙 Coins an Mitarbeiter verteilen
              </Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Mitarbeiter auswählen
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mb-2"
                  >
                    {mockUsers.map((mockUser) => (
                      <Pressable
                        key={mockUser.id}
                        onPress={() => setSelectedUserId(mockUser.id)}
                        className={cn(
                          "mr-3 px-4 py-2 rounded-lg border",
                          selectedUserId === mockUser.id
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <Text className={cn(
                          "font-medium text-sm",
                          selectedUserId === mockUser.id
                            ? "text-white"
                            : "text-gray-700"
                        )}>
                          {mockUser.name}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Anzahl Coins
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="z.B. 100"
                    value={coinsToAdd}
                    onChangeText={setCoinsToAdd}
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Grund/Anlass
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 h-20"
                    placeholder="z.B. Hervorragende Projektarbeit"
                    value={reason}
                    onChangeText={setReason}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <Pressable
                  onPress={handleDistributeCoins}
                  disabled={isLoading || !selectedUserId || !coinsToAdd || !reason}
                  className={cn(
                    "bg-green-600 rounded-lg py-4 items-center",
                    (isLoading || !selectedUserId || !coinsToAdd || !reason) && "opacity-50"
                  )}
                >
                  <Text className="text-white font-semibold">
                    {isLoading ? 'Wird verteilt...' : 'Coins verteilen'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Current Coin Balances */}
            <View className="bg-white rounded-xl p-6 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                💰 Aktuelle Coin-Stände
              </Text>
              
              <View className="space-y-3">
                {mockUsers.map((mockUser) => {
                  const coins = userCoins.find(uc => uc.userId === mockUser.id);
                  return (
                    <View key={mockUser.id} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                      <View>
                        <Text className="font-medium text-gray-900">
                          {mockUser.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {mockUser.email}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-green-600">
                          🪙 {coins?.availableCoins || 0}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Gesamt: {coins?.totalCoins || 0}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          /* Benefit Redemptions */
          <View className="space-y-4">
            {pendingRedemptions.map((redemption) => (
              <View key={redemption.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      {getBenefitTitle(redemption.benefitId)}
                    </Text>
                    <Text className="text-gray-600 mb-2">
                      Angefordert von: {getUserName(redemption.userId)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatDate(redemption.requestedAt)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-red-600">
                      -{redemption.coinsCost}
                    </Text>
                    <Text className="text-xs text-gray-500">Coins</Text>
                  </View>
                </View>
                
                <View className="flex-row space-x-3">
                  <Pressable
                    onPress={() => handleApproveRedemption(redemption.id)}
                    className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                  >
                    <Text className="text-white font-medium">
                      ✅ Genehmigen
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleRejectRedemption(redemption.id)}
                    className="flex-1 bg-red-600 rounded-lg py-3 items-center"
                  >
                    <Text className="text-white font-medium">
                      ❌ Ablehnen
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
            
            {pendingRedemptions.length === 0 && (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Text className="text-4xl mb-4">✅</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Keine ausstehenden Anträge
                </Text>
                <Text className="text-gray-600 text-center">
                  Alle Benefit-Anträge sind bearbeitet.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};