import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from '../avatar/avatar';
import { AuthService } from '../../services/local/auth.service';

@Component({
  selector: 'app-user-menu',
  host: { class: 'contents', '(document:click)': 'onDocumentClick($event)' },
  imports: [Avatar],
  styleUrl: './user-menu.css',
  template: `
    <div class="relative">
      <button
        #triggerButton
        type="button"
        class="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-md p-1 hover:bg-surface-muted"
        aria-haspopup="menu"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="'Menú de cuenta de ' + userName()"
        (click)="toggle()"
        data-testid="user-menu-trigger"
      >
        <app-avatar [initials]="userInitials()" size="sm" [ariaLabel]="userName()" />
        <span class="hidden text-left sm:block">
          <span class="block text-sm font-medium text-ink">{{ userName() }}</span>
          @if (userSubtitle()) {
            <span class="block text-xs text-ink-muted">{{ userSubtitle() }}</span>
          }
        </span>
      </button>

      @if (open()) {
        <div
          role="menu"
          class="absolute right-0 top-full z-10 mt-2 w-48 rounded-md border border-line bg-surface py-1 shadow-card"
          (keydown.escape)="closeAndFocusTrigger()"
        >
          <button
            type="button"
            role="menuitem"
            class="block w-full cursor-pointer px-3 py-2 text-left text-sm text-ink-muted hover:bg-surface-muted hover:text-ink"
            (click)="handleLogout()"
            data-testid="user-menu-logout"
          >
            Cerrar sesión
          </button>
        </div>
      }
    </div>
  `,
})
export class UserMenu {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');

  userName = input<string>('');
  userSubtitle = input<string | null>(null);
  userInitials = input<string>('');

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected closeAndFocusTrigger(): void {
    this.close();
    this.triggerButton()?.nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected async handleLogout(): Promise<void> {
    this.close();
    try {
      await this.authService.logout();
    } catch {
      // AuthService already cleared local session state regardless; navigate away either way.
    } finally {
      await this.router.navigateByUrl('/login');
    }
  }
}
