import { Component, computed, input } from '@angular/core';

export type DotVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
export type DotSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<DotVariant, string> = {
  neutral: 'bg-ink-subtle',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  secondary: 'bg-secondary',
};

const SIZE_CLASSES: Record<DotSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

@Component({
  selector: 'app-dot',
  host: { class: 'contents' },
  styleUrl: './dot.css',
  template: `<span class="inline-block rounded-full" [class]="classes()" aria-hidden="true"></span>`,
})
export class Dot {
  variant = input<DotVariant>('primary');
  size = input<DotSize>('sm');
  pulse = input<boolean>(false);

  protected classes = computed(() =>
    [VARIANT_CLASSES[this.variant()], SIZE_CLASSES[this.size()], this.pulse() ? 'animate-pulse' : ''].join(' '),
  );
}
