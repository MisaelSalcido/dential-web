import { Component, input } from '@angular/core';
import { Badge } from '../badge/badge';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-topbar',
  imports: [Badge, UserMenu],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  userName = input<string>('');
  userSubtitle = input<string | null>(null);
  userInitials = input<string>('');
  planLabel = input<string | null>(null);
}
