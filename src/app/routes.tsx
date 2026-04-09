import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './pages/SplashScreen';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AddTransaction } from './pages/AddTransaction';
import { History } from './pages/History';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { DesignSystem } from './pages/DesignSystem';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen,
  },
  {
    path: '/onboarding',
    Component: Onboarding,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Login, // Using same component for demo
  },
  {
    path: '/home',
    Component: Home,
  },
  {
    path: '/add-transaction',
    Component: AddTransaction,
  },
  {
    path: '/history',
    Component: History,
  },
  {
    path: '/budgets',
    Component: Budgets,
  },
  {
    path: '/reports',
    Component: Reports,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/design-system',
    Component: DesignSystem,
  },
]);