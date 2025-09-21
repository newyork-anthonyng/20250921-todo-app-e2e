export const testData = {
  todos: {
    simple: 'Buy groceries',
    withSpecialChars: 'Complete project & finish documentation!',
    longText: 'This is a very long todo item that should test how the application handles longer text content and whether it wraps properly in the UI',
    empty: '',
    whitespace: '   ',
    multiline: 'Line 1\nLine 2\nLine 3',
    unicode: '🚀 Complete rocket ship project 🚀',
    numbers: '123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  },
  
  todoLists: {
    basic: ['Todo 1', 'Todo 2', 'Todo 3'],
    mixed: ['Completed todo', 'Pending todo', 'Another pending todo'],
    large: Array.from({ length: 20 }, (_, i) => `Todo ${i + 1}`),
    special: ['🚀 Launch app', 'Fix bug #123', 'Update docs & tests'],
  },

  localStorage: {
    validTodos: [
      {
        id: '1',
        text: 'Pre-existing todo',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        text: 'Another pre-existing todo',
        completed: true,
        createdAt: new Date().toISOString()
      }
    ],
    emptyArray: [],
    corrupted: 'invalid json data',
    nullValue: null,
  },

  viewports: {
    mobile: { width: 375, height: 667 },
    mobileLandscape: { width: 667, height: 375 },
    tablet: { width: 768, height: 1024 },
    tabletLandscape: { width: 1024, height: 768 },
    desktop: { width: 1920, height: 1080 },
    smallDesktop: { width: 1280, height: 720 },
  },

  timing: {
    shortDelay: 100,
    mediumDelay: 500,
    longDelay: 1000,
    animationWait: 200,
  },
};

export const testScenarios = {
  rapidOperations: {
    description: 'Rapidly adding, editing, and deleting todos',
    steps: [
      { action: 'add', data: 'Rapid todo 1' },
      { action: 'add', data: 'Rapid todo 2' },
      { action: 'toggle', index: 0 },
      { action: 'edit', index: 1, data: 'Edited rapid todo 2' },
      { action: 'delete', index: 0 },
    ],
  },

  edgeCases: {
    description: 'Testing edge cases and error conditions',
    steps: [
      { action: 'add', data: '' },
      { action: 'add', data: '   ' },
      { action: 'add', data: 'Valid todo' },
      { action: 'edit', index: 0, data: '' },
      { action: 'edit', index: 0, data: '   ' },
    ],
  },

  stressTest: {
    description: 'Stress testing with many operations',
    steps: Array.from({ length: 50 }, (_, i) => ({
      action: 'add',
      data: `Stress test todo ${i + 1}`
    })),
  },
};

export const accessibilityTestData = {
  keyboardNavigation: [
    { key: 'Tab', description: 'Navigate to next element' },
    { key: 'Shift+Tab', description: 'Navigate to previous element' },
    { key: 'Enter', description: 'Activate button or submit form' },
    { key: 'Space', description: 'Toggle checkbox' },
    { key: 'Escape', description: 'Cancel editing' },
  ],

  screenReaderTexts: [
    'Todo App',
    'Manage your tasks with ease',
    'Add a new todo...',
    'Add',
    'Your Todos',
    'No todos yet!',
    'Add your first todo above to get started.',
    'Summary',
  ],

  ariaLabels: [
    'checkbox',
    'button',
    'textbox',
    'heading',
  ],
};
