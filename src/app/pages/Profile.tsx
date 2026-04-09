import React from 'react';
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
  PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { Switch } from '../components/ui/switch';

export function Profile() {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: User, label: 'Editar perfil', action: () => {} },
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
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
            <User size={48} className="text-white" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Usuario Demo</h2>
          <div className="flex items-center gap-2 text-white/80">
            <Mail size={16} />
            <p className="text-sm">usuario@ejemplo.com</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-6 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground mt-1">Días activo</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-2xl font-bold text-secondary">128</p>
            <p className="text-xs text-muted-foreground mt-1">Movimientos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#06B6D4]">5</p>
            <p className="text-xs text-muted-foreground mt-1">Categorías</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
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
        <button className="w-full flex items-center justify-center gap-2 p-4 mt-6 bg-destructive/10 text-destructive rounded-2xl hover:bg-destructive/20 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          AhorraRD v1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
}