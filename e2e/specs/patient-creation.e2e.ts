import { expect } from '@wdio/globals';
import { demoAccounts, DemoAccountTier } from '../fixtures/demo-accounts';
import { uniquePatientData } from '../fixtures/patient-data';
import loginPage from '../pageobjects/login.page';
import patientsPage from '../pageobjects/patients.page';
import patientQuickCreatePage from '../pageobjects/patient-quick-create.page';
import patientDetailPage from '../pageobjects/patient-detail.page';

const tiers: DemoAccountTier[] = ['free', 'paid', 'clinic'];

/**
 * Rotates which required field is left blank across tiers (rather than testing all three per
 * tier) so the 12-scenario suite (spec FR-009) exercises every required-field validator exactly
 * once without redundant coverage.
 */
const MISSING_FIELD_BY_TIER: Record<DemoAccountTier, 'fullName' | 'birthDate' | 'phone'> = {
  free: 'fullName',
  paid: 'birthDate',
  clinic: 'phone',
};

const ERROR_GETTER_BY_FIELD = {
  fullName: () => patientQuickCreatePage.fullNameError,
  birthDate: () => patientQuickCreatePage.birthDateError,
  phone: () => patientQuickCreatePage.phoneError,
};

describe('Patient creation', () => {
  for (const tier of tiers) {
    describe(`${tier} tier`, () => {
      beforeEach(async () => {
        const account = demoAccounts[tier];
        await loginPage.login(account.email, account.password);
        await patientsPage.open();
      });

      it(`${tier} tier: creates a patient with only the required fields`, async () => {
        await patientsPage.openCreateModal();
        await patientQuickCreatePage.submit(uniquePatientData());

        await patientDetailPage.waitForPatientCreated();
        await expect(patientDetailPage.folio).toBeDisplayed();
      });

      it(`${tier} tier: rejects patient creation missing a required field`, async () => {
        const missingField = MISSING_FIELD_BY_TIER[tier];
        const patientData = uniquePatientData();
        const { [missingField]: _omitted, ...partialData } = patientData;

        await patientsPage.openCreateModal();
        await patientQuickCreatePage.submit(partialData);

        await expect(ERROR_GETTER_BY_FIELD[missingField]()).toBeDisplayed();
        await expect(patientDetailPage.folio).not.toExist();
      });
    });
  }
});
