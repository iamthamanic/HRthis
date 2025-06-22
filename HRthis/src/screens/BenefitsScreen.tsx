import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../state/auth';
import { useCoinsStore, type CoinRule } from '../state/coins';
import { useShopStore, type ShopBenefit } from '../state/shop';
import { useCoinEventsStore, type CoinEvent } from '../state/coinEvents';
import { cn } from '../utils/cn';

/**
 * Main benefits management screen
 * Provides interfaces for:
 * - Shopping for benefits with coins
 * - Viewing coin earning rules
 * - Transaction history
 * - Admin: Managing coins, benefits, rules, and events
 */
export const BenefitsScreen = () => {
  const { user } = useAuthStore();
  const { 
    getUserBalance, 
    getUserTransactions, 
    getAllTransactions,
    getCoinRules, 
    grantCoins,
    addCoinRule,
    updateCoinRule,
    deleteCoinRule,
    isLoading: coinsLoading 
  } = useCoinsStore();
  const { 
    getActiveBenefits, 
    purchaseBenefit,
    addBenefit,
    updateBenefit,
    deleteBenefit,
    isLoading: shopLoading
  } = useShopStore();
  const {
    getActiveEvents,
    getUnlockedEvents,
    getNextEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    isLoading: eventsLoading
  } = useCoinEventsStore();
  
  const [activeTab, setActiveTab] = useState<'shop' | 'earn' | 'history' | 'manage'>('shop');
  const [userBalance, setUserBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // State for coin granting
  const [selectedUserId, setSelectedUserId] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [coinReason, setCoinReason] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [error, setError] = useState('');

  // State for history view (admin)
  const [selectedHistoryUserId, setSelectedHistoryUserId] = useState('');

  // State for rule management
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<CoinRule | null>(null);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleAmount, setRuleAmount] = useState('');

  // State for benefit management
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<ShopBenefit | null>(null);
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [benefitCost, setBenefitCost] = useState('');
  const [benefitCategory, setBenefitCategory] = useState<'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER'>('WELLNESS');
  const [benefitStockLimit, setBenefitStockLimit] = useState('');
  const [benefitUnlimited, setBenefitUnlimited] = useState(true);

  // State for event management
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CoinEvent | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventRequiredCoins, setEventRequiredCoins] = useState('');
  const [eventReward, setEventReward] = useState('');

  useEffect(() => {
    if (user) {
      const balance = getUserBalance(user.id);
      setUserBalance(balance.currentBalance);
      setIsAdmin(user.role === 'ADMIN' || user.role === 'SUPERADMIN');
      
      // Default to shop for regular users, manage for admins
      if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
        setActiveTab('manage');
      }
    }
  }, [user, getUserBalance]);

  /**
   * Formats an ISO date string to German locale format
   * @param dateString - ISO date string to format
   * @returns Formatted date string (dd.mm.yyyy hh:mm)
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Gets the display name for a user ID
   * @param userId - The user ID to get the name for
   * @returns The display name or 'Unbekannt' if not found
   */
  const getUserName = (userId: string): string => {
    const names: { [key: string]: string } = {
      '1': 'Max M.',
      '2': 'Anna A.',
      '3': 'Tom K.',
      '4': 'Lisa S.',
      '5': 'Julia B.',
      '6': 'Marco L.'
    };
    return names[userId] || 'Unbekannt';
  };

  const availableUsers = [
    { id: '1', name: 'Max M.' },
    { id: '2', name: 'Anna A.' },
    { id: '3', name: 'Tom K.' },
    { id: '4', name: 'Lisa S.' },
    { id: '5', name: 'Julia B.' },
    { id: '6', name: 'Marco L.' }
  ];

  /**
   * Handles the coin granting form submission
   * Allows admins to grant coins based on predefined rules or custom reasons
   * @param e - Form event
   */
  const handleGrantCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;
    
    setError('');
    
    if (!selectedUserId) {
      setError('Bitte wählen Sie einen Mitarbeiter aus');
      return;
    }

    if (!isCustomReason && !selectedRuleId) {
      setError('Bitte wählen Sie eine Regel aus');
      return;
    }

    if (isCustomReason && (!coinAmount || !coinReason)) {
      setError('Bitte geben Sie Anzahl und Begründung ein');
      return;
    }

    let amount: number;
    let reason: string;

    if (isCustomReason) {
      amount = parseInt(coinAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Bitte geben Sie eine gültige Coin-Anzahl ein');
        return;
      }
      reason = coinReason;
    } else {
      // Using predefined rule for coin amount and reason
      const selectedRule = getCoinRules().find(rule => rule.id === selectedRuleId);
      if (!selectedRule) {
        setError('Ungültige Regel ausgewählt');
        return;
      }
      amount = selectedRule.coinAmount;
      reason = selectedRule.title;
    }

    try {
      await grantCoins(selectedUserId, amount, reason, user.id);
      // Reset form after successful submission
      setSelectedUserId('');
      setCoinAmount('');
      setCoinReason('');
      setSelectedRuleId('');
      setIsCustomReason(false);
    } catch (error) {
      setError('Fehler beim Verteilen der Coins');
    }
  };

  /**
   * Handles benefit purchase by a user
   * @param benefitId - ID of the benefit to purchase
   * @param coinCost - Cost of the benefit in coins
   */
  const handlePurchaseBenefit = async (benefitId: string, coinCost: number) => {
    if (!user) return;
    
    if (userBalance < coinCost) {
      setError('Nicht genügend Coins für diesen Kauf');
      return;
    }

    try {
      await purchaseBenefit(user.id, benefitId);
      // Update displayed balance after purchase
      const newBalance = getUserBalance(user.id);
      setUserBalance(newBalance.currentBalance);
    } catch (error) {
      setError('Fehler beim Kauf des Benefits');
    }
  };

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    setError('');

    if (!ruleTitle || !ruleDescription || !ruleAmount) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    const amount = parseInt(ruleAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Bitte geben Sie eine gültige Coin-Anzahl ein');
      return;
    }

    try {
      if (editingRule) {
        await updateCoinRule(editingRule.id, {
          title: ruleTitle,
          description: ruleDescription,
          coinAmount: amount
        });
      } else {
        await addCoinRule({
          title: ruleTitle,
          description: ruleDescription,
          coinAmount: amount,
          isActive: true
        });
      }
      
      // Reset form
      setShowRuleForm(false);
      setEditingRule(null);
      setRuleTitle('');
      setRuleDescription('');
      setRuleAmount('');
    } catch (error) {
      setError('Fehler beim Speichern der Regel');
    }
  };

  /**
   * Prepares the form for editing an existing rule
   * @param rule - The rule to edit
   */
  const handleEditRule = (rule: CoinRule) => {
    setEditingRule(rule);
    setRuleTitle(rule.title);
    setRuleDescription(rule.description);
    setRuleAmount(rule.coinAmount.toString());
    setShowRuleForm(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!user || !isAdmin) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie diese Regel löschen möchten?')) {
      try {
        await deleteCoinRule(ruleId);
      } catch (error) {
        setError('Fehler beim Löschen der Regel');
      }
    }
  };

  const resetRuleForm = () => {
    setShowRuleForm(false);
    setEditingRule(null);
    setRuleTitle('');
    setRuleDescription('');
    setRuleAmount('');
    setError('');
  };

  const handleBenefitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    setError('');

    if (!benefitTitle || !benefitDescription || !benefitCost || !benefitCategory) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const cost = parseInt(benefitCost);
    if (isNaN(cost) || cost <= 0) {
      setError('Bitte geben Sie einen gültigen Coin-Preis ein');
      return;
    }

    const stockLimit = benefitUnlimited ? undefined : parseInt(benefitStockLimit);
    if (!benefitUnlimited && (isNaN(stockLimit!) || stockLimit! <= 0)) {
      setError('Bitte geben Sie einen gültigen Lagerbestand ein');
      return;
    }

    try {
      if (editingBenefit) {
        await updateBenefit(editingBenefit.id, {
          title: benefitTitle,
          description: benefitDescription,
          coinCost: cost,
          category: benefitCategory,
          stockLimit: stockLimit,
          currentStock: stockLimit
        });
      } else {
        await addBenefit({
          title: benefitTitle,
          description: benefitDescription,
          coinCost: cost,
          category: benefitCategory,
          isActive: true,
          stockLimit: stockLimit,
          currentStock: stockLimit
        });
      }
      
      // Reset form
      resetBenefitForm();
    } catch (error) {
      setError('Fehler beim Speichern des Benefits');
    }
  };

  /**
   * Prepares the form for editing an existing benefit
   * @param benefit - The benefit to edit
   */
  const handleEditBenefit = (benefit: ShopBenefit) => {
    setEditingBenefit(benefit);
    setBenefitTitle(benefit.title);
    setBenefitDescription(benefit.description);
    setBenefitCost(benefit.coinCost.toString());
    setBenefitCategory(benefit.category);
    setBenefitUnlimited(!benefit.stockLimit);
    setBenefitStockLimit(benefit.stockLimit?.toString() || '');
    setShowBenefitForm(true);
  };

  const handleDeleteBenefit = async (benefitId: string) => {
    if (!user || !isAdmin) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie dieses Benefit löschen möchten?')) {
      try {
        await deleteBenefit(benefitId);
      } catch (error) {
        setError('Fehler beim Löschen des Benefits');
      }
    }
  };

  const resetBenefitForm = () => {
    setShowBenefitForm(false);
    setEditingBenefit(null);
    setBenefitTitle('');
    setBenefitDescription('');
    setBenefitCost('');
    setBenefitCategory('WELLNESS');
    setBenefitUnlimited(true);
    setBenefitStockLimit('');
    setError('');
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    setError('');

    if (!eventTitle || !eventDescription || !eventRequiredCoins || !eventReward) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    const requiredCoins = parseInt(eventRequiredCoins);
    if (isNaN(requiredCoins) || requiredCoins <= 0) {
      setError('Bitte geben Sie eine gültige Coin-Anzahl ein');
      return;
    }

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          title: eventTitle,
          description: eventDescription,
          requiredCoins: requiredCoins,
          reward: eventReward
        });
      } else {
        await addEvent({
          title: eventTitle,
          description: eventDescription,
          requiredCoins: requiredCoins,
          reward: eventReward,
          isActive: true
        });
      }
      
      // Reset form
      resetEventForm();
    } catch (error) {
      setError('Fehler beim Speichern des Events');
    }
  };

  /**
   * Prepares the form for editing an existing coin event
   * @param event - The event to edit
   */
  const handleEditEvent = (event: CoinEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventRequiredCoins(event.requiredCoins.toString());
    setEventReward(event.reward);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user || !isAdmin) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        setError('Fehler beim Löschen des Events');
      }
    }
  };

  const resetEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventTitle('');
    setEventDescription('');
    setEventRequiredCoins('');
    setEventReward('');
    setError('');
  };

  /**
   * Returns an emoji icon for a given benefit category
   * @param category - The benefit category
   * @returns Emoji icon representing the category
   */
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'WELLNESS': return '💆';
      case 'FOOD': return '🍽️';
      case 'TECH': return '💻';
      case 'TIME_OFF': return '🏖️';
      default: return '🎁';
    }
  };

  /**
   * Returns the display name for a given benefit category
   * @param category - The benefit category
   * @returns Localized category name in German
   */
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'WELLNESS': return 'Wellness';
      case 'FOOD': return 'Essen & Trinken';
      case 'TECH': return 'Technologie';
      case 'TIME_OFF': return 'Freizeit';
      default: return 'Sonstiges';
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Benefits & Coins
          </h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm text-gray-500">Meine Coins: </span>
            <span className="text-lg font-bold text-blue-600">{userBalance}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('shop')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors",
              activeTab === 'shop' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="text-center font-medium text-sm">
              🪙 Coins einlösen
            </span>
          </button>
          <button
            onClick={() => setActiveTab('earn')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors",
              activeTab === 'earn' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="text-center font-medium text-sm">
              💰 Coins bekommen
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors",
              activeTab === 'history' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="text-center font-medium text-sm">
              📊 Historie
            </span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('manage')}
              className={cn(
                "flex-1 py-2 px-3 rounded-md transition-colors",
                activeTab === 'manage' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="text-center font-medium text-sm">
                ⚙️ Verwaltung
              </span>
            </button>
          )}
        </div>

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-4">
            {/* Coin Events Progress Bar */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
              <div className="mb-3">
                <h3 className="font-semibold text-lg">🎯 Coin Events</h3>
                <p className="text-sm opacity-90">Erreiche Meilensteine und erhalte Belohnungen!</p>
              </div>
              
              {(() => {
                const unlockedEvents = getUnlockedEvents(userBalance);
                const nextEvent = getNextEvent(userBalance);
                const allEvents = getActiveEvents();
                
                // Show progress towards next milestone if available
                if (nextEvent) {
                  const progress = (userBalance / nextEvent.requiredCoins) * 100;
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{nextEvent.title}</span>
                        <span className="text-sm">{userBalance} / {nextEvent.requiredCoins} Coins</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs mt-2 opacity-90">Belohnung: {nextEvent.reward}</p>
                    </div>
                  );
                } else if (unlockedEvents.length === allEvents.length && allEvents.length > 0) {
                  return (
                    <div className="text-center py-2">
                      <p className="text-lg font-bold">🏆 Alle Events freigeschaltet!</p>
                      <p className="text-sm opacity-90">Glückwunsch, du hast alle Meilensteine erreicht!</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-2">
                      <p className="text-sm opacity-90">Keine aktiven Events verfügbar</p>
                    </div>
                  );
                }
              })()}
              
              {/* Show unlocked events */}
              {getUnlockedEvents(userBalance).length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs font-semibold mb-2">✅ Freigeschaltet:</p>
                  <div className="flex flex-wrap gap-2">
                    {getUnlockedEvents(userBalance).map((event) => (
                      <span key={event.id} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {event.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Benefits Shop</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowBenefitForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  + Neues Benefit
                </button>
              )}
            </div>

            {/* Benefit Form */}
            {showBenefitForm && isAdmin && (
              <form onSubmit={handleBenefitSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBenefit ? 'Benefit bearbeiten' : 'Neues Benefit erstellen'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetBenefitForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={benefitTitle}
                    onChange={(e) => setBenefitTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Massage Gutschein"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Beschreibung
                  </label>
                  <textarea
                    value={benefitDescription}
                    onChange={(e) => setBenefitDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Beschreibung des Benefits..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Coin-Preis
                    </label>
                    <input
                      type="number"
                      value={benefitCost}
                      onChange={(e) => setBenefitCost(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="z.B. 150"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Kategorie
                    </label>
                    <select
                      value={benefitCategory}
                      onChange={(e) => setBenefitCategory(e.target.value as 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="WELLNESS">Wellness</option>
                      <option value="FOOD">Essen & Trinken</option>
                      <option value="TECH">Technologie</option>
                      <option value="TIME_OFF">Freizeit</option>
                      <option value="OTHER">Sonstiges</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={benefitUnlimited}
                      onChange={(e) => setBenefitUnlimited(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Unbegrenzter Lagerbestand</span>
                  </label>
                  
                  {!benefitUnlimited && (
                    <input
                      type="number"
                      value={benefitStockLimit}
                      onChange={(e) => setBenefitStockLimit(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lagerbestand (z.B. 10)"
                      min="1"
                      required={!benefitUnlimited}
                    />
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetBenefitForm}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={shopLoading}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                      shopLoading 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {shopLoading ? 'Speichert...' : editingBenefit ? 'Aktualisieren' : 'Erstellen'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getActiveBenefits().map((benefit) => (
                <div key={benefit.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(benefit.category)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="text-xs text-gray-500">{getCategoryName(benefit.category)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{benefit.coinCost}</p>
                      <p className="text-xs text-gray-500">Coins</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>
                  
                  {benefit.stockLimit && (
                    <p className="text-xs text-gray-500 mb-2">
                      Noch {benefit.currentStock} von {benefit.stockLimit} verfügbar
                    </p>
                  )}
                  
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleEditBenefit(benefit)}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        ✏️ Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDeleteBenefit(benefit.id)}
                        className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        🗑️ Löschen
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => handlePurchaseBenefit(benefit.id, benefit.coinCost)}
                    disabled={userBalance < benefit.coinCost || Boolean(benefit.stockLimit && (!benefit.currentStock || benefit.currentStock === 0))}
                    className={cn(
                      "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                      userBalance >= benefit.coinCost && (!benefit.stockLimit || benefit.currentStock! > 0)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {benefit.stockLimit && (!benefit.currentStock || benefit.currentStock === 0)
                      ? 'Ausverkauft'
                      : userBalance < benefit.coinCost 
                        ? 'Nicht genug Coins' 
                        : 'Einlösen'
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earn Tab */}
        {activeTab === 'earn' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Wie bekomme ich Coins?</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowRuleForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  + Neue Regel
                </button>
              )}
            </div>

            {/* Rule Form */}
            {showRuleForm && isAdmin && (
              <form onSubmit={handleRuleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingRule ? 'Regel bearbeiten' : 'Neue Regel erstellen'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetRuleForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={ruleTitle}
                    onChange={(e) => setRuleTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Schulung abgeschlossen"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Beschreibung
                  </label>
                  <textarea
                    value={ruleDescription}
                    onChange={(e) => setRuleDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Beschreibung der Regel..."
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Coin-Anzahl
                  </label>
                  <input
                    type="number"
                    value={ruleAmount}
                    onChange={(e) => setRuleAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. 20"
                    min="1"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetRuleForm}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={coinsLoading}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                      coinsLoading 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {coinsLoading ? 'Speichert...' : editingRule ? 'Aktualisieren' : 'Erstellen'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="space-y-3">
              {getCoinRules().map((rule) => (
                <div key={rule.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{rule.title}</h3>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{rule.coinAmount}</p>
                        <p className="text-xs text-gray-500">Coins</p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'Coin-Historie' : 'Meine Coin-Historie'}
              </h2>
              
              {/* Admin User Selection */}
              {isAdmin && (
                <select
                  value={selectedHistoryUserId}
                  onChange={(e) => setSelectedHistoryUserId(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle Mitarbeiter</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="space-y-3">
              {(() => {
                let transactions;
                if (isAdmin) {
                  if (selectedHistoryUserId) {
                    transactions = getUserTransactions(selectedHistoryUserId);
                  } else {
                    transactions = getAllTransactions();
                  }
                } else {
                  transactions = getUserTransactions(user.id);
                }
                
                return transactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{transaction.reason}</p>
                          {transaction.type === 'BENEFIT_PURCHASE' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Kauf
                            </span>
                          )}
                          {transaction.type === 'ADMIN_GRANT' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Vergabe
                            </span>
                          )}
                          {transaction.type === 'RULE_EARNED' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              Verdient
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                          {transaction.adminId && ` • von ${getUserName(transaction.adminId)}`}
                          {isAdmin && !selectedHistoryUserId && ` • ${getUserName(transaction.userId)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500">Coins</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            {/* No transactions message */}
            {(() => {
              let transactions;
              if (isAdmin) {
                if (selectedHistoryUserId) {
                  transactions = getUserTransactions(selectedHistoryUserId);
                } else {
                  transactions = getAllTransactions();
                }
              } else {
                transactions = getUserTransactions(user.id);
              }
              
              if (transactions.length === 0) {
                return (
                  <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
                    <span className="text-4xl mb-4">📊</span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Keine Transaktionen
                    </h3>
                    <p className="text-gray-600 text-center">
                      {isAdmin && selectedHistoryUserId 
                        ? `${getUserName(selectedHistoryUserId)} hat noch keine Coin-Transaktionen.`
                        : isAdmin 
                          ? 'Es gibt noch keine Coin-Transaktionen im System.'
                          : 'Sie haben noch keine Coin-Transaktionen.'
                      }
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* Manage Tab (Admin only) */}
        {activeTab === 'manage' && isAdmin && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Coins verteilen</h2>
              
              <form onSubmit={handleGrantCoins} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Mitarbeiter auswählen
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Mitarbeiter auswählen...</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Grund auswählen
                  </label>
                  <div className="space-y-2">
                    {/* Rule selection */}
                    {getCoinRules().map((rule) => (
                      <label key={rule.id} className="flex items-start">
                        <input
                          type="radio"
                          name="coinReason"
                          value={rule.id}
                          checked={selectedRuleId === rule.id && !isCustomReason}
                          onChange={(e) => {
                            setSelectedRuleId(e.target.value);
                            setIsCustomReason(false);
                          }}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{rule.title}</p>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                          <p className="text-sm font-semibold text-green-600">+{rule.coinAmount} Coins</p>
                        </div>
                      </label>
                    ))}
                    
                    {/* Custom reason option */}
                    <label className="flex items-start">
                      <input
                        type="radio"
                        name="coinReason"
                        checked={isCustomReason}
                        onChange={() => {
                          setIsCustomReason(true);
                          setSelectedRuleId('');
                        }}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Eigene Begründung</p>
                        <p className="text-sm text-gray-600">Geben Sie eine individuelle Begründung und Coin-Anzahl ein</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Show custom reason fields only when selected */}
                {isCustomReason && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Anzahl Coins
                      </label>
                      <input
                        type="number"
                        value={coinAmount}
                        onChange={(e) => setCoinAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="z.B. 25"
                        min="1"
                        required={isCustomReason}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Begründung
                      </label>
                      <textarea
                        value={coinReason}
                        onChange={(e) => setCoinReason(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Grund für die Coin-Vergabe..."
                        required={isCustomReason}
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={coinsLoading}
                  className={cn(
                    "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                    coinsLoading 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {coinsLoading ? 'Verteilt...' : 'Coins verteilen'}
                </button>
              </form>
            </div>

            {/* Coin Events Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Coin Events verwalten</h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  + Neues Event
                </button>
              </div>

              {/* Event Form */}
              {showEventForm && (
                <form onSubmit={handleEventSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-purple-200 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingEvent ? 'Event bearbeiten' : 'Neues Event erstellen'}
                    </h3>
                    <button
                      type="button"
                      onClick={resetEventForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Titel
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="z.B. Bronze Status"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Beschreibung
                    </label>
                    <textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Beschreibung des Events..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Benötigte Coins
                      </label>
                      <input
                        type="number"
                        value={eventRequiredCoins}
                        onChange={(e) => setEventRequiredCoins(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="z.B. 100"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Belohnung
                      </label>
                      <input
                        type="text"
                        value={eventReward}
                        onChange={(e) => setEventReward(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="z.B. Exklusiver Badge + 5% Rabatt"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={resetEventForm}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      disabled={eventsLoading}
                      className={cn(
                        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                        eventsLoading 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      )}
                    >
                      {eventsLoading ? 'Speichert...' : editingEvent ? 'Aktualisieren' : 'Erstellen'}
                    </button>
                  </div>
                </form>
              )}

              {/* Events List */}
              <div className="space-y-3">
                {getActiveEvents().map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-medium text-purple-600">
                            🎯 {event.requiredCoins} Coins benötigt
                          </span>
                          <span className="text-sm text-gray-500">
                            🎁 {event.reward}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};