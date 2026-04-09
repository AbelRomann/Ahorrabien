import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CategoryChip } from '../components/CategoryChip';
import { categories } from '../data/categories';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Home as HomeIcon,
  History,
  PieChart,
  User
} from 'lucide-react';

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">AhorraRD Design System</h1>
          <p className="text-muted-foreground">
            Sistema de diseño moderno para aplicación de finanzas personales
          </p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Paleta de Colores</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Colores Principales</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="w-full h-24 bg-[#121212] rounded-xl border border-border mb-2" />
                  <p className="text-sm font-medium">Background</p>
                  <p className="text-xs text-muted-foreground">#121212</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-[#1E1E1E] rounded-xl border border-border mb-2" />
                  <p className="text-sm font-medium">Surface</p>
                  <p className="text-xs text-muted-foreground">#1E1E1E</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-[#10B981] rounded-xl mb-2" />
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">#10B981</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-[#8B5CF6] rounded-xl mb-2" />
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">#8B5CF6</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Colores Financieros</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="w-full h-24 bg-[#22C55E] rounded-xl mb-2" />
                  <p className="text-sm font-medium">Income</p>
                  <p className="text-xs text-muted-foreground">#22C55E</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-[#EF4444] rounded-xl mb-2" />
                  <p className="text-sm font-medium">Expense</p>
                  <p className="text-xs text-muted-foreground">#EF4444</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-[#06B6D4] rounded-xl mb-2" />
                  <p className="text-sm font-medium">Savings</p>
                  <p className="text-xs text-muted-foreground">#06B6D4</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Tipografía</h2>
          <div className="space-y-4 bg-card p-6 rounded-2xl border border-border">
            <div>
              <h1>Heading 1 - Sistema Financiero</h1>
              <p className="text-xs text-muted-foreground mt-1">32px / 2xl / Medium</p>
            </div>
            <div>
              <h2>Heading 2 - Balance Total</h2>
              <p className="text-xs text-muted-foreground mt-1">24px / xl / Medium</p>
            </div>
            <div>
              <h3>Heading 3 - Categorías</h3>
              <p className="text-xs text-muted-foreground mt-1">20px / lg / Medium</p>
            </div>
            <div>
              <p>Body Text - Descripción de transacción</p>
              <p className="text-xs text-muted-foreground mt-1">16px / base / Regular</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Small Text - Detalles adicionales</p>
              <p className="text-xs text-muted-foreground mt-1">14px / sm / Regular</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Botones</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                Primary Button
              </Button>
              <Button variant="outline" className="border-primary text-primary">
                Outline Button
              </Button>
              <Button variant="ghost">
                Ghost Button
              </Button>
              <Button className="bg-destructive hover:bg-destructive/90">
                Destructive
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#22C55E] hover:bg-[#22C55E]/90">
                Income Button
              </Button>
              <Button className="bg-[#EF4444] hover:bg-[#EF4444]/90">
                Expense Button
              </Button>
            </div>
          </div>
        </section>

        {/* Input Fields */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Campos de Entrada</h2>
          <div className="space-y-4 max-w-md">
            <Input 
              placeholder="Correo electrónico" 
              className="h-14 bg-card border-border rounded-2xl"
            />
            <Input 
              type="number" 
              placeholder="Monto" 
              className="h-14 bg-card border-border rounded-2xl"
            />
            <textarea 
              placeholder="Descripción"
              className="w-full p-4 bg-card border border-border rounded-2xl text-foreground resize-none h-24"
            />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Cards</h2>
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold mb-2">Card con borde</h3>
              <p className="text-sm text-muted-foreground">
                Card estándar con bordes redondeados y borde sutil
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl p-6">
              <h3 className="font-semibold mb-2 text-white">Card con gradiente</h3>
              <p className="text-sm text-white/80">
                Card destacado con gradiente de marca
              </p>
            </div>
          </div>
        </section>

        {/* Category Chips */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Chips de Categoría</h2>
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 8).map(category => (
              <CategoryChip
                key={category.id}
                name={category.name}
                icon={category.icon}
                color={category.color}
              />
            ))}
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Iconografía</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { icon: Wallet, name: 'Wallet' },
              { icon: TrendingUp, name: 'Trending Up' },
              { icon: TrendingDown, name: 'Trending Down' },
              { icon: HomeIcon, name: 'Home' },
              { icon: History, name: 'History' },
              { icon: PieChart, name: 'Chart' },
              { icon: User, name: 'User' },
            ].map(({ icon: Icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border">
                <Icon size={24} className="text-primary" />
                <p className="text-xs text-center">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Espaciado</h2>
          <div className="space-y-3 bg-card p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-primary rounded" />
              <p className="text-sm">12px - Pequeño (gap entre elementos relacionados)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary rounded" />
              <p className="text-sm">16px - Mediano (padding interno)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-primary rounded" />
              <p className="text-sm">24px - Grande (separación entre secciones)</p>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <p className="text-sm">rounded-lg</p>
              <p className="text-xs text-muted-foreground mt-1">8px</p>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border text-center">
              <p className="text-sm">rounded-2xl</p>
              <p className="text-xs text-muted-foreground mt-1">16px</p>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border text-center">
              <p className="text-sm">rounded-3xl</p>
              <p className="text-xs text-muted-foreground mt-1">24px</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
