import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  host: { class: 'contents' },
  styleUrl: './nav-item.css',
  template: `
    <a
      [href]="href()"
      class="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm"
      [class]="classes()"
      [attr.aria-current]="active() ? 'page' : null"
      [attr.aria-disabled]="locked() ? 'true' : null"
    >
      <ng-content select="[icon]" />
      <span class="flex-1 truncate">{{ label() }}</span>
      @if (locked()) {
        <svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.8" />
        </svg>
      }
    </a>
  `,
})
export class NavItem {
  label = input.required<string>();
  active = input<boolean>(false);
  locked = input<boolean>(false);
  href = input<string>('#');

  protected classes = computed(() => {
    if (this.locked()) {
      return 'text-ink-subtle cursor-not-allowed pointer-events-none';
    }
    if (this.active()) {
      return 'bg-primary-tint text-primary-strong font-medium';
    }
    return 'text-ink-muted hover:bg-surface-muted hover:text-ink';
  });
}
