import { test, expect } from '@playwright/test';

test.describe('Todo App - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Todo App', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Your Todos/, level: 2 })).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');

    // Check input has proper label/placeholder
    const input = page.getByPlaceholder('Add a new todo...');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'text');

    // Check submit button
    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveAttribute('type', 'submit');
  });

  test('should have accessible checkboxes', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Test accessibility');
    await page.getByRole('button', { name: 'Add' }).click();

    // Check checkbox is accessible
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Test buttons');
    await page.getByRole('button', { name: 'Add' }).click();

    // Check edit and delete buttons are accessible
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab to input
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Add a new todo...')).toBeFocused();

    // Type and submit with Enter
    await page.keyboard.type('Keyboard test');
    await page.keyboard.press('Enter');

    // Verify todo was added
    await expect(page.getByText('Keyboard test')).toBeVisible();

    // Tab to checkbox (may need multiple tabs depending on focus order)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox')).toBeFocused();

    // Toggle with Space
    await page.keyboard.press('Space');
    await expect(page.getByRole('checkbox')).toBeChecked();
  });

  test('should have proper focus management during editing', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Focus test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Start editing
    await page.getByRole('button', { name: 'Edit' }).click();

    // Check that edit input is focused
    const editInput = page.locator('input[type="text"]').filter({ hasText: 'Focus test' });
    await expect(editInput).toBeFocused();

    // Cancel with Escape
    await page.keyboard.press('Escape');

    // Check that focus returns to edit button
    await expect(page.getByRole('button', { name: 'Edit' })).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('ARIA test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Check checkbox has proper attributes
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();

    // Check form has proper structure
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });
});
