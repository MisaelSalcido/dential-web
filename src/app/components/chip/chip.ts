import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chip',
  host: { class: 'contents' },
  styleUrl: './chip.css',
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-neutral-tint px-3 py-1 text-xs font-medium whitespace-nowrap text-ink-tertiary transition-colors hover:bg-primary-tint hover:text-primary-strong focus-visible:ring-4 focus-visible:ring-primary/12 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-neutral-tint disabled:hover:text-ink-tertiary"
      [disabled]="disabled()"
      (click)="selected.emit(label())"
    >
      {{ label() }}
    </button>
  `,
})
export class Chip {
  label = input.required<string>();
  disabled = input(false);

  selected = output<string>();
}
