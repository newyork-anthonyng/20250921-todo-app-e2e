'use client';

import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onCancelEdit: () => void;
}

export function TodoList({
  todos,
  editingId,
  onToggle,
  onDelete,
  onStartEdit,
  onEdit,
  onCancelEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No todos yet!</p>
        <p className="text-sm">Add your first todo above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  );
}

