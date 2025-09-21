import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the app title and empty state', async ({ page }) => {
    await page.goto('/');

    // Check app title
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
    await expect(page.getByText('Manage your tasks with ease')).toBeVisible();

    // Check empty state
    await expect(page.getByText('No todos yet!')).toBeVisible();
    await expect(page.getByText('Add your first todo above to get started.')).toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Buy groceries');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify todo was added
    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Your Todos (1)')).toBeVisible();
    await expect(page.getByText('No todos yet!')).not.toBeVisible();
  });

  test('should not add empty todos', async ({ page }) => {
    await page.goto('/');

    // Try to add empty todo
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify no todo was added
    await expect(page.getByText('No todos yet!')).toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
  });

  test('should not add todos with only whitespace', async ({ page }) => {
    await page.goto('/');

    // Try to add whitespace-only todo
    await page.getByPlaceholder('Add a new todo...').fill('   ');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify no todo was added
    await expect(page.getByText('No todos yet!')).toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Complete project');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify todo is not completed initially
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await expect(page.getByText('Complete project')).not.toHaveClass(/line-through/);

    // Toggle completion
    await checkbox.click();

    // Verify todo is completed
    await expect(checkbox).toBeChecked();
    await expect(page.getByText('Complete project')).toHaveClass(/line-through/);
  });

  test('should delete a todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Delete me');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify todo exists
    await expect(page.getByText('Delete me')).toBeVisible();
    await expect(page.getByText('Your Todos (1)')).toBeVisible();

    // Delete the todo
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify todo was deleted
    await expect(page.getByText('Delete me')).not.toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
    await expect(page.getByText('No todos yet!')).toBeVisible();
  });

  test('should edit a todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Original text');
    await page.getByRole('button', { name: 'Add' }).click();

    // Start editing
    await page.getByRole('button', { name: 'Edit' }).click();

    // Verify edit mode is active
    const editInput = page.locator('input[type="text"]').filter({ hasText: 'Original text' });
    await expect(editInput).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // Edit the text
    await editInput.clear();
    await editInput.fill('Updated text');

    // Save the edit
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the edit was saved
    await expect(page.getByText('Updated text')).toBeVisible();
    await expect(page.getByText('Original text')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('should cancel editing a todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Original text');
    await page.getByRole('button', { name: 'Add' }).click();

    // Start editing
    await page.getByRole('button', { name: 'Edit' }).click();

    // Modify the text
    const editInput = page.locator('input[type="text"]').filter({ hasText: 'Original text' });
    await editInput.clear();
    await editInput.fill('This should not be saved');

    // Cancel the edit
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the original text is still there
    await expect(page.getByText('Original text')).toBeVisible();
    await expect(page.getByText('This should not be saved')).not.toBeVisible();
  });

  test('should cancel editing with Escape key', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Original text');
    await page.getByRole('button', { name: 'Add' }).click();

    // Start editing
    await page.getByRole('button', { name: 'Edit' }).click();

    // Modify the text
    const editInput = page.locator('input[type="text"]').filter({ hasText: 'Original text' });
    await editInput.clear();
    await editInput.fill('This should not be saved');

    // Press Escape to cancel
    await editInput.press('Escape');

    // Verify the original text is still there
    await expect(page.getByText('Original text')).toBeVisible();
    await expect(page.getByText('This should not be saved')).not.toBeVisible();
  });

  test('should not save empty edits', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Original text');
    await page.getByRole('button', { name: 'Add' }).click();

    // Start editing
    await page.getByRole('button', { name: 'Edit' }).click();

    // Clear the text
    const editInput = page.locator('input[type="text"]').filter({ hasText: 'Original text' });
    await editInput.clear();

    // Try to save empty text
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the todo was cancelled (not saved)
    await expect(page.getByText('Original text')).not.toBeVisible();
    await expect(page.getByText('Your Todos (0)')).toBeVisible();
  });

  test('should display summary statistics', async ({ page }) => {
    await page.goto('/');

    // Add multiple todos
    await page.getByPlaceholder('Add a new todo...').fill('Todo 1');
    await page.getByRole('button', { name: 'Add' }).click();

    await page.getByPlaceholder('Add a new todo...').fill('Todo 2');
    await page.getByRole('button', { name: 'Add' }).click();

    await page.getByPlaceholder('Add a new todo...').fill('Todo 3');
    await page.getByRole('button', { name: 'Add' }).click();

    // Complete one todo
    await page.getByRole('checkbox').first().click();

    // Verify summary
    await expect(page.getByText('Summary')).toBeVisible();
    await expect(page.getByText('Total: 3 | Completed: 1 | Remaining: 2')).toBeVisible();
  });

  test('should not display summary when no todos exist', async ({ page }) => {
    await page.goto('/');

    // Verify no summary is shown
    await expect(page.getByText('Summary')).not.toBeVisible();
  });

  test('should persist todos in localStorage', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Persistent todo');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify todo exists
    await expect(page.getByText('Persistent todo')).toBeVisible();

    // Reload the page
    await page.reload();

    // Verify todo persists
    await expect(page.getByText('Persistent todo')).toBeVisible();
    await expect(page.getByText('Your Todos (1)')).toBeVisible();
  });

  test('should handle multiple todos correctly', async ({ page }) => {
    await page.goto('/');

    // Add multiple todos
    const todos = ['First todo', 'Second todo', 'Third todo'];
    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo...').fill(todo);
      await page.getByRole('button', { name: 'Add' }).click();
    }

    // Verify all todos are displayed
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }

    // Verify count
    await expect(page.getByText('Your Todos (3)')).toBeVisible();

    // Complete the middle todo
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.nth(1).click();

    // Verify only the second todo is completed
    await expect(checkboxes.nth(0)).not.toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
    await expect(checkboxes.nth(2)).not.toBeChecked();

    // Delete the first todo
    await page.getByRole('button', { name: 'Delete' }).first().click();

    // Verify remaining todos
    await expect(page.getByText('First todo')).not.toBeVisible();
    await expect(page.getByText('Second todo')).toBeVisible();
    await expect(page.getByText('Third todo')).toBeVisible();
    await expect(page.getByText('Your Todos (2)')).toBeVisible();
  });

  test('should handle rapid todo operations', async ({ page }) => {
    await page.goto('/');

    // Rapidly add multiple todos
    for (let i = 1; i <= 5; i++) {
      await page.getByPlaceholder('Add a new todo...').fill(`Rapid todo ${i}`);
      await page.getByRole('button', { name: 'Add' }).click();
    }

    // Verify all todos were added
    await expect(page.getByText('Your Todos (5)')).toBeVisible();

    // Rapidly toggle todos
    const checkboxes = page.getByRole('checkbox');
    for (let i = 0; i < 5; i++) {
      await checkboxes.nth(i).click();
    }

    // Verify all todos are completed
    for (let i = 0; i < 5; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });
});
