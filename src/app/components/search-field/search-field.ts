import { Component, ElementRef, computed, input, model, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-search-field',
  host: { class: 'contents' },
  templateUrl: './search-field.html',
  styleUrl: './search-field.css',
})
export class SearchField {
  value = model<string>('');
  placeholder = input<string>('Buscar...');
  kbdHint = input<string | null>('⌘K');
  ariaLabel = input<string>('Buscar');

  private readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private focused = signal(false);

  focusInput(): void {
    this.inputRef().nativeElement.focus();
  }

  protected containerClasses = computed(() =>
    this.focused()
      ? 'border-primary bg-surface ring-4 ring-primary/12'
      : 'border-line-strong bg-surface-muted',
  );

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
  }
}
