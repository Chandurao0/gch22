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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${c.color}`}>
                ₹{Math.abs(c.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                {c.label === 'Net Savings' && c.value < 0 && ' (-)'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.length === 0 && <p className="text-sm text-muted-foreground">No accounts yet. Add one in the Accounts page.</p>}
            {accounts.map((a) => {
              const bal = getAccountBalance(a.id);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: `hsl(${ACCOUNT_TYPE_COLORS[a.type]})` }}
                    />
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.bank} · {a.type}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${bal < 0 ? 'text-destructive' : ''}`}>
                    ₹{bal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTxs.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet.</p>}
            {recentTxs.map((t) => {
              const acct = accounts.find((a) => a.id === t.accountId);
              return (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: `hsl(${CATEGORY_COLORS[t.category as Category]})` }}
                    />
                    <div>
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {acct?.name ?? 'Unknown'} · {t.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${t.type === 'expense' ? 'text-destructive' : 'text-emerald-500'}`}>
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
