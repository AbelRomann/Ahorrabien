import { createBrowserRouter, Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AddTransaction } from './pages/AddTransaction';
import { EditTransaction } from './pages/EditTransaction';
import { History } from './pages/History';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { DesignSystem } from './pages/DesignSystem';

const PageTransitionLayout = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-full min-h-screen"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
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
        path: 'design-system',
        Component: DesignSystem,
      },
    ]
  }
]);