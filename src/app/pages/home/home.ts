import { Component, computed, inject } from '@angular/core';
import { Card } from '../../components/card/card';
import { Topbar } from '../../components/topbar/topbar';
import { Role } from '../../models/auth-user.model';
import { AuthService } from '../../services/local/auth.service';

const ROLE_LABELS: Record<Role, string> = {
  PLATFORM_ADMIN: 'Administrador de la plataforma',
  ADMIN: 'Administrador',
  DENTIST: 'Odontólogo/a',
  ASSISTANT: 'Asistente',
};

@Component({
  selector: 'app-home',
  imports: [Card, Topbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(AuthService);

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
}
