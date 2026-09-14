import { expect } from '@wdio/globals';
import { demoAccounts, DemoAccountTier } from '../fixtures/demo-accounts';
import { uniquePatientData } from '../fixtures/patient-data';
import loginPage from '../pageobjects/login.page';
import patientsPage from '../pageobjects/patients.page';
import patientQuickCreatePage from '../pageobjects/patient-quick-create.page';
import patientDetailPage from '../pageobjects/patient-detail.page';
import historiaClinicaPage from '../pageobjects/historia-clinica.page';

const tiers: DemoAccountTier[] = ['free', 'paid', 'clinic'];

/** Creates a fresh patient and opens their (freshly started) Historia Clínica. */
async function createPatientAndStartHistoriaClinica(): Promise<void> {
  await patientsPage.open();
  await patientsPage.openCreateModal();
  await patientQuickCreatePage.submit(uniquePatientData());
  await patientDetailPage.waitForPatientCreated();
  await patientDetailPage.startHistoriaClinica();
}

describe('Historia Clínica', () => {
  for (const tier of tiers) {
    describe(`${tier} tier`, () => {
      beforeEach(async () => {
        const account = demoAccounts[tier];
        await loginPage.login(account.email, account.password);
      });

      it(`${tier} tier: starts and saves a new Historia Clínica as a draft`, async () => {
        await createPatientAndStartHistoriaClinica();

        await historiaClinicaPage.saveDraft();

        await expect(historiaClinicaPage.statusBadge).toBeDisplayed();
        await expect(historiaClinicaPage.statusBadge).toHaveText('Borrador');
      });

      it(`${tier} tier: blocks finalizing when a required NOM-004 section is incomplete`, async () => {
        await createPatientAndStartHistoriaClinica();

        await historiaClinicaPage.finalize();

        await expect(historiaClinicaPage.finalizeError).toBeDisplayed();
        const incompleteSections = await historiaClinicaPage.incompleteSectionLabels();
        expect(incompleteSections.length).toBeGreaterThan(0);
        await expect(historiaClinicaPage.statusBadge).toHaveText('Borrador');
      });
    });
  }
});
