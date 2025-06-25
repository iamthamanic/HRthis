import { useState } from 'react';
import { useShopStore, type ShopBenefit } from '../state/shop';

export const useBenefitManagement = () => {
  const { 
    purchaseBenefit, 
    addBenefit, 
    updateBenefit, 
    deleteBenefit,
    isLoading: shopLoading 
  } = useShopStore();

  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<ShopBenefit | null>(null);
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [benefitCost, setBenefitCost] = useState('');
  const [benefitCategory, setBenefitCategory] = useState<'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER'>('WELLNESS');
  const [benefitStockLimit, setBenefitStockLimit] = useState('');
  const [benefitUnlimited, setBenefitUnlimited] = useState(true);

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

  const resetBenefitForm = () => {
    setShowBenefitForm(false);
    setEditingBenefit(null);
    setBenefitTitle('');
    setBenefitDescription('');
    setBenefitCost('');
    setBenefitCategory('WELLNESS');
    setBenefitUnlimited(true);
    setBenefitStockLimit('');
  };

  const handleBenefitSubmit = async (isAdmin: boolean, setError: (error: string) => void) => {
    if (!isAdmin) return false;

    setError('');

    if (!benefitTitle || !benefitDescription || !benefitCost || !benefitCategory) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return false;
    }

    const cost = parseInt(benefitCost);
    if (isNaN(cost) || cost <= 0) {
      setError('Bitte geben Sie einen gültigen Coin-Preis ein');
      return false;
    }

    const stockLimit = benefitUnlimited ? undefined : parseInt(benefitStockLimit);
    if (!benefitUnlimited && (isNaN(stockLimit!) || stockLimit! <= 0)) {
      setError('Bitte geben Sie einen gültigen Lagerbestand ein');
      return false;
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
      
      resetBenefitForm();
      return true;
    } catch (error) {
      setError('Fehler beim Speichern des Benefits');
      return false;
    }
  };

  const handleDeleteBenefit = async (benefitId: string, isAdmin: boolean, setError: (error: string) => void) => {
    if (!isAdmin) return;
    
    if (window.confirm('Sind Sie sicher, dass Sie dieses Benefit löschen möchten?')) {
      try {
        await deleteBenefit(benefitId);
      } catch (error) {
        setError('Fehler beim Löschen des Benefits');
      }
    }
  };

  const handlePurchaseBenefit = async (
    userId: string, 
    benefitId: string, 
    coinCost: number, 
    userBalance: number,
    setError: (error: string) => void,
    updateUserBalance: () => void
  ) => {
    if (userBalance < coinCost) {
      setError('Nicht genügend Coins für diesen Kauf');
      return;
    }

    try {
      await purchaseBenefit(userId, benefitId);
      updateUserBalance();
    } catch (error) {
      setError('Fehler beim Kauf des Benefits');
    }
  };

  return {
    // State
    showBenefitForm,
    editingBenefit,
    benefitTitle,
    benefitDescription,
    benefitCost,
    benefitCategory,
    benefitStockLimit,
    benefitUnlimited,
    shopLoading,
    
    // Setters
    setShowBenefitForm,
    setBenefitTitle,
    setBenefitDescription,
    setBenefitCost,
    setBenefitCategory,
    setBenefitStockLimit,
    setBenefitUnlimited,
    
    // Handlers
    handleEditBenefit,
    resetBenefitForm,
    handleBenefitSubmit,
    handleDeleteBenefit,
    handlePurchaseBenefit
  };
};