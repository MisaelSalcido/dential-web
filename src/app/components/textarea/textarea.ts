import { Component, computed, input, model } from '@angular/core';
import { getFormFieldClasses } from '../../utils/form-field-classes.util';

export type TextareaResize = 'none' | 'vertical';

let nextId = 0;

const RESIZE_CLASSES: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
};

@Component({
  selector: 'app-textarea',
  host: { class: 'contents' },
  templateUrl: './textarea.html',
  styleUrl: './textarea.css',
})
export class Textarea {
  label = input.required<string>();
  hideLabel = input<boolean>(false);
  value = model<string>('');
  placeholder = input<string>('');
  helperText = input<string | null>(null);
  errorText = input<string | null>(null);
  warning = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  rows = input<number>(4);
  resize = input<TextareaResize>('vertical');

  protected fieldId = `textarea-${nextId++}`;
  protected descriptionId = `${this.fieldId}-description`;

  protected hasError = computed(() => !!this.errorText());
  protected description = computed(() => this.errorText() ?? this.helperText());
  protected descriptionColorClass = computed(() => (this.hasError() ? 'text-danger-text' : 'text-ink-muted'));

  protected fieldClasses = computed(() =>
    [
      getFormFieldClasses({ hasError: this.hasError(), warning: this.warning() }),
      'px-3.5 py-2.5 leading-relaxed',
      RESIZE_CLASSES[this.resize()],
    ].join(' '),
  );

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}
