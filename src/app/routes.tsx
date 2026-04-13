import { createBrowserRouter, Outlet, useLocation } from 'react-router';
// Removed framer-motion imports to keep the transitions snappy and static
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AddTransaction } from './pages/AddTransaction';
import { EditTransaction } from './pages/EditTransaction';
import { History } from './pages/History';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { AutoTransactions } from './pages/AutoTransactions';
import { DesignSystem } from './pages/DesignSystem';

const PageTransitionLayout = () => {
  return (
    <div className="w-full min-h-screen">
      <Outlet />
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