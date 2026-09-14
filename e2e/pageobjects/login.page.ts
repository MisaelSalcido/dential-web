import { $ } from '@wdio/globals';

class LoginPage {
  get emailInput() {
    return $('[data-testid="login-email"]');
  }

  get passwordInput() {
    return $('[data-testid="login-password"]');
  }

  get submitButton() {
    return $('[data-testid="login-submit"]');
  }

  get serverError() {
    return $('[data-testid="login-server-error"]');
  }

  get userMenuTrigger() {
    return $('[data-testid="user-menu-trigger"]');
  }

  get userMenuLogout() {
    return $('[data-testid="user-menu-logout"]');
  }

  /**
   * Ends any session left by a previous scenario before navigating to /login — otherwise the
   * guest guard redirects an already-authenticated session away from the login form. Uses the
   * app's real logout action (rather than clearing cookies directly) because the HttpOnly
   * refresh-token cookie is set by the API's own origin, which WebDriver's standard cookie APIs
   * can't see/clear while the browser is on the app's origin.
   */
  async open(): Promise<void> {
    // A full navigation resets any leftover client-side UI state (e.g. an open modal) from the
    // previous scenario before deciding whether a logout is needed. The app's root
    // provideAppInitializer silently attempts a session restore (via the refresh-token cookie)
    // before any route renders, so checking for the user menu immediately after the navigation
    // resolves races that async check — wait for the app to settle into one of its two possible
    // post-bootstrap states first.
    await browser.url('/');
    await browser.waitUntil(
      async () => (await this.userMenuTrigger.isExisting()) || (await this.emailInput.isExisting()),
      { timeout: 10000, timeoutMsg: 'App did not settle into a logged-in or logged-out state in time' },
    );

    if (await this.userMenuTrigger.isExisting()) {
      await this.userMenuTrigger.click();
      await this.userMenuLogout.waitForClickable();
      await this.userMenuLogout.click();
      await browser.waitUntil(async () => (await browser.getUrl()).includes('/login'), {
        timeout: 10000,
        timeoutMsg: 'Logout did not redirect to /login in time',
      });
      await this.emailInput.waitForDisplayed({ timeout: 10000 });
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.open();
    await this.emailInput.waitForDisplayed({ timeout: 10000 });
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.submitButton.click();
    await browser.waitUntil(async () => !(await browser.getUrl()).includes('/login'), {
      timeout: 10000,
      timeoutMsg: 'Login did not redirect away from /login in time',
    });
  }
}

export default new LoginPage();
