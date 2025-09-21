export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoContext {
  todos: Todo[];
  editingId: string | null;
}

export type TodoEvent =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'EDIT_TODO'; id: string; text: string }
  | { type: 'START_EDITING'; id: string }
  | { type: 'CANCEL_EDITING' }
  | { type: 'LOAD_TODOS'; todos: Todo[] };

