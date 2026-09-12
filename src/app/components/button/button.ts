import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'primary-soft' | 'secondary' | 'ghost' | 'locked';
export type ButtonSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-base gap-2',
  lg: 'min-h-12 px-5 text-base gap-2',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-strong',
  'primary-soft': 'border border-primary bg-primary-tint text-primary-strong hover:bg-primary/10',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-surface-muted',
  ghost: 'text-primary hover:bg-primary-tint',
  locked: 'border border-dashed border-line-muted bg-surface-muted text-ink-muted cursor-not-allowed',
};

/**
 * Host uses `display: contents` so `<app-button>` never affects flex/grid layout
 * and native click events bubble through it untouched. Because of that, spacing
 * utilities (margin) applied directly on `<app-button>` have no effect — wrap it
 * in a container element instead when spacing is needed.
 */
@Component({
  selector: 'app-button',
  host: { class: 'contents' },
  styleUrl: './button.css',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading() || variant() === 'locked'"
      [attr.aria-busy]="loading() || null"
      [class]="classes()"
    >
      @if (loading()) {
        <svg
          class="size-4 shrink-0 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      } @else if (variant() === 'locked') {
        <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.8" />
        </svg>
      } @else {
        <ng-content select="[iconStart]" />
      }
      <ng-content />
      @if (!loading() && variant() !== 'locked') {
        <ng-content select="[iconEnd]" />
      }
    </button>
  `,
})
export class Button {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  pill = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  protected classes = computed(() => {
    const shape = this.pill() ? 'rounded-full' : 'rounded-md';
    const disabledClasses =
      this.disabled() || this.loading()
        ? 'opacity-40 pointer-events-none'
        : 'cursor-pointer';
    return [
      'inline-flex items-center justify-center font-heading font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12',
      SIZE_CLASSES[this.size()],
      VARIANT_CLASSES[this.variant()],
      shape,
      disabledClasses,
    ].join(' ');
  });
}
