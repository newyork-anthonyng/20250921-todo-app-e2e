import { createMachine, assign } from 'xstate';
import { Todo, TodoContext, TodoEvent } from '../types/todo';

export const todoMachine = createMachine({
  id: 'todoApp',
  initial: 'idle',
  context: {
    todos: [] as Todo[],
    editingId: null as string | null,
  },
  states: {
    idle: {
      on: {
        ADD_TODO: {
          actions: assign({
            todos: ({ context, event }) => {
              const newTodo: Todo = {
                id: Date.now().toString(),
                text: event.text,
                completed: false,
                createdAt: new Date(),
              };
              return [...context.todos, newTodo];
            },
          }),
        },
        TOGGLE_TODO: {
          actions: assign({
            todos: ({ context, event }) =>
              context.todos.map((todo) =>
                todo.id === event.id
                  ? { ...todo, completed: !todo.completed }
                  : todo
              ),
          }),
        },
        DELETE_TODO: {
          actions: assign({
            todos: ({ context, event }) =>
              context.todos.filter((todo) => todo.id !== event.id),
          }),
        },
        EDIT_TODO: {
          actions: assign({
            todos: ({ context, event }) =>
              context.todos.map((todo) =>
                todo.id === event.id
                  ? { ...todo, text: event.text }
                  : todo
              ),
            editingId: null,
          }),
        },
        START_EDITING: {
          actions: assign({
            editingId: ({ event }) => event.id,
          }),
        },
        CANCEL_EDITING: {
          actions: assign({
            editingId: null,
          }),
        },
        LOAD_TODOS: {
          actions: assign({
            todos: ({ event }) => event.todos,
          }),
        },
      },
    },
  },
});

