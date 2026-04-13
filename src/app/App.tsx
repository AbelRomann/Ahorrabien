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
    return (
      <div className="dark">
        <div className="max-w-md mx-auto min-h-screen bg-background">
          <div className="bg-gradient-to-br from-primary to-[#06B6D4] px-6 pt-12 pb-8 rounded-b-[2rem] w-full">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-white/30 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-white/30 rounded animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
            </div>
            {/* Balance Card Skeleton */}
            <div className="h-32 w-full bg-white/20 rounded-2xl animate-pulse backdrop-blur-sm"></div>
          </div>
          {/* Quick Stats Skeleton */}
          <div className="px-6 -mt-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 w-full bg-card rounded-2xl border border-border animate-pulse"></div>
              <div className="h-24 w-full bg-card rounded-2xl border border-border animate-pulse"></div>
            </div>
          </div>
          {/* Chart/Transactions Skeleton */}
          <div className="px-6 space-y-4">
             <div className="h-48 w-full bg-card rounded-2xl border border-border animate-pulse"></div>
             <div className="space-y-3">
               <div className="h-20 w-full bg-card rounded-2xl border border-border animate-pulse"></div>
               <div className="h-20 w-full bg-card rounded-2xl border border-border animate-pulse"></div>
             </div>
          </div>
        </div>
      </div>
    );
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
