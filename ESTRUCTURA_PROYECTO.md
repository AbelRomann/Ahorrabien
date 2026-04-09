# Estructura del Proyecto AhorraRD

## 📁 Organización de Archivos

```
/src
├── /app
│   ├── App.tsx                          # Componente principal con RouterProvider
│   ├── routes.tsx                       # Configuración de rutas
│   │
│   ├── /components                      # Componentes reutilizables
│   │   ├── BalanceCard.tsx             # Card de balance con ingresos/gastos
│   │   ├── BottomNav.tsx               # Navegación inferior (4 tabs)
│   │   ├── CategoryChip.tsx            # Chip de categoría con icono
│   │   ├── EmptyState.tsx              # Estado vacío genérico
│   │   ├── QuickAction.tsx             # Botón de acción rápida
│   │   ├── StatCard.tsx                # Card de estadística
│   │   ├── TransactionCard.tsx         # Card de transacción individual
│   │   │
│   │   ├── /figma                      # Componentes de sistema
│   │   │   └── ImageWithFallback.tsx   # (Protegido - no modificar)
│   │   │
│   │   └── /ui                         # Componentes de UI base (Radix + Tailwind)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── progress.tsx
│   │       ├── switch.tsx
│   │       └── ... (más componentes)
│   │
│   ├── /data                            # Datos y configuración
│   │   ├── categories.ts               # Definición de categorías (12)
│   │   └── mockData.ts                 # Datos de demostración
│   │
│   └── /pages                           # Pantallas de la aplicación
│       ├── AddTransaction.tsx          # Formulario agregar movimiento
│       ├── Budgets.tsx                 # Gestión de presupuestos
│       ├── DesignSystem.tsx            # Documentación del sistema de diseño
│       ├── History.tsx                 # Historial con filtros
│       ├── Home.tsx                    # Dashboard principal
│       ├── Login.tsx                   # Login/Registro
│       ├── Onboarding.tsx              # Onboarding de 3 pasos
│       ├── Profile.tsx                 # Perfil y configuración
│       ├── Reports.tsx                 # Reportes y gráficos
│       └── SplashScreen.tsx            # Pantalla de inicio
│
└── /styles
    ├── fonts.css                        # Importación de fuentes
    ├── index.css                        # Estilos globales
    ├── tailwind.css                     # Configuración Tailwind
    └── theme.css                        # Tema de colores AhorraRD
```

## 🎨 Sistema de Diseño

### Colores (theme.css)

#### Variables CSS Principales
```css
--background: #121212        /* Fondo principal */
--surface: #1E1E1E          /* Superficie de cards */
--primary: #10B981          /* Verde esmeralda */
--secondary: #8B5CF6        /* Morado */
--income: #22C55E           /* Verde ingresos */
--expense: #EF4444          /* Rojo gastos */
--savings: #06B6D4          /* Cyan ahorros */
```

### Componentes por Categoría

#### Navegación
- **BottomNav**: Navegación fija inferior con 4 tabs
  - Props: Ninguna (usa React Router internamente)
  - Estados: Activo/Inactivo basado en ruta actual

#### Visualización de Datos
- **TransactionCard**: Muestra una transacción
  - Props: `transaction: Transaction`
  - Incluye: Icono, descripción, fecha, monto

- **StatCard**: Card de estadística
  - Props: `icon, label, value, iconColor?, iconBgColor?`

- **BalanceCard**: Balance con ingresos/gastos
  - Props: `balance, income, expenses`

#### Selección
- **CategoryChip**: Categoría seleccionable
  - Props: `name, icon, color, selected?, onClick?`

#### Estados
- **EmptyState**: Mensaje cuando no hay datos
  - Props: `icon, title, description, action?`

## 🗂️ Estructura de Datos

### Interfaces Principales

```typescript
// Transaction
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
}

// Budget
interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

// Category
interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  type: 'expense' | 'income' | 'both';
}
```

## 🛣️ Rutas y Navegación

### Flujo Principal
1. `/` → Splash Screen (auto-redirect a onboarding)
2. `/onboarding` → 3 pantallas introductorias
3. `/login` → Autenticación
4. `/home` → Dashboard principal

### Navegación Bottom Nav
- `/home` → Inicio (Dashboard)
- `/history` → Historial de transacciones
- `/reports` → Reportes y estadísticas
- `/profile` → Perfil y configuración

### Rutas Adicionales
- `/add-transaction` → Agregar movimiento
- `/budgets` → Gestión de presupuestos
- `/design-system` → Sistema de diseño

