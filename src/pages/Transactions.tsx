import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinanceData } from '@/hooks/useFinanceData';
import { CATEGORIES, CATEGORY_COLORS, type Transaction, type TransactionType, type Category } from '@/types/finance';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  accountId: '', type: 'expense' as TransactionType, amount: 0,
  category: 'Other' as Category, description: '', date: format(new Date(), 'yyyy-MM-dd'),
};

export default function Transactions() {
  const { accounts, transactions, addTransaction, updateTransaction, deleteTransaction } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterAccount, setFilterAccount] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
    if (filterAccount !== 'all') list = list.filter((t) => t.accountId === filterAccount);
    if (filterCategory !== 'all') list = list.filter((t) => t.category === filterCategory);
    return list;
  }, [transactions, filterAccount, filterCategory]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, accountId: accounts[0]?.id ?? '' });
    setOpen(true);
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({ accountId: t.accountId, type: t.type, amount: t.amount, category: t.category, description: t.description, date: t.date });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.accountId || !form.description.trim() || form.amount <= 0) {
      toast.error('Fill in all fields with valid values');
      return;
    }
    if (editing) {
      updateTransaction({ ...editing, ...form });
      toast.success('Transaction updated');
    } else {
      addTransaction({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      toast.success('Transaction added');
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} disabled={accounts.length === 0}>
              <Plus className="mr-1 h-4 w-4" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'New'} Transaction</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Account</Label>
                <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>{accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Amount</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Grocery shopping" /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterAccount} onValueChange={setFilterAccount}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All accounts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          {accounts.length === 0 ? 'Add an account first to start tracking transactions.' : 'No transactions found.'}
        </CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const acct = accounts.find((a) => a.id === t.accountId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${CATEGORY_COLORS[t.category as Category]})` }} />
                        {t.category}
                      </span>
                    </TableCell>
                    <TableCell>{acct?.name ?? '—'}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === 'expense' ? 'text-destructive' : 'text-emerald-500'}`}>
                      {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { deleteTransaction(t.id); toast.success('Deleted'); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
