# AhorraRD - Aplicación de Finanzas Personales

## 📱 Descripción

AhorraRD es una aplicación móvil moderna de finanzas personales diseñada para el registro y control de gastos e ingresos. Con un diseño limpio, minimalista y profesional inspirado en aplicaciones fintech modernas, AhorraRD ayuda a los usuarios a gestionar mejor su dinero.

## 🚀 Inicio Rápido

La aplicación inicia automáticamente en el Splash Screen (`/`) y te guía a través de:
1. **Splash Screen** - Pantalla de bienvenida animada
2. **Onboarding** - Introducción de 3 pantallas (puedes omitir)
3. **Login** - Autenticación (puedes continuar como invitado)
4. **Home** - Dashboard principal

**Para acceder directamente a pantallas específicas:**
- Dashboard: `/home`
- Agregar movimiento: `/add-transaction`
- Historial: `/history`
- Presupuestos: `/budgets`
- Reportes: `/reports`
- Perfil: `/profile`
- Design System: `/design-system` ⭐

## 🎨 Diseño

### Estilo Visual
- **Tema**: Oscuro moderno (Dark Mode)
- **Estilo**: Material Design 3 / Fintech moderno
- **Enfoque**: Mobile-first (Android)

### Paleta de Colores

#### Colores Principales
- **Background**: `#121212`
- **Surface/Cards**: `#1E1E1E`
- **Foreground**: `#FFFFFF`

#### Colores de Marca
- **Primary (Verde esmeralda)**: `#10B981`
- **Secondary (Morado)**: `#8B5CF6`
- **Cyan**: `#06B6D4`

#### Colores Financieros
- **Ingresos**: `#22C55E` (Verde)
- **Gastos**: `#EF4444` (Rojo/Coral)
- **Ahorros**: `#06B6D4` (Cyan)

#### Colores de Categorías
- Comida: `#F59E0B` (Naranja)
- Transporte: `#06B6D4` (Cyan)
- Servicios: `#8B5CF6` (Morado)
- Entretenimiento: `#EC4899` (Rosa)
- Salud: `#EF4444` (Rojo)
- Educación: `#3B82F6` (Azul)
- Ropa: `#A855F7` (Púrpura)
- Viajes: `#14B8A6` (Teal)
- Regalos: `#F97316` (Naranja oscuro)
- Tecnología: `#6366F1` (Índigo)

### Tipografía
- **Heading 1**: 32px / Medium
- **Heading 2**: 24px / Medium
- **Heading 3**: 20px / Medium
- **Body**: 16px / Regular
- **Small**: 14px / Regular

## 📱 Pantallas Incluidas

### 1. Splash Screen
- Logo moderno con icono de billetera
- Animación de entrada suave
- Transición automática al onboarding

### 2. Onboarding (3 pantallas)
- **Pantalla 1**: "Registra tus gastos fácilmente"
- **Pantalla 2**: "Controla tu presupuesto mensual"
- **Pantalla 3**: "Visualiza tus estadísticas y ahorra mejor"
- Indicadores de progreso
- Botones: Siguiente, Omitir, Empezar

### 3. Login / Registro
- Campos de correo y contraseña
- Opción "Continuar como invitado"
- Diseño limpio y moderno

### 4. Home / Dashboard
- Saludo personalizado
- Balance total destacado
- Cards con ingresos y gastos del mes
- Gráfico de gastos por categoría
- Lista de últimos movimientos
- Botón flotante para agregar movimiento
- Bottom navigation

### 5. Agregar Movimiento
- Toggle entre Ingreso/Gasto
- Campo de monto destacado
- Selector visual de categorías (chips)
- Selector de fecha
- Método de pago
- Campo de descripción opcional

### 6. Historial
- Barra de búsqueda
- Filtros por tipo (Todos, Ingresos, Gastos)
- Lista agrupada por fecha
- Estado vacío elegante

### 7. Presupuestos
- Resumen mensual total
- Cards por categoría con:
  - Icono de categoría
  - Presupuesto asignado vs gastado
  - Barra de progreso
  - Dinero restante
- Indicador de presupuesto excedido
- Botón para crear presupuesto

