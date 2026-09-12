import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { Topbar } from './topbar';

@Component({
  selector: 'app-topbar-host',
  imports: [Topbar],
  template: `
    <app-topbar
      userName="Dra. Ana López"
      userSubtitle="Odontóloga general"
      userInitials="AL"
      planLabel="Plan Free"
      (userMenuClicked)="clicked = true"
    >
      <input topbar-search placeholder="Buscar..." />
    </app-topbar>
  `,
})
class TopbarHost {
  clicked = false;
}

describe('Topbar', () => {
  let fixture: ComponentFixture<TopbarHost>;
  let authService: { logout: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { logout: vi.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [TopbarHost],
      providers: [{ provide: AuthService, useValue: authService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarHost);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the user name, subtitle, and plan badge', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Dra. Ana López');
    expect(text).toContain('Odontóloga general');
    expect(text).toContain('Plan Free');
  });

  it('should project the search field into the search slot', () => {
    expect(fixture.nativeElement.querySelector('input[topbar-search]')).toBeTruthy();
  });

  it('should emit userMenuClicked when the user block is clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('should log out and redirect to /login when "Cerrar sesión" is clicked', async () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const logoutButton = buttons.find((button) => button.textContent?.includes('Cerrar sesión'));
    expect(logoutButton).toBeTruthy();

    logoutButton!.click();
    await fixture.whenStable();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should still redirect to /login when the logout call fails', async () => {
    authService.logout.mockRejectedValue(new Error('network error'));

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const logoutButton = buttons.find((button) => button.textContent?.includes('Cerrar sesión'));

    logoutButton!.click();
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
