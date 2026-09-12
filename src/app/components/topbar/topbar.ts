import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from '../avatar/avatar';
import { Badge } from '../badge/badge';
import { AuthService } from '../../services/local/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [Avatar, Badge],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userName = input<string>('');
  userSubtitle = input<string | null>(null);
  userInitials = input<string>('');
  planLabel = input<string | null>(null);
  userMenuClicked = output<void>();

  protected async handleLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch {
      // AuthService already cleared local session state regardless; navigate away either way.
    } finally {
      await this.router.navigateByUrl('/login');
    }
  }
}
