import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFinanceData } from '@/hooks/useFinanceData';
import { ACCOUNT_TYPE_COLORS, type Account, type AccountType } from '@/types/finance';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { name: '', bank: '', type: 'checking' as AccountType, currency: 'INR', initialBalance: 0 };

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, getAccountBalance } = useFinanceData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (a: Account) => { setEditing(a); setForm({ name: a.name, bank: a.bank, type: a.type, currency: a.currency, initialBalance: a.initialBalance }); setOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.bank.trim()) { toast.error('Name and bank are required'); return; }
    if (editing) {
      updateAccount({ ...editing, ...form });
      toast.success('Account updated');
    } else {
      addAccount({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      toast.success('Account added');
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAccount(id);
    toast.success('Account deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'New'} Account</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Checking" /></div>
              <div><Label>Bank</Label><Input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} placeholder="Chase" /></div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AccountType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Initial Balance</Label><Input type="number" value={form.initialBalance} onChange={(e) => setForm({ ...form, initialBalance: Number(e.target.value) })} /></div>
              <Button onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No accounts yet. Click "Add Account" to get started.</CardContent></Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => {
          const bal = getAccountBalance(a.id);
          return (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${ACCOUNT_TYPE_COLORS[a.type]})` }} />
                  <CardTitle className="text-base">{a.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{a.bank} · {a.type}</p>
                <p className={`mt-2 text-2xl font-bold ${bal < 0 ? 'text-destructive' : ''}`}>
                  ₹{bal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
