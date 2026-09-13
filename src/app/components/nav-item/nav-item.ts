import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  host: { class: 'contents' },
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './nav-item.css',
  template: `
    <a
      [routerLink]="routerLink()"
      routerLinkActive
      #rla="routerLinkActive"
      [routerLinkActiveOptions]="{ exact: exact() }"
      class="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm"
      [class]="classes(rla.isActive)"
      [attr.aria-current]="rla.isActive ? 'page' : null"
      [attr.aria-disabled]="locked() ? 'true' : null"
      [attr.aria-label]="collapsed() ? label() : null"
      [attr.title]="collapsed() ? label() : null"
    >
      <ng-content select="[icon]" />
      @if (!collapsed()) {
        <span class="flex-1 truncate">{{ label() }}</span>
      }
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
  routerLink = input<string>('');
  exact = input<boolean>(false);
  locked = input<boolean>(false);
  collapsed = input<boolean>(false);

  protected classes(isActive: boolean): string {
    if (this.locked()) {
      return 'text-ink-subtle cursor-not-allowed pointer-events-none';
    }
    if (isActive) {
      return 'bg-primary-tint text-primary-strong font-medium';
    }
    return 'text-ink-muted hover:bg-surface-muted hover:text-ink';
  }
}
