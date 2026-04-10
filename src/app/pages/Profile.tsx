import React, { useState } from 'react';
import { 
  User, 
  ChevronRight, 
  DollarSign, 
  Moon, 
  Download, 
  Bell, 
  LogOut,
  Mail,
  Settings,
  PieChart,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { Switch } from '../components/ui/switch';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/input';

export function Profile() {
  const navigate = useNavigate();
  const transactions = useFinanceStore((state) => state.transactions);
  const displayName = useAuthStore((state) => state.displayName);
  const email = useAuthStore((state) => state.email);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editEmail, setEditEmail] = useState(email);

  // Compute analytics
  const totalTransactions = transactions.length;
  
  // Compute unique categories
  const categorySet = new Set(transactions.map(t => t.category));
  const uniqueCategories = categorySet.size;

  // Compute active days (days since oldest transaction)
  let activeDays = 1;
  if (transactions.length > 0) {
    const dates = transactions.map(t => new Date(t.date).getTime());
    const oldest = Math.min(...dates);
    const newest = Math.max(...dates);
    const diffTime = Math.abs(newest - oldest);
    activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const handleSaveProfile = async () => {
    await updateProfile(editName, editEmail);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Editar perfil', action: () => setIsEditing(true) },
    { icon: PieChart, label: 'Presupuestos', action: () => navigate('/budgets') },
    { icon: DollarSign, label: 'Cambiar moneda', action: () => {}, detail: 'DOP' },
    { icon: Moon, label: 'Modo oscuro', action: () => {}, toggle: true, enabled: true },
    { icon: Bell, label: 'Notificaciones', action: () => {}, toggle: true, enabled: false },
    { icon: Download, label: 'Exportar datos', action: () => {} },
    { icon: Settings, label: 'Configuración', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#06B6D4] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex flex-col items-center relative">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 border-4 border-white/30 truncate">
            <User size={48} className="text-white" />
          </div>
          
          {isEditing ? (
             <div className="w-full max-w-xs space-y-3 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20 animate-in fade-in duration-200">
                <Input 
                   value={editName}
                   onChange={e => setEditName(e.target.value)}
                   className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                   placeholder="Tu Nombre"
                />
                <Input 
                   value={editEmail}
                   onChange={e => setEditEmail(e.target.value)}
                   className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                   placeholder="correo@ejemplo.com"
                />
                <div className="flex gap-2">
                   <button 
                     onClick={() => setIsEditing(false)}
                     className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg flex justify-center items-center gap-1 transition-colors"
                   >
                     <X size={16}/> Cancelar
                   </button>
                   <button 
                     onClick={handleSaveProfile}
                     className="flex-1 bg-white hover:bg-white/90 text-primary py-2 rounded-lg font-semibold flex justify-center items-center gap-1 transition-colors"
                   >
                     <Check size={16}/> Guardar
                   </button>
                </div>
             </div>
          ) : (
             <>
               <h2 className="text-white text-2xl font-bold mb-1">{displayName}</h2>
               <div className="flex items-center gap-2 text-white/80">
                 <Mail size={16} />
                 <p className="text-sm">{email || 'Agrega tu correo'}</p>
               </div>
             </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-6 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border grid grid-cols-3 gap-4 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{activeDays}</p>
            <p className="text-xs text-muted-foreground mt-1">Días activo</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-2xl font-bold text-secondary">{totalTransactions}</p>
            <p className="text-xs text-muted-foreground mt-1">Movimientos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#06B6D4]">{uniqueCategories}</p>
            <p className="text-xs text-muted-foreground mt-1">Categorías</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.detail && (
                    <span className="text-sm text-muted-foreground">{item.detail}</span>
                  )}
                  {item.toggle ? (
                    <Switch checked={item.enabled} />
                  ) : (
                    <ChevronRight size={20} className="text-muted-foreground" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 mt-6 bg-destructive/10 text-destructive rounded-2xl hover:bg-destructive/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          AhorraRD v1.0.1
        </p>
      </div>

      <BottomNav />
    </div>
  );
}