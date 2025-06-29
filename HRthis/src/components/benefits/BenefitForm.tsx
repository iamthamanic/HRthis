import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { type ShopBenefit } from '../../state/shop';

interface BenefitFormProps {
  editingBenefit: ShopBenefit | null;
  onSubmit: (benefitData: BenefitFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface BenefitFormData {
  title: string;
  description: string;
  coinCost: number;
  category: 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER';
  stockLimit?: number;
  unlimited: boolean;
}

const useBenefitForm = (editingBenefit: ShopBenefit | null) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinCost, setCoinCost] = useState('');
  const [category, setCategory] = useState<'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER'>('WELLNESS');
  const [stockLimit, setStockLimit] = useState('');
  const [unlimited, setUnlimited] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBenefit) {
      setTitle(editingBenefit.title);
      setDescription(editingBenefit.description);
      setCoinCost(editingBenefit.coinCost.toString());
      setCategory(editingBenefit.category);
      setUnlimited(!editingBenefit.stockLimit);
      setStockLimit(editingBenefit.stockLimit?.toString() || '');
    } else {
      setTitle('');
      setDescription('');
      setCoinCost('');
      setCategory('WELLNESS');
      setUnlimited(true);
      setStockLimit('');
    }
    setError('');
  }, [editingBenefit]);

  return {
    title, setTitle,
    description, setDescription,
    coinCost, setCoinCost,
    category, setCategory,
    stockLimit, setStockLimit,
    unlimited, setUnlimited,
    error, setError
  };
};

const FormHeader: React.FC<{ editingBenefit: ShopBenefit | null; onCancel: () => void }> = ({ editingBenefit, onCancel }) => (
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
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => 
  error ? (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  ) : null;

const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      {label}
    </label>
    {children}
  </div>
);

const StockLimitSection: React.FC<{
  unlimited: boolean;
  setUnlimited: (value: boolean) => void;
  stockLimit: string;
  setStockLimit: (value: string) => void;
}> = ({ unlimited, setUnlimited, stockLimit, setStockLimit }) => (
  <div>
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={unlimited}
        onChange={(e) => setUnlimited(e.target.checked)}
        className="mr-2"
      />
      <span className="text-sm font-medium text-gray-700">Unbegrenzter Lagerbestand</span>
    </label>
    
    {!unlimited && (
      <input
        type="number"
        value={stockLimit}
        onChange={(e) => setStockLimit(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Lagerbestand (z.B. 10)"
        min="1"
        required={!unlimited}
      />
    )}
  </div>
);

const FormActions: React.FC<{
  isLoading: boolean;
  editingBenefit: ShopBenefit | null;
  onCancel: () => void;
}> = ({ isLoading, editingBenefit, onCancel }) => (
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
      disabled={isLoading}
      className={cn(
        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
        isLoading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      )}
    >
      {isLoading ? 'Speichert...' : editingBenefit ? 'Aktualisieren' : 'Erstellen'}
    </button>
  </div>
);

export const BenefitForm: React.FC<BenefitFormProps> = ({
  editingBenefit,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const formState = useBenefitForm(editingBenefit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formState.setError('');

    if (!formState.title || !formState.description || !formState.coinCost || !formState.category) {
      formState.setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const cost = parseInt(formState.coinCost);
    if (isNaN(cost) || cost <= 0) {
      formState.setError('Bitte geben Sie einen gültigen Coin-Preis ein');
      return;
    }

    const stock = formState.unlimited ? undefined : parseInt(formState.stockLimit);
    if (!formState.unlimited && (isNaN(stock!) || stock! <= 0)) {
      formState.setError('Bitte geben Sie einen gültigen Lagerbestand ein');
      return;
    }

    onSubmit({
      title: formState.title,
      description: formState.description,
      coinCost: cost,
      category: formState.category,
      stockLimit: stock,
      unlimited: formState.unlimited
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
      <FormHeader editingBenefit={editingBenefit} onCancel={onCancel} />
      <ErrorDisplay error={formState.error} />
      
      <FormField label="Titel">
        <input
          type="text"
          value={formState.title}
          onChange={(e) => formState.setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z.B. Massage Gutschein"
          required
        />
      </FormField>

      <FormField label="Beschreibung">
        <textarea
          value={formState.description}
          onChange={(e) => formState.setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Beschreibung des Benefits..."
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Coin-Preis">
          <input
            type="number"
            value={formState.coinCost}
            onChange={(e) => formState.setCoinCost(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. 150"
            min="1"
            required
          />
        </FormField>

        <FormField label="Kategorie">
          <select
            value={formState.category}
            onChange={(e) => formState.setCategory(e.target.value as 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="WELLNESS">Wellness</option>
            <option value="FOOD">Essen & Trinken</option>
            <option value="TECH">Technologie</option>
            <option value="TIME_OFF">Freizeit</option>
            <option value="OTHER">Sonstiges</option>
          </select>
        </FormField>
      </div>

      <StockLimitSection 
        unlimited={formState.unlimited}
        setUnlimited={formState.setUnlimited}
        stockLimit={formState.stockLimit}
        setStockLimit={formState.setStockLimit}
      />

      <FormActions 
        isLoading={isLoading}
        editingBenefit={editingBenefit}
        onCancel={onCancel}
      />
    </form>
  );
};