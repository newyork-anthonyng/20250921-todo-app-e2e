import { test, expect } from '@playwright/test';

test.describe('Todo App Smoke Test', () => {
  test('should complete basic todo workflow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Verify the app loads
    await expect(page.locator('h1')).toHaveText('Todo App');
    
    // 1. Add a todo
    await page.fill('[data-testid="add-todo-input"]', 'Test todo');
    await page.click('[data-testid="add-todo-button"]');
    
    // 2. Verify it appears
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="todo-text"]')).toHaveText('Test todo');
    
    // 3. Mark as completed
    await page.click('[data-testid="todo-checkbox"]');
    await expect(page.locator('[data-testid="todo-text"]')).toHaveClass(/line-through/);
    
    // 4. Delete the todo
    await page.click('[data-testid="delete-todo-button"]');
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
  });
});
