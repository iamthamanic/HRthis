import React from 'react';
import { type ShopBenefit } from '../../../state/shop';
import { cn } from '../../../utils/cn';

interface BenefitFormProps {
  editingBenefit: ShopBenefit | null;
  benefitTitle: string;
  benefitDescription: string;
  benefitCost: string;
  benefitCategory: 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER';
  benefitStockLimit: string;
  benefitUnlimited: boolean;
  shopLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  setBenefitTitle: (value: string) => void;
  setBenefitDescription: (value: string) => void;
  setBenefitCost: (value: string) => void;
  setBenefitCategory: (value: 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER') => void;
  setBenefitStockLimit: (value: string) => void;
  setBenefitUnlimited: (value: boolean) => void;
}

export const BenefitForm: React.FC<BenefitFormProps> = ({
  editingBenefit,
  benefitTitle,
  benefitDescription,
  benefitCost,
  benefitCategory,
  benefitStockLimit,
  benefitUnlimited,
  shopLoading,
  onSubmit,
  onCancel,
  setBenefitTitle,
  setBenefitDescription,
  setBenefitCost,
  setBenefitCategory,
  setBenefitStockLimit,
  setBenefitUnlimited
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingBenefit ? 'Benefit bearbeiten' : 'Neues Benefit erstellen'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
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
          onClick={onCancel}
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
  );
};