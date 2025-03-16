import { Platform } from 'react-native';
import { Priority, Task, TaskStats } from '@/types/task';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return '#EF4444'; // Red
    case 'medium':
      return '#F59E0B'; // Amber
    case 'low':
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

export const calculateTaskCompletion = (task: Task): number => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.completed ? 100 : 0;
  }
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / task.subtasks.length) * 100);
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const now = new Date();
  
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const overdue = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < now
  ).length;
  const upcoming = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) >= now
  ).length;
  
  const byPriority: Record<Priority, number> = {
    high: 0,
    medium: 0,
    low: 0,
    none: 0
  };
  
  const byCategory: Record<string, number> = {};
  
  tasks.forEach(task => {
    byPriority[task.priority]++;
    
    if (task.categoryId) {
      byCategory[task.categoryId] = (byCategory[task.categoryId] || 0) + 1;
    }
  });
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    overdue,
    upcoming,
    byPriority,
    byCategory,
    completionRate
  };
};

export const isWeb = Platform.OS === 'web';