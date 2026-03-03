import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Smart Tracking',
    description: 'Track all your accounts, transactions, and budgets in one place with real-time balance updates.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and secured. Only you can access your information.',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Get monthly breakdowns, category spending, and budget alerts to stay on top of your finances.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-4 py-20 sm:py-28 lg:py-36">
          <nav className="mb-16 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-primary">💰 FinTrack</span>
            <div className="flex gap-2 sm:gap-3">
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Take Control of Your{' '}
              <span className="text-primary">Finances</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              Track expenses, manage budgets, and monitor all your accounts in one simple, beautiful dashboard — all in ₹ Indian Rupees.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/signup">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/signin">I have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-card/50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Everything You Need
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            Powerful tools to help you manage your money smarter — no spreadsheets required.
          </p>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            Join thousands who have already taken control of their financial future with FinTrack.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinTrack. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
