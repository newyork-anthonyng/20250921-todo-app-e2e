import { Page, expect } from '@playwright/test';

export class TodoAppPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async addTodo(text: string) {
    await this.page.getByPlaceholder('Add a new todo...').fill(text);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }

  async addMultipleTodos(todos: string[]) {
    for (const todo of todos) {
      await this.addTodo(todo);
    }
  }

  async toggleTodo(index: number = 0) {
    const checkboxes = this.page.getByRole('checkbox');
    await checkboxes.nth(index).click();
  }

  async deleteTodo(index: number = 0) {
    const deleteButtons = this.page.getByRole('button', { name: 'Delete' });
    await deleteButtons.nth(index).click();
  }

  async startEditingTodo(index: number = 0) {
    const editButtons = this.page.getByRole('button', { name: 'Edit' });
    await editButtons.nth(index).click();
  }

  async editTodo(newText: string) {
    const editInput = this.page.locator('input[type="text"]').last();
    await editInput.clear();
    await editInput.fill(newText);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async cancelEdit() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async getTodoCount() {
    const countText = await this.page.getByText(/Your Todos \(\d+\)/).textContent();
    const match = countText?.match(/\((\d+)\)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getCompletedCount() {
    const checkboxes = this.page.getByRole('checkbox');
    const count = await checkboxes.count();
    let completed = 0;
    
    for (let i = 0; i < count; i++) {
      if (await checkboxes.nth(i).isChecked()) {
        completed++;
      }
    }
    
    return completed;
  }

  async expectTodoVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectTodoNotVisible(text: string) {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.page.getByText('No todos yet!')).toBeVisible();
    await expect(this.page.getByText('Add your first todo above to get started.')).toBeVisible();
  }

  async expectTodoCount(count: number) {
    await expect(this.page.getByText(`Your Todos (${count})`)).toBeVisible();
  }

  async expectSummaryVisible() {
    await expect(this.page.getByText('Summary')).toBeVisible();
  }

  async expectSummaryNotVisible() {
    await expect(this.page.getByText('Summary')).not.toBeVisible();
  }

  async getSummaryText() {
    return await this.page.getByText(/Total: \d+ \| Completed: \d+ \| Remaining: \d+/).textContent();
  }

  async expectTodoCompleted(index: number, completed: boolean = true) {
    const checkbox = this.page.getByRole('checkbox').nth(index);
    if (completed) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  async expectEditMode(index: number) {
    const editInput = this.page.getByDisplayValue(/.*/);
    await expect(editInput).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  }

  async expectNotEditMode() {
    await expect(this.page.getByRole('button', { name: 'Save' })).not.toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).not.toBeVisible();
  }
}

export async function setupTest(page: Page) {
  const todoApp = new TodoAppPage(page);
  await todoApp.goto();
  await todoApp.clearStorage();
  return todoApp;
}
