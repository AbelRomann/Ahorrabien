import { 
  ShoppingCart, 
  Car, 
  Home, 
  Utensils, 
  Film, 
  Heart, 
  Briefcase, 
  GraduationCap,
  Shirt,
  Plane,
  Gift,
  Smartphone
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export const categories: Category[] = [
  { id: 'food', name: 'Comida', icon: Utensils, color: '#F59E0B', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: Car, color: '#06B6D4', type: 'expense' },
  { id: 'services', name: 'Servicios', icon: Home, color: '#8B5CF6', type: 'expense' },
  { id: 'entertainment', name: 'Entretenimiento', icon: Film, color: '#EC4899', type: 'expense' },
  { id: 'health', name: 'Salud', icon: Heart, color: '#EF4444', type: 'expense' },
  { id: 'education', name: 'Educación', icon: GraduationCap, color: '#3B82F6', type: 'expense' },
  { id: 'clothing', name: 'Ropa', icon: Shirt, color: '#A855F7', type: 'expense' },
  { id: 'travel', name: 'Viajes', icon: Plane, color: '#14B8A6', type: 'expense' },
  { id: 'gifts', name: 'Regalos', icon: Gift, color: '#F97316', type: 'expense' },
  { id: 'technology', name: 'Tecnología', icon: Smartphone, color: '#6366F1', type: 'expense' },
  { id: 'shopping', name: 'Compras', icon: ShoppingCart, color: '#10B981', type: 'expense' },
  { id: 'salary', name: 'Salario', icon: Briefcase, color: '#22C55E', type: 'income' },
];

export const getCategoryById = (id: string) => categories.find(c => c.id === id);
