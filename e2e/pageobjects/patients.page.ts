import { $ } from '@wdio/globals';

class PatientsPage {
  get newPatientButton() {
    return $('[data-testid="patients-new-button"]');
  }

  async open(): Promise<void> {
    await browser.url('/pacientes');
  }

  async openCreateModal(): Promise<void> {
    await this.newPatientButton.waitForClickable();
    await this.newPatientButton.click();
  }
}

export default new PatientsPage();
