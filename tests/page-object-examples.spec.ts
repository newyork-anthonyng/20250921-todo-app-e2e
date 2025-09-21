import { test, expect } from '@playwright/test';
import { setupTest, TodoAppPage } from './utils/todo-app-page';
import { testData } from './fixtures/test-data';

test.describe('Todo App - Page Object Model Examples', () => {
  test('should demonstrate Page Object Model usage', async ({ page }) => {
    const todoApp = await setupTest(page);

    // Add multiple todos using the utility method
    await todoApp.addMultipleTodos(testData.todoLists.basic);

    // Verify todos were added
    await todoApp.expectTodoCount(3);
    await todoApp.expectTodoVisible('Todo 1');
    await todoApp.expectTodoVisible('Todo 2');
    await todoApp.expectTodoVisible('Todo 3');

    // Complete first todo
    await todoApp.toggleTodo(0);
    await todoApp.expectTodoCompleted(0, true);

    // Edit second todo
    await todoApp.startEditingTodo(1);
    await todoApp.editTodo('Edited Todo 2');
    await todoApp.expectTodoVisible('Edited Todo 2');

    // Delete third todo
    await todoApp.deleteTodo(2);
    await todoApp.expectTodoNotVisible('Todo 3');
    await todoApp.expectTodoCount(2);

    // Verify summary is visible
    await todoApp.expectSummaryVisible();
  });

  test('should handle edge cases with Page Object Model', async ({ page }) => {
    const todoApp = await setupTest(page);

    // Test empty todo submission
    await todoApp.addTodo('');
    await todoApp.expectEmptyState();

    // Test whitespace-only todo
    await todoApp.addTodo('   ');
    await todoApp.expectEmptyState();

    // Test valid todo
    await todoApp.addTodo(testData.todos.simple);
    await todoApp.expectTodoVisible(testData.todos.simple);
    await todoApp.expectTodoCount(1);

    // Test editing to empty
    await todoApp.startEditingTodo(0);
    await todoApp.editTodo('');
    await todoApp.expectEmptyState();
  });

  test('should work with special characters and unicode', async ({ page }) => {
    const todoApp = await setupTest(page);

    // Add todos with special characters
    await todoApp.addTodo(testData.todos.unicode);
    await todoApp.addTodo(testData.todos.withSpecialChars);
    await todoApp.addTodo(testData.todos.symbols);

    // Verify all todos are visible
    await todoApp.expectTodoVisible(testData.todos.unicode);
    await todoApp.expectTodoVisible(testData.todos.withSpecialChars);
    await todoApp.expectTodoVisible(testData.todos.symbols);

    await todoApp.expectTodoCount(3);
  });

  test('should handle rapid operations gracefully', async ({ page }) => {
    const todoApp = await setupTest(page);

    // Rapidly add todos
    const rapidTodos = testData.todoLists.large.slice(0, 10);
    await todoApp.addMultipleTodos(rapidTodos);

    // Verify all were added
    await todoApp.expectTodoCount(10);

    // Rapidly toggle todos
    for (let i = 0; i < 5; i++) {
      await todoApp.toggleTodo(i);
    }

    // Verify completion states
    const completedCount = await todoApp.getCompletedCount();
    expect(completedCount).toBe(5);

    // Rapidly delete todos
    for (let i = 0; i < 5; i++) {
      await todoApp.deleteTodo(0); // Always delete first item
    }

    await todoApp.expectTodoCount(5);
  });
});
