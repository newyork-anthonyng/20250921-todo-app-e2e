# Todo App E2E Testing

This project includes comprehensive end-to-end (e2e) tests using Playwright to ensure the todo application works correctly across different browsers and devices.

## Test Structure

The tests are organized into several files:

- **`todo-app.spec.ts`** - Core functionality tests (CRUD operations, UI interactions)
- **`accessibility.spec.ts`** - Accessibility and keyboard navigation tests
- **`local-storage.spec.ts`** - Local storage persistence and data handling tests
- **`mobile.spec.ts`** - Mobile responsiveness and touch interaction tests
- **`utils/todo-app-page.ts`** - Page Object Model utilities for test organization
- **`fixtures/test-data.ts`** - Test data and scenarios for consistent testing

## Running Tests

### Prerequisites

Make sure you have installed the dependencies:

```bash
pnpm install
```

### Available Test Commands

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests with UI mode (interactive)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug

# Show test report
pnpm test:e2e:report
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test todo-app.spec.ts

# Run tests matching a pattern
npx playwright test --grep "should add a new todo"

# Run tests in specific browser
npx playwright test --project=chromium
```

## Test Coverage

The test suite covers:

### Core Functionality
- ✅ Adding todos
- ✅ Toggling completion status
- ✅ Editing todos inline
- ✅ Deleting todos
- ✅ Empty state handling
- ✅ Form validation
- ✅ Summary statistics

### Accessibility
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Proper heading structure

### Data Persistence
- ✅ Local storage saving/loading
- ✅ Cross-session persistence
- ✅ Error handling for corrupted data
- ✅ Empty state handling

### Mobile & Responsive
- ✅ Mobile viewport testing
- ✅ Touch interactions
- ✅ Orientation changes
- ✅ Tablet compatibility
- ✅ Responsive layout

### Cross-Browser
- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile browsers

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:3000`
- **Auto-start dev server**: Tests automatically start the Next.js dev server
- **Multiple browsers**: Chrome, Firefox, Safari, and mobile browsers
- **Retry logic**: Failed tests retry 2 times on CI
- **Trace collection**: Traces are collected for failed tests
- **HTML reporter**: Detailed test reports with screenshots and videos

## Test Data

Test data is centralized in `tests/fixtures/test-data.ts` and includes:

- Sample todo text (simple, special characters, unicode, etc.)
- Pre-defined todo lists for bulk testing
- Local storage test scenarios
- Viewport configurations
- Accessibility test data

## Page Object Model

The `TodoAppPage` class in `utils/todo-app-page.ts` provides:

- Reusable methods for common actions
- Consistent element selectors
- Helper methods for assertions
- Clean test organization

Example usage:

```typescript
import { setupTest } from './utils/todo-app-page';

test('should add a todo', async ({ page }) => {
  const todoApp = await setupTest(page);
  
  await todoApp.addTodo('Test todo');
  await todoApp.expectTodoVisible('Test todo');
  await todoApp.expectTodoCount(1);
});
```

## CI/CD Integration

The tests are configured to run in CI environments with:

- Automatic browser installation
- Retry logic for flaky tests
- HTML report generation
- Trace collection for debugging

## Debugging Tests

### Visual Debugging

```bash
# Run tests with browser visible
pnpm test:e2e:headed

# Run tests in debug mode (step through)
pnpm test:e2e:debug
```

### Test Reports

After running tests, view the detailed report:

```bash
pnpm test:e2e:report
```

The report includes:
- Test results and timing
- Screenshots of failures
- Video recordings
- Trace files for debugging

### Common Issues

1. **Port conflicts**: Make sure port 3000 is available
2. **Browser issues**: Run `npx playwright install` to ensure browsers are installed
3. **Timing issues**: Tests include proper waits, but you may need to adjust timing for slower environments

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Use the Page Object Model utilities
3. Add appropriate test data to fixtures
4. Include both positive and negative test cases
5. Test across different viewports when relevant
6. Update this README if adding new test categories
