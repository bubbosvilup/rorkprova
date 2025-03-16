import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskFilter, Category, Priority, SubTask } from '@/types/task';
import { categories as mockCategories } from '@/mocks/categories';
import { generateId } from '@/utils/helpers';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  filter: TaskFilter;
  selectedTaskId: string | null;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  
  // Subtask actions
  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Omit<SubTask, 'id'>>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  
  // Filter actions
  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;
  
  // Selection actions
  selectTask: (id: string | null) => void;
  
  // Filtered task getters
  getFilteredTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: mockCategories,
      filter: {},
      selectedTaskId: null,
      
      // Task actions
      addTask: (task) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          completed: false,
          ...task,
        };
        
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      },
      
      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date().toISOString(),
                  // If task is marked as completed, also complete all subtasks
                  subtasks: task.subtasks && !task.completed
                    ? task.subtasks.map(subtask => ({ ...subtask, completed: true }))
                    : task.subtasks
                }
              : task
          ),
        }));
      },
      
      clearCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
          selectedTaskId: state.selectedTaskId 
            ? (state.tasks.find(t => t.id === state.selectedTaskId)?.completed 
                ? null 
                : state.selectedTaskId)
            : null,
        }));
      },
      
      // Subtask actions
      addSubtask: (taskId, title) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [
                    ...(task.subtasks || []),
                    { id: generateId(), title, completed: false },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      updateSubtask: (taskId, subtaskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks?.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, ...updates }
                      : subtask
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks?.filter(
                    (subtask) => subtask.id !== subtaskId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));
      },
      
      toggleSubtaskCompletion: (taskId, subtaskId) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            
            const updatedSubtasks = task.subtasks?.map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            );
            
            // Check if all subtasks are completed
            const allSubtasksCompleted = updatedSubtasks?.every(
              (subtask) => subtask.completed
            );
            
            return {
              ...task,
              subtasks: updatedSubtasks,
              // Auto-complete the task if all subtasks are completed
              completed: allSubtasksCompleted || task.completed,
              updatedAt: new Date().toISOString(),
            };
          });
          
          return { tasks: updatedTasks };
        });
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory: Category = {
          id: generateId(),
          ...category,
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates }
              : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          // Remove category from tasks
          tasks: state.tasks.map((task) =>
            task.categoryId === id
              ? { ...task, categoryId: undefined }
              : task
          ),
          // Clear category filter if it's the deleted category
          filter:
            state.filter.categoryId === id
              ? { ...state.filter, categoryId: undefined }
              : state.filter,
        }));
      },
      
      // Filter actions
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }));
      },
      
      clearFilter: () => {
        set({ filter: {} });
      },
      
      // Selection actions
      selectTask: (id) => {
        set({ selectedTaskId: id });
      },
      
      // Getters
      getFilteredTasks: () => {
        const { tasks, filter } = get();
        
        return tasks.filter((task) => {
          // Filter by search query
          if (
            filter.searchQuery &&
            !task.title
              .toLowerCase()
              .includes(filter.searchQuery.toLowerCase()) &&
            !task.description
              ?.toLowerCase()
              .includes(filter.searchQuery.toLowerCase())
          ) {
            return false;
          }
          
          // Filter by category
          if (filter.categoryId && task.categoryId !== filter.categoryId) {
            return false;
          }
          
          // Filter by priority
          if (filter.priority && task.priority !== filter.priority) {
            return false;
          }
          
          // Filter by due date range
          if (filter.dueDateRange) {
            if (!task.dueDate) return false;
            
            const taskDueDate = new Date(task.dueDate);
            
            if (
              filter.dueDateRange.start &&
              taskDueDate < new Date(filter.dueDateRange.start)
            ) {
              return false;
            }
            
            if (
              filter.dueDateRange.end &&
              taskDueDate > new Date(filter.dueDateRange.end)
            ) {
              return false;
            }
          }
          
          return true;
        });
      },
      
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
      
      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);