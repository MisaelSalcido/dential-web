import { Component, input, model } from '@angular/core';

let nextId = 0;

/**
 * Shared disclosure shell for the quick-create form's "Más detalles" and each Historia Clínica
 * NOM-004 section (FR-016: "each independently collapsible") — not called out by name in
 * tasks.md, but both consumers need the identical toggle/aria-expanded behavior.
 */
@Component({
  selector: 'app-collapsible-section',
  host: { class: 'block' },
  styleUrl: './collapsible-section.css',
  template: `
    <div class="rounded-lg border border-line">
      <button
        type="button"
        [id]="headerId"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="panelId"
        class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        (click)="toggle()"
      >
        <span class="flex items-center gap-2 font-heading text-sm font-medium text-ink">
          {{ title() }}
          <ng-content select="[badge]" />
        </span>
        <svg
          class="size-4 shrink-0 text-ink-muted transition-transform"
          [class.rotate-180]="expanded()"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      @if (expanded()) {
        <div [id]="panelId" role="region" [attr.aria-labelledby]="headerId" class="border-t border-line p-4">
          <ng-content />
        </div>
      }
    </div>
  `,
})
export class CollapsibleSection {
  title = input.required<string>();
  expanded = model<boolean>(false);

  protected readonly headerId = `collapsible-header-${nextId++}`;
  protected readonly panelId = `${this.headerId}-panel`;

  protected toggle(): void {
    this.expanded.update((value) => !value);
  }
}
