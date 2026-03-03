import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceData } from '@/hooks/useFinanceData';
import { ACCOUNT_TYPE_COLORS, CATEGORY_COLORS, type Category } from '@/types/finance';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

const currentMonth = format(new Date(), 'yyyy-MM');

export default function Dashboard() {
  const { accounts, transactions, getAccountBalance, totalBalance, getMonthlyStats } = useFinanceData();
  const stats = getMonthlyStats(currentMonth);
  const recentTxs = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const summaryCards = [
    { label: 'Total Balance', value: totalBalance, icon: Wallet, color: 'text-primary' },
    { label: 'Monthly Income', value: stats.income, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Monthly Expenses', value: stats.expenses, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Net Savings', value: stats.net, icon: PiggyBank, color: stats.net >= 0 ? 'text-emerald-500' : 'text-destructive' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.color}`} />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <p className={`text-lg sm:text-2xl font-bold ${c.color}`}>
                ₹{Math.abs(c.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                {c.label === 'Net Savings' && c.value < 0 && ' (-)'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
            {accounts.length === 0 && <p className="text-sm text-muted-foreground">No accounts yet. Add one in the Accounts page.</p>}
            {accounts.map((a) => {
              const bal = getAccountBalance(a.id);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `hsl(${ACCOUNT_TYPE_COLORS[a.type]})` }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{a.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{a.bank} · {a.type}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm sm:text-base flex-shrink-0 ml-2 ${bal < 0 ? 'text-destructive' : ''}`}>
                    ₹{bal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
            {recentTxs.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet.</p>}
            {recentTxs.map((t) => {
              const acct = accounts.find((a) => a.id === t.accountId);
              return (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `hsl(${CATEGORY_COLORS[t.category as Category]})` }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{t.description}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.category} · {acct?.name ?? 'Unknown'} · {t.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm sm:text-base flex-shrink-0 ml-2 ${t.type === 'expense' ? 'text-destructive' : 'text-emerald-500'}`}>
                    {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
