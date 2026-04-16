import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
// Static imports for critical first-render routes
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AddTransaction } from './pages/AddTransaction';
import { EditTransaction } from './pages/EditTransaction';

// Lazy imports for secondary routes — loaded on demand
const History = lazy(() => import('./pages/History').then(m => ({ default: m.History })));
const Budgets = lazy(() => import('./pages/Budgets').then(m => ({ default: m.Budgets })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const AutoTransactions = lazy(() => import('./pages/AutoTransactions').then(m => ({ default: m.AutoTransactions })));
const DesignSystem = lazy(() => import('./pages/DesignSystem').then(m => ({ default: m.DesignSystem })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background animate-pulse" />
);

const PageTransitionLayout = () => {
  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PageTransitionLayout,
    children: [
      {
        index: true,
        Component: SplashScreen,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'home',
        Component: Home,
      },
      {
        path: 'add-transaction',
        Component: AddTransaction,
      },
      {
        path: 'edit-transaction/:id',
        Component: EditTransaction,
      },
      {
        path: 'history',
        Component: History,
      },
      {
        path: 'budgets',
        Component: Budgets,
      },
      {
        path: 'reports',
        Component: Reports,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'auto-transactions',
        Component: AutoTransactions,
      },
      {
        path: 'design-system',
        Component: DesignSystem,
      },
    ]
  }
]);