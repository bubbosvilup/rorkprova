export type Priority = 'high' | 'medium' | 'low' | 'none';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: Priority;
  categoryId?: string;
  subtasks?: SubTask[];
  tags?: string[];
};

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type TaskFilter = {
  searchQuery?: string;
  categoryId?: string;
  priority?: Priority;
  completed?: boolean;
  dueDateRange?: {
    start?: string;
    end?: string;
  };
};

export type TaskStats = {
  total: number;
  completed: number;
  overdue: number;
  upcoming: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<string, number>;
  completionRate: number;
};