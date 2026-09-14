import { $ } from '@wdio/globals';

class PatientDetailPage {
  get folio() {
    return $('[data-testid="patient-detail-folio"]');
  }

  get startHistoriaClinicaButton() {
    return $('[data-testid="patient-start-historia-clinica"]');
  }

  async waitForPatientCreated(): Promise<void> {
    await this.folio.waitForDisplayed({ timeout: 10000 });
  }

  async startHistoriaClinica(): Promise<void> {
    await this.startHistoriaClinicaButton.waitForClickable();
    await this.startHistoriaClinicaButton.click();
  }
}

export default new PatientDetailPage();
