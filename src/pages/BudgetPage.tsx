import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useFinanceData } from '@/hooks/useFinanceData';
import { CATEGORIES, CATEGORY_COLORS, type Category } from '@/types/finance';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const currentMonth = format(new Date(), 'yyyy-MM');

export default function BudgetPage() {
  const { budgets, setBudget, deleteBudget, getSpentByCategory } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: CATEGORIES[0] as Category, amount: 0, month: currentMonth });

  const monthBudgets = budgets.filter((b) => b.month === form.month || b.month === currentMonth);
  const spent = getSpentByCategory(currentMonth);

  const handleSave = () => {
    if (form.amount <= 0) { toast.error('Enter a valid amount'); return; }
    setBudget({ id: crypto.randomUUID(), category: form.category, amount: form.amount, month: currentMonth });
    toast.success('Budget set');
    setOpen(false);
  };

  const usedCategories = new Set(monthBudgets.map((b) => b.category));
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.has(c));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Budget — {format(new Date(), 'MMMM yyyy')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableCategories.length === 0} onClick={() => setForm({ ...form, category: availableCategories[0] ?? CATEGORIES[0] })}>
              <Plus className="mr-1 h-4 w-4" /> Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Set Category Budget</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{availableCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Monthly Limit (₹)</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {monthBudgets.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No budgets set for this month. Click "Set Budget" to get started.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {monthBudgets.map((b) => {
            const s = spent[b.category] || 0;
            const pct = Math.min((s / b.amount) * 100, 100);
            const over = s > b.amount;
            return (
              <Card key={b.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${CATEGORY_COLORS[b.category as Category]})` }} />
                    <CardTitle className="text-base">{b.category}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteBudget(b.id); toast.success('Budget removed'); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={over ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      ₹{s.toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent
                    </span>
                    <span className="text-muted-foreground">₹{b.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} limit</span>
                  </div>
                  <Progress value={pct} className={over ? '[&>div]:bg-destructive' : ''} />
                  {over && <p className="text-xs font-medium text-destructive">Over budget by ₹{(s - b.amount).toFixed(2)}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
