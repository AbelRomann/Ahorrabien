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
          <div className="bg-[radial-gradient(circle_at_18%_10%,rgba(0,240,181,0.45),transparent_34%),linear-gradient(135deg,#0F172A_0%,#10B981_52%,#06B6D4_100%)] px-6 safe-top pb-8 rounded-b-[2rem] w-full">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-white/25 rounded overflow-hidden relative">
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                </div>
                <div className="h-6 w-32 bg-white/25 rounded overflow-hidden relative">
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl animate-pulse"></div>
            </div>
            {/* Balance Card Skeleton */}
            <div className="h-32 w-full bg-white/18 rounded-3xl animate-pulse backdrop-blur-sm"></div>
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