## 📊 Gráficos y Visualizaciones

### Recharts Components Usados

#### Home
- **PieChart**: Gastos por categoría (donut chart)
  - innerRadius: 50
  - outerRadius: 70
  - Colores: Según categoría

#### Reports
- **PieChart**: Distribución de gastos
  - Con labels de porcentaje
  - Tooltip interactivo

- **BarChart**: Comparación mensual
  - 2 barras: Ingresos vs Gastos
  - Colors: #22C55E (income) / #EF4444 (expense)

## 🎭 Animaciones

### Motion (Framer Motion)

#### SplashScreen
```typescript
initial={{ scale: 0.5, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.5 }}
```

#### Onboarding
```typescript
initial={{ opacity: 0, x: 50 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -50 }}
```

## 🎯 Patrones de Código

### Navegación Programática
```typescript
import { useNavigate } from 'react-router';
const navigate = useNavigate();
navigate('/ruta');
```

### Formateo de Moneda
```typescript
amount.toLocaleString() // 35000 → "35,000"
```

### Formateo de Fecha
```typescript
date.toLocaleDateString('es-ES', { 
  day: '2-digit', 
  month: 'short' 
})
```

### Obtener Categoría
```typescript
import { getCategoryById } from '../data/categories';
const category = getCategoryById(transaction.category);
```

## 🔧 Utilidades

### Cálculos Comunes

```typescript
// Total de ingresos
const totalIncome = mockTransactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);

// Total de gastos
const totalExpenses = mockTransactions
  .filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);

// Balance
const balance = totalIncome - totalExpenses;

// Porcentaje de presupuesto
const percentage = (spent / limit) * 100;
```

## 📱 Responsive Design

### Max Width Container
Todas las páginas están envueltas en:
```typescript
<div className="max-w-md mx-auto">
```

### Mobile-First
- Diseño optimizado para 375px - 428px (móviles)
- Funciona bien hasta 768px (tablets)

## 🎨 Clases Tailwind Comunes

### Cards
```css
bg-card rounded-2xl p-6 border border-border
```

### Gradientes
```css
bg-gradient-to-br from-primary to-[#06B6D4]
```

### Botones Redondeados
```css
rounded-2xl  /* 16px */
rounded-3xl  /* 24px */
rounded-full /* Circular */
```

### Espaciado
```css
gap-3   /* 12px */
gap-4   /* 16px */
gap-6   /* 24px */
p-6     /* padding 24px */
mb-6    /* margin-bottom 24px */
```

## 🚀 Mejores Prácticas Implementadas

1. **Componentes Pequeños y Reutilizables**
   - Cada componente tiene una responsabilidad única
   - Props bien definidas con TypeScript

2. **Separación de Concerns**
   - Data en `/data`
   - Componentes en `/components`
   - Páginas en `/pages`

3. **Consistencia Visual**
   - Mismo border-radius en toda la app
   - Paleta de colores coherente
   - Espaciado uniforme

4. **Accesibilidad**
   - Componentes Radix UI
   - Labels descriptivos
   - Keyboard navigation

5. **Performance**
   - Componentes optimizados
   - Mock data estático
   - Lazy loading de rutas (posible mejora futura)

## 📝 Notas para Desarrollo

### Agregar Nueva Categoría
1. Ir a `/src/app/data/categories.ts`
2. Agregar nuevo objeto al array `categories`
3. Importar icono de `lucide-react`

### Agregar Nueva Página
1. Crear archivo en `/src/app/pages/NombrePagina.tsx`
2. Agregar ruta en `/src/app/routes.tsx`
3. Opcional: Agregar link en BottomNav

### Modificar Colores del Tema
1. Editar `/src/styles/theme.css`
2. Actualizar variables CSS en `:root` y `.dark`

### Agregar Mock Data
1. Ir a `/src/app/data/mockData.ts`
2. Agregar transacciones al array `mockTransactions`
3. Agregar presupuestos al array `mockBudgets`

## 🔐 Archivos Protegidos

**NO MODIFICAR:**
- `/src/app/components/figma/ImageWithFallback.tsx`
- `/pnpm-lock.yaml`

## 📦 Dependencias Clave

```json
{
  "react-router": "7.13.0",
  "recharts": "2.15.2",
  "lucide-react": "0.487.0",
  "motion": "12.23.24",
  "@radix-ui/*": "Varios",
  "tailwindcss": "4.1.12"
}
```

---

**Última actualización**: 9 de abril, 2026  
**Mantenedor**: Equipo AhorraRD
