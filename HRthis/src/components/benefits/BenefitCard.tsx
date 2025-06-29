import React from 'react';
import { type ShopBenefit } from '../../state/shop';
import { cn } from '../../utils/cn';

interface BenefitCardProps {
  benefit: ShopBenefit;
  userBalance: number;
  isAdmin: boolean;
  onPurchase: (benefitId: string, coinCost: number) => void;
  onEdit: (benefit: ShopBenefit) => void;
  onDelete: (benefitId: string) => void;
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'WELLNESS': return '💆';
    case 'FOOD': return '🍽️';
    case 'TECH': return '💻';
    case 'TIME_OFF': return '🏖️';
    default: return '🎁';
  }
};

const getCategoryName = (category: string): string => {
  switch (category) {
    case 'WELLNESS': return 'Wellness';
    case 'FOOD': return 'Essen & Trinken';
    case 'TECH': return 'Technologie';
    case 'TIME_OFF': return 'Freizeit';
    default: return 'Sonstiges';
  }
};

const BenefitHeader: React.FC<{ benefit: ShopBenefit }> = ({ benefit }) => (
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
);

const AdminControls: React.FC<{
  benefit: ShopBenefit;
  onEdit: (benefit: ShopBenefit) => void;
  onDelete: (id: string) => void;
}> = ({ benefit, onEdit, onDelete }) => (
  <div className="flex gap-2 mb-2">
    <button
      onClick={() => onEdit(benefit)}
      className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
    >
      ✏️ Bearbeiten
    </button>
    <button
      onClick={() => onDelete(benefit.id)}
      className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
    >
      🗑️ Löschen
    </button>
  </div>
);

const PurchaseButton: React.FC<{
  benefit: ShopBenefit;
  canPurchase: boolean;
  isOutOfStock: boolean;
  userBalance: number;
  onPurchase: (id: string, cost: number) => void;
}> = ({ benefit, canPurchase, isOutOfStock, userBalance, onPurchase }) => {
  const getButtonText = () => {
    if (isOutOfStock) return 'Ausverkauft';
    if (userBalance < benefit.coinCost) return 'Nicht genug Coins';
    return 'Kaufen';
  };

  return (
    <button
      onClick={() => onPurchase(benefit.id, benefit.coinCost)}
      disabled={!canPurchase}
      className={cn(
        "w-full py-2 px-4 rounded-lg font-medium transition-colors",
        canPurchase
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      )}
    >
      {getButtonText()}
    </button>
  );
};

export const BenefitCard: React.FC<BenefitCardProps> = ({
  benefit,
  userBalance,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete
}) => {
  const canPurchase = userBalance >= benefit.coinCost && 
    (!benefit.stockLimit || benefit.currentStock! > 0);

  const isOutOfStock = benefit.stockLimit && 
    (!benefit.currentStock || benefit.currentStock === 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <BenefitHeader benefit={benefit} />
      
      <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>
      
      {benefit.stockLimit && (
        <p className="text-xs text-gray-500 mb-2">
          Noch {benefit.currentStock} von {benefit.stockLimit} verfügbar
        </p>
      )}
      
      {isAdmin && (
        <AdminControls 
          benefit={benefit} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      )}
      
      <PurchaseButton
        benefit={benefit}
        canPurchase={canPurchase}
        isOutOfStock={isOutOfStock}
        userBalance={userBalance}
        onPurchase={onPurchase}
      />
    </div>
  );
};