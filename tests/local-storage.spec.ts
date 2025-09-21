import { test, expect } from '@playwright/test';

test.describe('Todo App - Local Storage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should save todos to localStorage', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Storage test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Wait a bit for localStorage to be updated
    await page.waitForTimeout(100);

    // Check localStorage contains the todo
    const todosInStorage = await page.evaluate(() => {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : null;
    });

    expect(todosInStorage).toBeTruthy();
    expect(todosInStorage).toHaveLength(1);
    expect(todosInStorage[0].text).toBe('Storage test');
    expect(todosInStorage[0].completed).toBe(false);
  });

  test('should load todos from localStorage on page load', async ({ page }) => {
    // Set up localStorage with existing todos
    await page.goto('/');
    await page.evaluate(() => {
      const todos = [
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
      ];
      localStorage.setItem('todos', JSON.stringify(todos));
    });

    // Reload the page
    await page.reload();
    
    // Wait for the app to load and process localStorage
    await page.waitForTimeout(500);

    // Verify todos are loaded
    await expect(page.getByText('Pre-existing todo')).toBeVisible();
    await expect(page.getByText('Another pre-existing todo')).toBeVisible();
    await expect(page.getByText('Your Todos (2)')).toBeVisible();

    // Verify completion status
    const checkboxes = page.getByRole('checkbox');
    await expect(checkboxes.nth(0)).not.toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
  });

  test('should update localStorage when todos change', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Update test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Complete the todo
    await page.getByRole('checkbox').click();
    
    // Wait for localStorage to be updated
    await page.waitForTimeout(100);

    // Check localStorage was updated
    const todosInStorage = await page.evaluate(() => {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : null;
    });

    expect(todosInStorage).toHaveLength(1);
    expect(todosInStorage[0].completed).toBe(true);

    // Delete the todo
    await page.getByRole('button', { name: 'Delete' }).click();

    // Check localStorage was updated
    const todosAfterDelete = await page.evaluate(() => {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : null;
    });

    expect(todosAfterDelete).toHaveLength(0);
  });

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.goto('/');

    // Set corrupted data in localStorage
    await page.evaluate(() => {
      localStorage.setItem('todos', 'invalid json data');
    });

    // Reload the page
    await page.reload();

    // Verify app still works (should start with empty state)
    await expect(page.getByText('No todos yet!')).toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();

    // Verify we can still add todos
    await page.getByPlaceholder('Add a new todo...').fill('Recovery test');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Recovery test')).toBeVisible();
  });

  test('should handle empty localStorage gracefully', async ({ page }) => {
    await page.goto('/');

    // Set empty localStorage
    await page.evaluate(() => {
      localStorage.setItem('todos', '[]');
    });

    // Reload the page
    await page.reload();

    // Verify app shows empty state
    await expect(page.getByText('No todos yet!')).toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
  });

  test('should persist todos across browser sessions', async ({ page, context }) => {
    await page.goto('/');

    // Add multiple todos with different states
    await page.getByPlaceholder('Add a new todo...').fill('Session todo 1');
    await page.getByRole('button', { name: 'Add' }).click();

    await page.getByPlaceholder('Add a new todo...').fill('Session todo 2');
    await page.getByRole('button', { name: 'Add' }).click();

    // Complete one todo
    await page.getByRole('checkbox').first().click();

    // Edit one todo
    await page.getByRole('button', { name: 'Edit' }).nth(1).click();
    await page.locator('input[type="text"]').filter({ hasText: 'Session todo 2' }).fill('Edited session todo 2');
    await page.getByRole('button', { name: 'Save' }).click();

    // Create a new context (simulating new browser session)
    const newContext = await context.browser()?.newContext();
    const newPage = await newContext?.newPage();

    if (newPage) {
      await newPage.goto('/');

      // Verify todos persist
      await expect(newPage.getByText('Session todo 1')).toBeVisible();
      await expect(newPage.getByText('Edited session todo 2')).toBeVisible();
      await expect(newPage.getByText('Your Todos (2)')).toBeVisible();

      // Verify states persist
      const checkboxes = newPage.getByRole('checkbox');
      await expect(checkboxes.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).not.toBeChecked();

      await newContext?.close();
    }
  });
});
