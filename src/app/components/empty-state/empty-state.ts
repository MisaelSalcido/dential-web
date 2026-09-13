import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  host: { class: 'contents' },
  styleUrl: './empty-state.css',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  title = input.required<string>();
  description = input.required<string>();
  hint = input<string | null>(null);
}
