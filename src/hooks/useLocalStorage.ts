import { useCallback } from 'react';
import { Todo } from '../types/todo';

const STORAGE_KEY = 'todo-app-todos';

export const useLocalStorage = () => {
  const saveTodos = useCallback((todos: Todo[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }, []);

  const loadTodos = useCallback((): Todo[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert createdAt strings back to Date objects
        return parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
    return [];
  }, []);

  return { saveTodos, loadTodos };
};

