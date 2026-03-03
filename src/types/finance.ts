export type AccountType = 'checking' | 'savings' | 'credit';

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Bills & Utilities',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Transfer',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: Category;
  amount: number;
  month: string; // YYYY-MM
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '24 95% 53%',
  'Transport': '199 89% 48%',
  'Bills & Utilities': '262 83% 58%',
  'Shopping': '340 82% 52%',
  'Entertainment': '45 93% 47%',
  'Health': '142 71% 45%',
  'Education': '199 89% 48%',
  'Salary': '142 71% 45%',
  'Freelance': '168 76% 42%',
  'Investment': '217 91% 60%',
  'Transfer': '215 16% 47%',
  'Other': '215 16% 47%',
};

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  checking: '217 91% 60%',
  savings: '142 71% 45%',
  credit: '0 84% 60%',
};
