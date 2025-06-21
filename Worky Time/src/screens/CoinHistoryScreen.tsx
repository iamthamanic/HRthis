import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useCoinsStore } from '../state/coins';
import { CoinTransaction, BenefitRedemption } from '../types/benefits';
import { cn } from '../utils/cn';

export const CoinHistoryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { 
    getUserCoins, 
    getUserTransactions, 
    getUserRedemptions,
    benefits 
  } = useCoinsStore();
  
  const [activeTab, setActiveTab] = useState<'transactions' | 'redemptions'>('transactions');
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<BenefitRedemption[]>([]);

  const userCoins = user ? getUserCoins(user.id) : null;

  useEffect(() => {
    if (user) {
      setTransactions(getUserTransactions(user.id));
      setRedemptions(getUserRedemptions(user.id));
    }
  }, [user, getUserTransactions, getUserRedemptions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction: CoinTransaction) => {
    switch (transaction.type) {
      case 'EARNED':
        return '💰';
      case 'SPENT':
        return '🛒';
      case 'ADMIN_ADDED':
        return '🎁';
      default:
        return '🪙';
    }
  };

  const getTransactionColor = (transaction: CoinTransaction) => {
    return transaction.amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ausstehend';
      case 'APPROVED':
        return 'Genehmigt';
      case 'FULFILLED':
        return 'Erfüllt';
      case 'REJECTED':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  const getBenefitTitle = (benefitId: string) => {
    const benefit = benefits.find(b => b.id === benefitId);
    return benefit?.title || 'Unbekannter Benefit';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Coin Verlauf
          </Text>
        </View>

        {/* Coin Summary */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Coin Übersicht
            </Text>
            <Text className="text-3xl">🪙</Text>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Verfügbare Coins</Text>
              <Text className="font-bold text-green-600">
                {userCoins?.availableCoins || 0}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Ausgegebene Coins</Text>
              <Text className="font-medium text-red-600">
                {userCoins?.spentCoins || 0}
              </Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between">
              <Text className="text-gray-900 font-medium">Gesamt verdient</Text>
              <Text className="font-bold text-blue-600">
                {userCoins?.totalCoins || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6 shadow-sm">
          <Pressable
            onPress={() => setActiveTab('transactions')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              activeTab === 'transactions' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              activeTab === 'transactions' ? "text-white" : "text-gray-700"
            )}>
              Transaktionen
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('redemptions')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              activeTab === 'redemptions' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              activeTab === 'redemptions' ? "text-white" : "text-gray-700"
            )}>
              Einlösungen
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {activeTab === 'transactions' ? (
          <View className="space-y-3">
            {transactions.map((transaction) => (
              <View key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">
                      {getTransactionIcon(transaction)}
                    </Text>
                    <View>
                      <Text className="font-semibold text-gray-900">
                        {transaction.reason}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text className={cn(
                    "text-lg font-bold",
                    getTransactionColor(transaction)
                  )}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </Text>
                </View>
              </View>
            ))}
            
            {transactions.length === 0 && (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Text className="text-4xl mb-4">📝</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Transaktionen
                </Text>
                <Text className="text-gray-600 text-center">
                  Du hast noch keine Coin-Transaktionen.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="space-y-3">
            {redemptions.map((redemption) => (
              <View key={redemption.id} className="bg-white rounded-xl p-4 shadow-sm">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      {getBenefitTitle(redemption.benefitId)}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-2">
                      Angefordert am {formatDate(redemption.requestedAt)}
                    </Text>
                    <View className={cn(
                      "px-2 py-1 rounded-full self-start",
                      getStatusColor(redemption.status)
                    )}>
                      <Text className="text-xs font-medium">
                        {getStatusText(redemption.status)}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-red-600">
                      -{redemption.coinsCost}
                    </Text>
                    <Text className="text-xs text-gray-500">Coins</Text>
                  </View>
                </View>
                
                {redemption.fulfilledAt && (
                  <Text className="text-sm text-green-600">
                    ✅ Erfüllt am {formatDate(redemption.fulfilledAt)}
                  </Text>
                )}
                
                {redemption.notes && (
                  <View className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-sm text-gray-700">
                      💬 {redemption.notes}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            
            {redemptions.length === 0 && (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Text className="text-4xl mb-4">🎁</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Einlösungen
                </Text>
                <Text className="text-gray-600 text-center">
                  Du hast noch keine Benefits eingelöst.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};