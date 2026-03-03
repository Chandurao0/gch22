import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Landmark, ArrowLeftRight, PiggyBank, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Landmark },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          onClick={onClick}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
          }
        >
          <l.icon className="h-4 w-4" />
          <span>{l.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="text-base sm:text-lg font-bold tracking-tight text-primary">💰 FinTrack</span>
            {/* Desktop nav — hidden below md */}
            <nav className="hidden md:flex gap-1">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:inline-flex gap-1 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>

            {/* Mobile hamburger — visible below md */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="mb-6">
                  <span className="text-lg font-bold tracking-tight text-primary">💰 FinTrack</span>
                </div>
                <nav className="flex flex-col gap-1">
                  <NavLinks onClick={() => setOpen(false)} />
                </nav>
                <Button variant="ghost" size="sm" onClick={() => { setOpen(false); handleSignOut(); }} className="mt-4 w-full justify-start gap-2 text-muted-foreground">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="container px-4 py-4 sm:px-6 sm:py-6 lg:px-8">{children}</main>
    </div>
  );
}
