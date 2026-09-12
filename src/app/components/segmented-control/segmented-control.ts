import { Component, ElementRef, computed, input, model, viewChildren } from '@angular/core';
import { SegmentedOption } from '../../models/segmented-option.model';

export type SegmentedControlSize = 'sm' | 'md';

const SIZE_CLASSES: Record<SegmentedControlSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
};

@Component({
  selector: 'app-segmented-control',
  host: { class: 'contents' },
  styleUrl: './segmented-control.css',
  template: `
    <div
      role="radiogroup"
      [attr.aria-label]="ariaLabel()"
      class="inline-flex rounded-md border border-line-strong overflow-hidden"
      (keydown)="onKeydown($event)"
    >
      @for (option of options(); track option.value; let i = $index) {
        <button
          #segmentBtn
          type="button"
          role="radio"
          [attr.aria-checked]="value() === option.value"
          [tabindex]="tabIndexFor(option, i)"
          [disabled]="option.disabled"
          [class]="segmentClasses(option, i)"
          (click)="select(option)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class SegmentedControl {
  options = input<SegmentedOption[]>([]);
  value = model<string | null>(null);
  size = input<SegmentedControlSize>('md');
  ariaLabel = input<string>('');

  private segmentRefs = viewChildren<ElementRef<HTMLButtonElement>>('segmentBtn');

  private firstEnabledIndex = computed(() => this.options().findIndex((o) => !o.disabled));

  protected segmentClasses(option: SegmentedOption, index: number): string {
    const selected = this.value() === option.value;
    const colorClasses = selected
      ? 'bg-primary text-white'
      : option.disabled
        ? 'bg-surface text-ink-subtle cursor-not-allowed'
        : 'bg-surface text-ink hover:bg-surface-muted';
    const separatorClasses = index > 0 ? 'border-l border-line-strong' : '';
    return [SIZE_CLASSES[this.size()], colorClasses, separatorClasses, 'font-medium'].join(' ');
  }

  protected tabIndexFor(option: SegmentedOption, index: number): number {
    const currentIndex = this.options().findIndex((o) => o.value === this.value());
    const activeIndex = currentIndex !== -1 ? currentIndex : this.firstEnabledIndex();
    return index === activeIndex ? 0 : -1;
  }

  protected select(option: SegmentedOption): void {
    if (option.disabled) {
      return;
    }
    this.value.set(option.value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const options = this.options();
    const enabledIndexes = options.reduce<number[]>((acc, o, i) => {
      if (!o.disabled) acc.push(i);
      return acc;
    }, []);
    if (enabledIndexes.length === 0) {
      return;
    }

    const currentIndex = options.findIndex((o) => o.value === this.value());
    const baseIndex = currentIndex !== -1 ? currentIndex : enabledIndexes[0];

    let targetIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        targetIndex = this.stepEnabled(baseIndex, 1, enabledIndexes, options.length);
        break;
      case 'ArrowLeft':
        targetIndex = this.stepEnabled(baseIndex, -1, enabledIndexes, options.length);
        break;
      case 'Home':
        targetIndex = enabledIndexes[0];
        break;
      case 'End':
        targetIndex = enabledIndexes[enabledIndexes.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    const option = options[targetIndex];
    this.value.set(option.value);
    this.segmentRefs()[targetIndex]?.nativeElement.focus();
  }

  private stepEnabled(current: number, direction: number, enabledIndexes: number[], total: number): number {
    let index = current;
    for (let step = 0; step < total; step++) {
      index = (index + direction + total) % total;
      if (enabledIndexes.includes(index)) {
        return index;
      }
    }
    return current;
  }
}
