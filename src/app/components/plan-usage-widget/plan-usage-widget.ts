import { Component, input, output } from '@angular/core';
import { ProgressBar } from '../progress-bar/progress-bar';
import { Button } from '../button/button';

@Component({
  selector: 'app-plan-usage-widget',
  host: { class: 'contents' },
  styleUrl: './plan-usage-widget.css',
  imports: [ProgressBar, Button],
  template: `
    <div class="rounded-lg border border-line p-3.5">
      <p class="text-sm font-medium text-ink">{{ planName() }}</p>
      <app-progress-bar class="mt-2.5 block" [value]="used()" [max]="limit()" />
      @if (helperText()) {
        <p class="mt-2 text-xs text-ink-muted">{{ helperText() }}</p>
      }
      @if (ctaLabel()) {
        <div class="mt-3">
          <app-button variant="primary" size="sm" (click)="ctaClicked.emit()">
            {{ ctaLabel() }}
          </app-button>
        </div>
      }
    </div>
  `,
})
export class PlanUsageWidget {
  planName = input<string>('');
  used = input<number>(0);
  limit = input<number>(0);
  helperText = input<string | null>(null);
  ctaLabel = input<string | null>(null);
  ctaClicked = output<void>();
}
