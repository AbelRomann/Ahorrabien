import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="dark">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </div>
  );
}
