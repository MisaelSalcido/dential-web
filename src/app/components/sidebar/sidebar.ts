import { Component, input, output } from '@angular/core';

/**
 * Pure layout shell — no navigation data or routing knowledge. Consumers project
 * their own logo, nav items, and footer content into the named slots.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  collapsed = input<boolean>(false);
  toggled = output<void>();
}