### 8. Reportes / Estadísticas
- Selector de período (Semana, Mes, Año)
- Indicadores clave:
  - Total gastado
  - Promedio semanal
  - Categoría con mayor gasto
- Gráfico circular de gastos por categoría
- Gráfico de barras comparativo mensual
- Insights financieros

### 9. Perfil / Ajustes
- Avatar del usuario
- Estadísticas de uso
- Opciones:
  - Editar perfil
  - Cambiar moneda
  - Modo oscuro (toggle)
  - Notificaciones (toggle)
  - Exportar datos
  - Configuración
  - Cerrar sesión

### 10. Design System
- Documentación completa de colores
- Ejemplos de tipografía
- Variantes de botones
- Campos de entrada
- Cards
- Chips de categoría
- Iconografía
- Espaciado y border radius

## 🛠️ Tecnologías Utilizadas

- **React** - Framework principal
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Tailwind CSS v4** - Estilos
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos
- **Motion (Framer Motion)** - Animaciones
- **Radix UI** - Componentes accesibles
- **Sonner** - Notificaciones toast

## 🎯 Componentes Reutilizables

### CategoryChip
Chip visual para selección de categorías con icono y color personalizado.

### TransactionCard
Card para mostrar transacciones individuales con toda la información relevante.

### BottomNav
Navegación inferior fija con 4 secciones principales.

## 📊 Datos Mock

La aplicación incluye datos de ejemplo para demostración:
- 8 transacciones de muestra
- 5 presupuestos predefinidos
- 12 categorías configuradas

## 🚀 Navegación

### Rutas Disponibles
- `/` - Splash Screen
- `/onboarding` - Introducción (3 pantallas)
- `/login` - Inicio de sesión
- `/register` - Registro
- `/home` - Dashboard principal
- `/add-transaction` - Agregar movimiento
- `/history` - Historial de transacciones
- `/budgets` - Gestión de presupuestos
- `/reports` - Reportes y estadísticas
- `/profile` - Perfil y configuración
- `/design-system` - Sistema de diseño

### Bottom Navigation
1. **Inicio** - Dashboard principal
2. **Historial** - Lista de transacciones
3. **Reportes** - Estadísticas y gráficos
4. **Perfil** - Configuración de usuario

## ✨ Características UX/UI

- **Diseño Mobile-First**: Optimizado para dispositivos móviles
- **Tema Oscuro**: Por defecto con colores cuidadosamente seleccionados
- **Animaciones Suaves**: Transiciones fluidas entre pantallas
- **Componentes Consistentes**: Sistema de diseño coherente
- **Estados Vacíos**: Mensajes elegantes cuando no hay datos
- **Feedback Visual**: Toast notifications para acciones
- **Accesibilidad**: Componentes basados en Radix UI
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🎨 Principios de Diseño

1. **Minimalismo**: Interfaz limpia sin elementos innecesarios
2. **Jerarquía Visual**: Clara diferenciación de importancia
3. **Consistencia**: Patrones de diseño repetibles
4. **Claridad**: Información fácil de entender
5. **Premium**: Sensación de calidad y profesionalismo

## 📝 Notas de Implementación

- Todos los datos son simulados (mock data)
- No requiere backend para funcionar
- Ideal para portfolio y demostración
- Código limpio y bien organizado
- Componentes modulares y reutilizables

## 🔄 Flujo de Usuario

1. **Splash Screen** → Animación de carga
2. **Onboarding** → Introducción a características (puede omitirse)
3. **Login** → Autenticación (puede continuar como invitado)
4. **Home** → Dashboard con resumen financiero
5. **Navegación** → Bottom nav para acceso rápido a secciones
6. **Acciones** → Botón flotante para agregar transacciones

## 🎯 Casos de Uso

- Registro diario de gastos e ingresos
- Control de presupuesto mensual por categoría
- Visualización de patrones de gasto
- Análisis financiero personal
- Gestión de finanzas domésticas

---

**Versión**: 1.0.0  
**Estado**: ✅ Completo y funcional  
**Tipo**: Frontend Demo / Portfolio Project