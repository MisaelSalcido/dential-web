import { Component, computed, input } from '@angular/core';

export type ProgressBarVariant = 'primary' | 'success';
export type ProgressBarSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
};

const TRACK_SIZE_CLASSES: Record<ProgressBarSize, string> = {
  sm: 'h-[5px]',
  md: 'h-2',
};

@Component({
  selector: 'app-progress-bar',
  host: { class: 'contents' },
  styleUrl: './progress-bar.css',
  template: `
    <div
      role="progressbar"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max()"
      class="w-full overflow-hidden rounded-full bg-progress-track"
      [class]="trackClasses()"
    >
      <div class="h-full rounded-full" [class]="barVariantClasses()" [style.width.%]="percentage()"></div>
    </div>
  `,
})
export class ProgressBar {
  value = input<number>(0);
  max = input<number>(100);
  variant = input<ProgressBarVariant>('primary');
  size = input<ProgressBarSize>('sm');

  protected percentage = computed(() => {
    const max = this.max() || 1;
    return Math.min(100, Math.max(0, (this.value() / max) * 100));
  });

  protected trackClasses = computed(() => TRACK_SIZE_CLASSES[this.size()]);
  protected barVariantClasses = computed(() => VARIANT_CLASSES[this.variant()]);
}
