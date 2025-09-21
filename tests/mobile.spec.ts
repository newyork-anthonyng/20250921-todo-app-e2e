import { test, expect } from '@playwright/test';

test.describe('Todo App - Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify app loads correctly
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
    await expect(page.getByText('No todos yet!')).toBeVisible();

    // Test adding a todo
    await page.getByPlaceholder('Add a new todo...').fill('Mobile test');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Mobile test')).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Touch test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Test touch interactions
    const checkbox = page.getByRole('checkbox');
    await checkbox.tap();
    await expect(checkbox).toBeChecked();

    // Test edit button touch
    await page.getByRole('button', { name: 'Edit' }).tap();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('should have proper mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that elements are properly sized for mobile
    const input = page.getByPlaceholder('Add a new todo...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Verify elements are visible and properly sized
    await expect(input).toBeVisible();
    await expect(addButton).toBeVisible();

    // Check that the layout doesn't overflow
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(375);
  });

  test('should handle keyboard on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Focus on input (should trigger mobile keyboard)
    await page.getByPlaceholder('Add a new todo...').focus();
    await page.keyboard.type('Mobile keyboard test');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Mobile keyboard test')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify app loads correctly
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();

    // Add multiple todos to test layout
    const todos = ['Tablet todo 1', 'Tablet todo 2', 'Tablet todo 3'];
    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo...').fill(todo);
      await page.getByRole('button', { name: 'Add' }).click();
    }

    // Verify all todos are visible
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }
  });

  test('should handle orientation changes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('Orientation test');
    await page.getByRole('button', { name: 'Add' }).click();

    // Change to landscape
    await page.setViewportSize({ width: 667, height: 375 });

    // Verify todo is still visible and functional
    await expect(page.getByText('Orientation test')).toBeVisible();
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('checkbox')).toBeChecked();

    // Change back to portrait
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify everything still works
    await expect(page.getByText('Orientation test')).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeChecked();
  });
});
