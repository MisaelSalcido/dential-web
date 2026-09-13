import { Component, DestroyRef, computed, inject, viewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavItem } from '../../components/nav-item/nav-item';
import { SearchField } from '../../components/search-field/search-field';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { Role } from '../../models/auth-user.model';
import { NavLink } from '../../models/nav-link.model';
import { AuthService } from '../../services/local/auth.service';
import { HotkeyService } from '../../services/local/hotkey.service';
import { SidebarStateService } from '../../services/local/sidebar-state.service';

const ROLE_LABELS: Record<Role, string> = {
  PLATFORM_ADMIN: 'Administrador de la plataforma',
  ADMIN: 'Administrador',
  DENTIST: 'Odontólogo/a',
  ASSISTANT: 'Asistente',
};

const NAV_LINKS: NavLink[] = [
  { key: 'home', label: 'Inicio', path: '' },
  { key: 'pacientes', label: 'Pacientes', path: 'pacientes' },
  { key: 'agenda', label: 'Agenda', path: 'agenda' },
  { key: 'documentos', label: 'Documentos', path: 'documentos' },
  { key: 'ajustes', label: 'Ajustes', path: 'ajustes' },
];

const NAV_HOTKEY_COMBOS: Record<string, string> = {
  home: 'ctrl+Digit1',
  pacientes: 'ctrl+Digit2',
  agenda: 'ctrl+Digit3',
  documentos: 'ctrl+Digit4',
  ajustes: 'ctrl+Digit5',
};

@Component({
  selector: 'app-dashboard-shell',
  imports: [NavItem, RouterOutlet, SearchField, Sidebar, Topbar],
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.css',
})
export class DashboardShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly hotkeyService = inject(HotkeyService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly sidebarState = inject(SidebarStateService);

  protected readonly navLinks = NAV_LINKS;
  protected readonly user = this.authService.currentUser;

  private readonly searchField = viewChild(SearchField);

  constructor() {
    for (const link of NAV_LINKS) {
      const unregister = this.hotkeyService.register(NAV_HOTKEY_COMBOS[link.key], () =>
        this.router.navigate([this.navLinkPath(link)]),
      );
      this.destroyRef.onDestroy(unregister);
    }

    const unregisterSearchFocus = this.hotkeyService.register('ctrl+Space', () =>
      this.searchField()?.focusInput(),
    );
    this.destroyRef.onDestroy(unregisterSearchFocus);
  }

  protected readonly userInitials = computed(() => {
    const name = this.user()?.fullName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });

  protected readonly roleLabel = computed(() => {
    const role = this.user()?.role;
    return role ? ROLE_LABELS[role] : null;
  });

  protected readonly planLabel = computed(() => {
    const plan = this.user()?.tenant?.subscriptionPlan;
    return plan ? `Plan ${plan}` : null;
  });

  protected navLinkPath(link: NavLink): string {
    return `/${link.path}`;
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    this.hotkeyService.handleKeydownEvent(event);
  }
}
