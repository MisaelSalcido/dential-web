import { Component, computed, input } from '@angular/core';

export type CardVariant = 'default' | 'dashed' | 'warning' | 'info';
export type CardPadding = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-surface border border-line rounded-lg shadow-card',
  dashed: 'bg-surface-muted border border-dashed border-line-muted rounded-lg',
  warning: 'bg-warning-tint border border-warning-border rounded-lg',
  info: 'bg-primary-tint border border-primary/40 rounded-lg',
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

@Component({
  selector: 'app-card',
  host: { class: 'contents' },
  styleUrl: './card.css',
  template: `
    <div [class]="classes()" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
})
export class Card {
  variant = input<CardVariant>('default');
  padding = input<CardPadding>('md');
  ariaLabel = input<string | null>(null);

  protected classes = computed(() =>
    [VARIANT_CLASSES[this.variant()], PADDING_CLASSES[this.padding()]].join(' '),
  );
}
