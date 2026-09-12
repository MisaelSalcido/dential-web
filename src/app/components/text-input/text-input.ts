import { Component, computed, input, model } from '@angular/core';
import { getFormFieldClasses } from '../../utils/form-field-classes.util';

export type TextInputType = 'text' | 'email' | 'tel' | 'search' | 'password' | 'date';

let nextId = 0;

@Component({
  selector: 'app-text-input',
  host: { class: 'contents' },
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput {
  label = input.required<string>();
  hideLabel = input<boolean>(false);
  value = model<string>('');
  type = input<TextInputType>('text');
  placeholder = input<string>('');
  helperText = input<string | null>(null);
  errorText = input<string | null>(null);
  warning = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  autocomplete = input<string | null>(null);

  protected fieldId = `text-input-${nextId++}`;
  protected descriptionId = `${this.fieldId}-description`;

  protected hasError = computed(() => !!this.errorText());
  protected description = computed(() => this.errorText() ?? this.helperText());
  protected descriptionColorClass = computed(() => (this.hasError() ? 'text-danger-text' : 'text-ink-muted'));

  protected inputClasses = computed(() =>
    [getFormFieldClasses({ hasError: this.hasError(), warning: this.warning() }), 'min-h-11 px-3.5'].join(' '),
  );

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
