
export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface ForexRates {
  [currency: string]: number;
}

export interface Settings {
  inCategories: string[];
  outCategories: string[];
  limits: { [category: string]: number };
}

export type View = 'dashboard' | 'transactions' | 'savings' | 'forex' | 'settings';
