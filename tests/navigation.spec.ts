import { test, expect } from '@playwright/test';

test.describe('Navigation and Settings', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open and close settings modal', async ({ page }) => {
        // Wait for App to load and translations to be ready
        await expect(page.getByRole('button', { name: /EMERGENCY|EMERGENCIA/i })).toBeVisible();

        // 1. Click Settings Icon (Gear) using accessible label
        const settingsBtn = page.getByLabel('Open settings');
        await settingsBtn.click();

        // 2. Verify Settings Modal
        await expect(page.getByText(/Settings|Configuración/i).first()).toBeVisible();

        // 3. Close Settings (X button) using accessible label
        const closeBtn = page.getByLabel('Close settings');
        await closeBtn.click();

        // 4. Verify Modal is gone
        await expect(page.getByText(/Settings|Configuración/i).first()).not.toBeVisible();
    });

    test('should toggle language', async ({ page }) => {
        // 1. Check initial language (visual check)
        const isEnglish = await page.getByText('EMERGENCY').isVisible();

        // Locate the language switcher button. 
        // It's the one with text "English" or "Español".
        const langBtn = page.getByRole('button').filter({ hasText: /English|Español/ }).first();
        await expect(langBtn).toBeVisible();

        if (isEnglish) {
            // Switch to Spanish
            await langBtn.click();
            await expect(page.getByText('EMERGENCIA')).toBeVisible();

            // Switch back to English
            // We need to re-locate or confirm the button is still valid, 
            // but Playwright locators are strict. 
            // The button text changes, so the filter might lose it? 
            // No, the locator is evaluated at action time.
            // Let's re-query to be safe.
            await page.getByRole('button').filter({ hasText: /English|Español/ }).first().click();
            await expect(page.getByText('EMERGENCY')).toBeVisible();
        } else {
            // Already in Spanish, switch to English
            await langBtn.click();
            await expect(page.getByText('EMERGENCY')).toBeVisible();

            // Switch back to Spanish to confirm toggle works both ways? 
            // Optional, but good practice.
            await page.getByRole('button').filter({ hasText: /English|Español/ }).first().click();
            await expect(page.getByText('EMERGENCIA')).toBeVisible();
        }
    });
});
