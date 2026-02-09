import { test, expect } from '@playwright/test';

test.describe('Emergency Alert Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock emergency contacts in localStorage
        await page.addInitScript(() => {
            window.localStorage.setItem('emergency_contacts', JSON.stringify([
                { id: '1', name: 'Test Contact', relation: 'Friend', phone: '1234567890' }
            ]));
        });

        // Go to the home page before each test
        await page.goto('/');
    });

    test('should trigger countdown and show alert screen', async ({ page }) => {
        // Wait for translations to load (look for EMERGENCY button text)
        await expect(page.getByRole('button', { name: /EMERGENCY|EMERGENCIA/i })).toBeVisible();

        // 1. Verify we are on the Ready screen matches logo
        await expect(page.getByRole('img', { name: /Aura Speaks AI|Alerta de Convulsión/i })).toBeVisible();

        // Handle Install Prompt (Mobile) - dismiss if present
        const closeInstallBtn = page.getByRole('button', { name: /Close|Cerrar|Not Now|Ahora No/i }).first();
        try {
            // Wait up to 2s for prompt to appear
            await closeInstallBtn.waitFor({ state: 'visible', timeout: 2000 });
            await closeInstallBtn.click();
            await page.waitForTimeout(500); // Allow closing animation
        } catch (e) {
            // Prompt didn't appear, ignore
        }

        // 2. Click the Emergency Button
        const emergencyBtn = page.getByRole('button', { name: /EMERGENCY|EMERGENCIA/i });
        await expect(emergencyBtn).toBeVisible();
        await emergencyBtn.click({ force: true });

        // 3. Verify Countdown starts
        await expect(page.getByText(/Slide to Cancel|Deslizar para Cancelar/i)).toBeVisible();

        // 4. Wait for countdown to finish (default is 5 seconds)
        await page.waitForTimeout(6000);

        // 5. Verify "Medical Emergency" Alert Screen
        await expect(page.getByText(/MEDICAL EMERGENCY|EMERGENCIA MÉDICA/i)).toBeVisible();
        await expect(page.getByText(/I am having a seizure|Estoy teniendo una convulsión/i)).toBeVisible();

        // 6. Verify "I'm OK" button exists to reset
        const okBtn = page.getByRole('button', { name: /I'm OK|Estoy Bien/i });
        await expect(okBtn).toBeVisible();
        await okBtn.click();

        // 7. Verify return to Ready Screen
        await expect(page.getByRole('button', { name: /EMERGENCY|EMERGENCIA/i })).toBeVisible();
    });
});
