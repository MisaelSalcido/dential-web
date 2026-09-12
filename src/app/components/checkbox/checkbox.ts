import { Component, ElementRef, effect, input, model, viewChild } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  host: { class: 'contents' },
  styleUrl: './checkbox.css',
  template: `
    <label class="inline-flex items-center gap-2" [class]="disabled() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'">
      <span class="relative inline-flex size-4 shrink-0">
        <input
          #inputEl
          type="checkbox"
          class="peer absolute inset-0 z-10 size-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          [checked]="checked()"
          [disabled]="disabled()"
          (change)="onChange($event)"
        />
        <span
          class="pointer-events-none absolute inset-0 rounded-sm border border-line-muted bg-surface peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/12"
        ></span>
        <svg
          class="pointer-events-none absolute inset-0 hidden size-4 p-0.5 text-white peer-checked:block"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      @if (label()) {
        <span class="text-sm text-ink">{{ label() }}</span>
      }
    </label>
  `,
})
export class Checkbox {
  checked = model<boolean>(false);
  label = input<string>('');
  disabled = input<boolean>(false);
  indeterminate = input<boolean>(false);

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  constructor() {
    effect(() => {
      const el = this.inputRef()?.nativeElement;
      if (el) {
        el.indeterminate = this.indeterminate();
      }
    });
  }

  protected onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
