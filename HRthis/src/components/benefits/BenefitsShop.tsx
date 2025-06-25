import React from 'react';
import { useShopStore, type ShopBenefit } from '../../state/shop';
import { BenefitCard } from './BenefitCard';
import { CoinEventsProgress } from './CoinEventsProgress';

interface BenefitsShopProps {
  userBalance: number;
  isAdmin: boolean;
  onPurchase: (benefitId: string, coinCost: number) => Promise<void>;
  onShowBenefitForm: () => void;
  onEditBenefit: (benefit: ShopBenefit) => void;
  onDeleteBenefit: (benefitId: string) => Promise<void>;
}

export const BenefitsShop: React.FC<BenefitsShopProps> = ({
  userBalance,
  isAdmin,
  onPurchase,
  onShowBenefitForm,
  onEditBenefit,
  onDeleteBenefit
}) => {
  const { getActiveBenefits } = useShopStore();

  return (
    <div className="space-y-4">
      <CoinEventsProgress userBalance={userBalance} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Benefits Shop</h2>
        {isAdmin && (
          <button
            onClick={onShowBenefitForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Neues Benefit
          </button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getActiveBenefits().map((benefit) => (
          <BenefitCard
            key={benefit.id}
            benefit={benefit}
            userBalance={userBalance}
            isAdmin={isAdmin}
            onPurchase={onPurchase}
            onEdit={onEditBenefit}
            onDelete={onDeleteBenefit}
          />
        ))}
      </div>
    </div>
  );
};