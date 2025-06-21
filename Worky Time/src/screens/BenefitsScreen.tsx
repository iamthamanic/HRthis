import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useCoinsStore } from '../state/coins';
import { Benefit } from '../types/benefits';
import { cn } from '../utils/cn';

export const BenefitsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { 
    benefits, 
    getUserCoins, 
    redeemBenefit, 
    getUserRedemptions,
    isLoading 
  } = useCoinsStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);

  const userCoins = user ? getUserCoins(user.id) : null;
  const categories = [
    { key: 'ALL', label: 'Alle', icon: '🎁' },
    { key: 'TIME', label: 'Zeit', icon: '⏰' },
    { key: 'WELLNESS', label: 'Wellness', icon: '💆‍♀️' },
    { key: 'FOOD', label: 'Essen', icon: '🍽️' },
    { key: 'OFFICE', label: 'Büro', icon: '🏢' },
    { key: 'LEARNING', label: 'Lernen', icon: '📚' }
  ];

  useEffect(() => {
    const filtered = selectedCategory === 'ALL' 
      ? benefits.filter(b => b.isActive)
      : benefits.filter(b => b.isActive && b.category === selectedCategory);
    
    setFilteredBenefits(filtered.sort((a, b) => a.coinCost - b.coinCost));
  }, [benefits, selectedCategory]);

  const handleRedeemBenefit = async (benefit: Benefit) => {
    if (!user || !userCoins) return;

    if (userCoins.availableCoins < benefit.coinCost) {
      Alert.alert(
        'Nicht genügend Coins',
        `Du benötigst ${benefit.coinCost} Coins, hast aber nur ${userCoins.availableCoins} verfügbar.`
      );
      return;
    }

    if (benefit.quantity !== null && benefit.quantity !== undefined && benefit.quantity <= benefit.redeemCount) {
      Alert.alert('Ausverkauft', 'Dieser Benefit ist leider nicht mehr verfügbar.');
      return;
    }

    Alert.alert(
      'Benefit einlösen',
      `Möchtest du "${benefit.title}" für ${benefit.coinCost} Coins einlösen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Einlösen',
          onPress: async () => {
            try {
              await redeemBenefit(user.id, benefit.id);
              Alert.alert(
                'Erfolgreich eingelöst!',
                'Dein Benefit-Antrag wurde eingereicht und wird bearbeitet.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Fehler', error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
            }
          }
        }
      ]
    );
  };

  const getBenefitAvailability = (benefit: Benefit) => {
    if (benefit.quantity === null) return 'Unbegrenzt';
    const remaining = (benefit.quantity || 0) - benefit.redeemCount;
    return `${remaining} verfügbar`;
  };

  const canAffordBenefit = (coinCost: number) => {
    return userCoins ? userCoins.availableCoins >= coinCost : false;
  };

  const isAvailable = (benefit: Benefit) => {
    return benefit.quantity === null || (benefit.quantity !== null && benefit.quantity > benefit.redeemCount);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header with Coin Balance */}
        <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-semibold mb-1">
                Deine Coins
              </Text>
              <Text className="text-white text-3xl font-bold">
                🪙 {userCoins?.availableCoins || 0}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white/80 text-sm">Gesamt verdient</Text>
              <Text className="text-white text-xl font-semibold">
                {userCoins?.totalCoins || 0}
              </Text>
            </View>
          </View>
          
          <Pressable 
            onPress={() => navigation.navigate('CoinHistory' as never)}
            className="mt-4 bg-white/20 rounded-lg py-2 px-4 self-start"
          >
            <Text className="text-white font-medium">Verlauf anzeigen</Text>
          </Pressable>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              className={cn(
                "mr-3 px-4 py-2 rounded-full border",
                selectedCategory === category.key
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              )}
            >
              <Text className={cn(
                "font-medium",
                selectedCategory === category.key
                  ? "text-white"
                  : "text-gray-700"
              )}>
                {category.icon} {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Benefits Grid */}
        <View className="space-y-4">
          {filteredBenefits.map((benefit) => {
            const affordable = canAffordBenefit(benefit.coinCost);
            const available = isAvailable(benefit);
            const canRedeem = affordable && available;
            
            return (
              <Pressable
                key={benefit.id}
                onPress={() => canRedeem && handleRedeemBenefit(benefit)}
                disabled={!canRedeem || isLoading}
                className={cn(
                  "bg-white rounded-xl p-4 shadow-sm",
                  !canRedeem && "opacity-60"
                )}
              >
                <View className="flex-row items-start">
                  <View className="w-16 h-16 bg-blue-50 rounded-xl items-center justify-center mr-4">
                    <Text className="text-3xl">{benefit.icon}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-lg font-semibold text-gray-900 flex-1">
                        {benefit.title}
                      </Text>
                      <View className="bg-yellow-100 px-3 py-1 rounded-full ml-2">
                        <Text className="text-yellow-800 font-bold">
                          🪙 {benefit.coinCost}
                        </Text>
                      </View>
                    </View>
                    
                    <Text className="text-gray-600 mb-3 leading-5">
                      {benefit.description}
                    </Text>
                    
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-gray-500">
                        {getBenefitAvailability(benefit)}
                      </Text>
                      
                      {!affordable && (
                        <Text className="text-sm text-red-600 font-medium">
                          Nicht genügend Coins
                        </Text>
                      )}
                      
                      {!available && (
                        <Text className="text-sm text-orange-600 font-medium">
                          Ausverkauft
                        </Text>
                      )}
                      
                      {canRedeem && (
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                          <Text className="text-green-800 text-sm font-medium">
                            Einlösen
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {filteredBenefits.length === 0 && (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <Text className="text-4xl mb-4">🎁</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Keine Benefits verfügbar
            </Text>
            <Text className="text-gray-600 text-center">
              In dieser Kategorie sind aktuell keine Benefits verfügbar.
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 font-medium mb-2">
            💡 Wie funktioniert das Coin-System?
          </Text>
          <Text className="text-blue-700 text-sm">
            • Sammle Coins durch gute Leistung und besondere Projekte{'\n'}
            • Löse Benefits mit deinen Coins ein{'\n'}
            • Deine Anträge werden vom HR-Team bearbeitet{'\n'}
            • Bei Ablehnung erhältst du deine Coins zurück
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};