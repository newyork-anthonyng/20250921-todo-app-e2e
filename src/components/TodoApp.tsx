'use client';

import { useEffect, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { todoMachine } from '../machines/todoMachine';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';

export function TodoApp() {
  const [state, send] = useMachine(todoMachine);
  const { saveTodos, loadTodos } = useLocalStorage();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = loadTodos();
    if (savedTodos.length > 0) {
      send({ type: 'LOAD_TODOS', todos: savedTodos });
    }
  }, []); // Empty dependency array - only run on mount

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (state.context.todos.length > 0) {
      saveTodos(state.context.todos);
    }
  }, [state.context.todos]); // Only depend on todos, not saveTodos

  const handleAddTodo = (text: string) => {
    send({ type: 'ADD_TODO', text });
  };

  const handleToggleTodo = (id: string) => {
    send({ type: 'TOGGLE_TODO', id });
  };

  const handleDeleteTodo = (id: string) => {
    send({ type: 'DELETE_TODO', id });
  };

  const handleStartEdit = (id: string) => {
    send({ type: 'START_EDITING', id });
  };

  const handleEditTodo = (id: string, text: string) => {
    send({ type: 'EDIT_TODO', id, text });
  };

  const handleCancelEdit = () => {
    send({ type: 'CANCEL_EDITING' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-gray-600">Manage your tasks with ease</p>
      </div>

      <AddTodo onAddTodo={handleAddTodo} />

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Your Todos ({state.context.todos.length})
        </h2>
        <TodoList
          todos={state.context.todos}
          editingId={state.context.editingId}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onStartEdit={handleStartEdit}
          onEdit={handleEditTodo}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {state.context.todos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
          <div className="text-sm text-gray-600">
            <p>
              Total: {state.context.todos.length} | 
              Completed: {state.context.todos.filter(t => t.completed).length} | 
              Remaining: {state.context.todos.filter(t => !t.completed).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

