import { Component, input, output } from '@angular/core';
import { Avatar } from '../avatar/avatar';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-topbar',
  imports: [Avatar, Badge],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  userName = input<string>('');
  userSubtitle = input<string | null>(null);
  userInitials = input<string>('');
  planLabel = input<string | null>(null);
  userMenuClicked = output<void>();
}
