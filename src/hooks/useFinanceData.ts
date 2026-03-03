import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Account, Transaction, Budget } from '@/types/finance';

export function useFinanceData() {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('finance-accounts', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('finance-transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('finance-budgets', []);

  const addAccount = (account: Account) => setAccounts((prev) => [...prev, account]);
  const updateAccount = (account: Account) =>
    setAccounts((prev) => prev.map((a) => (a.id === account.id ? account : a)));
  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setTransactions((prev) => prev.filter((t) => t.accountId !== id));
  };

  const addTransaction = (tx: Transaction) => setTransactions((prev) => [...prev, tx]);
  const updateTransaction = (tx: Transaction) =>
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)));
  const deleteTransaction = (id: string) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const setBudget = (budget: Budget) =>
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === budget.category && b.month === budget.month);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = budget;
        return next;
      }
      return [...prev, budget];
    });
  const deleteBudget = (id: string) => setBudgets((prev) => prev.filter((b) => b.id !== id));

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return 0;
    const txTotal = transactions
      .filter((t) => t.accountId === accountId)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    return account.initialBalance + txTotal;
  };

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + getAccountBalance(a.id), 0),
    [accounts, transactions]
  );

  const getMonthlyStats = (month: string) => {
    const monthTxs = transactions.filter((t) => t.date.startsWith(month));
    const income = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses };
  };

  const getSpentByCategory = (month: string) => {
    const monthTxs = transactions.filter((t) => t.date.startsWith(month) && t.type === 'expense');
    const map: Record<string, number> = {};
    monthTxs.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  };

  return {
    accounts, addAccount, updateAccount, deleteAccount,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    budgets, setBudget, deleteBudget,
    getAccountBalance, totalBalance,
    getMonthlyStats, getSpentByCategory,
  };
}
