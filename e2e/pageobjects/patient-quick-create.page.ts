import { $ } from '@wdio/globals';
import { QuickCreatePatientData } from '../fixtures/patient-data';

/**
 * A native `<input type="date">` interprets typed keystrokes per locale-dependent segment
 * (month/day/year), so sending an ISO string via setValue's keystroke simulation garbles the
 * result. Setting `.value` (always ISO `YYYY-MM-DD` regardless of display locale) directly and
 * dispatching `input` — the event TextInput's `onInput()` listens for — is the reliable way to
 * drive this field.
 */
async function setDateValue(selector: string, isoDate: string): Promise<void> {
  await browser.execute(
    (sel, value) => {
      const input = document.querySelector(sel) as HTMLInputElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      nativeSetter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    },
    selector,
    isoDate,
  );
}

class PatientQuickCreatePage {
  get fullNameInput() {
    return $('[data-testid="quick-create-full-name"]');
  }

  get fullNameError() {
    return $('[data-testid="quick-create-full-name-error"]');
  }

  get birthDateInput() {
    return $('[data-testid="quick-create-birth-date"]');
  }

  get birthDateError() {
    return $('[data-testid="quick-create-birth-date-error"]');
  }

  get phoneInput() {
    return $('[data-testid="quick-create-phone"]');
  }

  get phoneError() {
    return $('[data-testid="quick-create-phone-error"]');
  }

  get submitButton() {
    return $('[data-testid="quick-create-submit"]');
  }

  get serverError() {
    return $('[data-testid="quick-create-server-error"]');
  }

  get duplicateMatchAlert() {
    return $('[data-testid="quick-create-duplicate-match"]');
  }

  get duplicateCreateAnywayButton() {
    return $('[data-testid="quick-create-duplicate-create-anyway"]');
  }

  /**
   * Fills every field in the given partial payload, leaving unset fields blank, then submits —
   * lets the success-path scenarios pass a full payload and the expected-error scenarios omit one
   * required field at a time. After submitting, dismisses spec 004's fuzzy possible-duplicate
   * warning if it appears: a demo tenant accumulates prior E2E-created patients over repeated
   * runs, so a run-unique name can occasionally still resemble one closely enough to trigger that
   * heuristic even though it isn't a real duplicate — the same "crear de todos modos" affordance a
   * real user has for this is the robust way through it, rather than trying to statistically rule
   * out the resemblance in the generated test data.
   */
  async submit(patientData: Partial<QuickCreatePatientData>): Promise<void> {
    if (patientData.fullName !== undefined) {
      await this.fullNameInput.setValue(patientData.fullName);
    }
    if (patientData.birthDate !== undefined) {
      await setDateValue('[data-testid="quick-create-birth-date"]', patientData.birthDate);
    }
    if (patientData.phone !== undefined) {
      await this.phoneInput.setValue(patientData.phone);
    }
    await this.submitButton.click();

    if (await this.duplicateMatchAlert.waitForDisplayed({ timeout: 1500, timeoutMsg: '' }).catch(() => false)) {
      await this.duplicateCreateAnywayButton.click();
    }
  }
}

export default new PatientQuickCreatePage();
