import { Category } from '@/types/task';

export const categories: Category[] = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#6366F1',
    icon: 'user',
  },
  {
    id: 'work',
    name: 'Work',
    color: '#10B981',
    icon: 'briefcase',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#F59E0B',
    icon: 'shopping-cart',
  },
  {
    id: 'health',
    name: 'Health',
    color: '#EF4444',
    icon: 'heart',
  },
  {
    id: 'education',
    name: 'Education',
    color: '#3B82F6',
    icon: 'book-open',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#8B5CF6',
    icon: 'dollar-sign',
  },
];

export default categories;