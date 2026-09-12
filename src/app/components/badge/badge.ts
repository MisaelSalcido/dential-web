import { Component, computed, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-neutral-tint text-ink-tertiary',
  primary: 'bg-primary-tint text-primary-strong',
  success: 'bg-success-tint text-success-text',
  warning: 'bg-warning-tint text-warning-heading',
  danger: 'bg-danger-tint text-danger-text',
  secondary: 'bg-secondary-tint text-secondary-text',
};

@Component({
  selector: 'app-badge',
  host: { class: 'contents' },
  styleUrl: './badge.css',
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
      [class]="variantClasses()"
    >
      <ng-content select="[icon]" />
      <ng-content />
    </span>
  `,
})
export class Badge {
  variant = input<BadgeVariant>('neutral');

  protected variantClasses = computed(() => VARIANT_CLASSES[this.variant()]);
}
