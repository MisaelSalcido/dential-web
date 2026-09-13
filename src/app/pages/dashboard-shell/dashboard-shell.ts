import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../components/nav-item/nav-item';
import { SearchField } from '../../components/search-field/search-field';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { Role } from '../../models/auth-user.model';
import { NavLink } from '../../models/nav-link.model';
import { AuthService } from '../../services/local/auth.service';
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

@Component({
  selector: 'app-dashboard-shell',
  imports: [NavItem, RouterOutlet, SearchField, Sidebar, Topbar],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.css',
})
export class DashboardShell {
  private readonly authService = inject(AuthService);
  protected readonly sidebarState = inject(SidebarStateService);

  protected readonly navLinks = NAV_LINKS;
  protected readonly user = this.authService.currentUser;

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
}
