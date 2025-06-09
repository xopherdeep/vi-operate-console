import { test, expect } from '@playwright/test';

test.describe('Workflow Builder', () => {
  test('should redirect from old builder path to workflows builder', async ({ page }) => {
    // Navigate to the old builder path
    await page.goto('/console/automations/builder');
    
    // Should be redirected to the workflow builder path
    await expect(page).toHaveURL('/console/automations/workflows/builder');
    
    // Should show the loading text during redirect
    await expect(page.getByText('Redirecting to Workflow Builder')).toBeVisible();
  });

  test('should render workflow builder page', async ({ page }) => {
    // Navigate to the workflow builder
    await page.goto('/console/automations/workflows/builder');
    
    // Check for main components
    await expect(page.getByRole('textbox', { name: /New Workflow/i })).toBeVisible();
    
    // Check for canvas container
    await expect(page.locator('.react-flow')).toBeVisible();
  });

  test('should connect automations creation flow to builder', async ({ page }) => {
    // Start at the create page
    await page.goto('/console/automations/create');
    
    // Fill in the prompt
    await page.fill('input[type="text"]', 'Create a workflow that sends notifications');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Save and create automation button should appear in the sheet
    await expect(page.getByText('Save and create automation')).toBeVisible();
    
    // Clicking should navigate to the workflow builder
    await page.click('text=Save and create automation');
    
    // Should be on the workflow builder page
    await expect(page).toHaveURL('/console/automations/workflows/builder');
  });
});
