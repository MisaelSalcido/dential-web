import { Component, input, model } from '@angular/core';
import { RadioOption } from '../../models/radio-option.model';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

let nextGroupId = 0;

@Component({
  selector: 'app-radio-group',
  host: { class: 'contents' },
  styleUrl: './radio-group.css',
  template: `
    <div role="radiogroup" [attr.aria-labelledby]="groupLabel() ? groupLabelId : null">
      @if (groupLabel()) {
        <p [id]="groupLabelId" class="mb-2 text-xs font-medium text-ink-muted">{{ groupLabel() }}</p>
      }
      <div [class]="orientation() === 'horizontal' ? 'flex flex-row flex-wrap gap-3' : 'flex flex-col gap-2'">
        @for (option of options(); track option.value) {
          <label
            class="flex items-center gap-2.5 rounded-md border p-2.5"
            [class]="rowClasses(option)"
          >
            <span
              class="inline-flex size-4 shrink-0 rounded-full"
              [class]="dotClasses(option)"
              aria-hidden="true"
            ></span>
            <input
              type="radio"
              class="sr-only"
              [name]="groupName()"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="option.disabled"
              (change)="onChange(option.value)"
            />
            <span class="text-sm text-ink">{{ option.label }}</span>
          </label>
        }
      </div>
    </div>
  `,
})
export class RadioGroup {
  options = input<RadioOption[]>([]);
  value = model<string | null>(null);
  name = input<string>(`radio-group-${nextGroupId++}`);
  groupLabel = input<string | null>(null);
  orientation = input<RadioGroupOrientation>('vertical');

  protected groupName = this.name;
  protected groupLabelId = `radio-group-label-${nextGroupId}`;

  protected rowClasses(option: RadioOption): string {
    const disabledClasses = option.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer';
    const selectedClasses =
      this.value() === option.value ? 'border-primary bg-primary-tint font-medium' : 'border-line';
    return [disabledClasses, selectedClasses].join(' ');
  }

  protected dotClasses(option: RadioOption): string {
    return this.value() === option.value
      ? 'border-[5px] border-primary bg-surface'
      : 'border-[1.5px] border-line-muted bg-surface';
  }

  protected onChange(value: string): void {
    this.value.set(value);
  }
}
