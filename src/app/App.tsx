import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useFinanceStore } from './store/useFinanceStore';
import { useEffect } from 'react';

export default function App() {
  const loadData = useFinanceStore((state) => state.loadData);
  const isLoading = useFinanceStore((state) => state.isLoading);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <div className="dark"><div className="min-h-screen bg-background flex justify-center items-center text-white">Cargando base de datos...</div></div>;
  }

  return (
    <div className="dark">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </div>
  );
}
