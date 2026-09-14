import { $, $$ } from '@wdio/globals';

class HistoriaClinicaPage {
  get saveDraftButton() {
    return $('[data-testid="hc-save-draft"]');
  }

  get saveError() {
    return $('[data-testid="hc-save-error"]');
  }

  get finalizeButton() {
    return $('[data-testid="hc-finalize"]');
  }

  get finalizeError() {
    return $('[data-testid="hc-finalize-error"]');
  }

  get incompleteSectionList() {
    return $('[data-testid="hc-incomplete-section-list"]');
  }

  get statusBadge() {
    return $('[data-testid="hc-status-badge"]');
  }

  async saveDraft(): Promise<void> {
    await this.saveDraftButton.waitForClickable();
    await this.saveDraftButton.click();
  }

  async finalize(): Promise<void> {
    await this.finalizeButton.waitForClickable();
    await this.finalizeButton.click();
  }

  async incompleteSectionLabels(): Promise<string[]> {
    return $$('[data-testid="hc-incomplete-section-list"] li').map((item) => item.getText());
  }

  async status(): Promise<string> {
    return (await this.statusBadge.getText()).trim();
  }
}

export default new HistoriaClinicaPage();
