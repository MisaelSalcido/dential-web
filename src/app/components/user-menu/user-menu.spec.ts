import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { UserMenu } from './user-menu';

@Component({
  selector: 'app-user-menu-host',
  imports: [UserMenu],
  template: `
    <app-user-menu userName="Dra. Ana López" userSubtitle="Odontóloga general" userInitials="AL" />
    <button type="button">Fuera del menú</button>
  `,
})
class UserMenuHost {}

describe('UserMenu', () => {
  let fixture: ComponentFixture<UserMenuHost>;
  let authService: { logout: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { logout: vi.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [UserMenuHost],
      providers: [{ provide: AuthService, useValue: authService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuHost);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  function triggerButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[aria-haspopup="menu"]');
  }

  function menuLogoutButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button[role="menuitem"]');
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the user name and subtitle, and not show the menu initially', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Dra. Ana López');
    expect(text).toContain('Odontóloga general');
    expect(triggerButton().getAttribute('aria-expanded')).toBe('false');
    expect(menuLogoutButton()).toBeNull();
  });

  it('should open the menu when the trigger is clicked', () => {
    triggerButton().click();
    fixture.detectChanges();

    expect(triggerButton().getAttribute('aria-expanded')).toBe('true');
    expect(menuLogoutButton()?.textContent).toContain('Cerrar sesión');
  });

  it('should close the menu when the trigger is clicked again', () => {
    triggerButton().click();
    fixture.detectChanges();
    triggerButton().click();
    fixture.detectChanges();

    expect(menuLogoutButton()).toBeNull();
  });

  it('should close the menu when clicking outside of it', () => {
    triggerButton().click();
    fixture.detectChanges();

    const outsideButton: HTMLButtonElement = fixture.nativeElement.querySelector('button:not([aria-haspopup])');
    outsideButton.click();
    fixture.detectChanges();

    expect(menuLogoutButton()).toBeNull();
  });

  it('should close the menu when Escape is pressed', () => {
    triggerButton().click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[role="menu"]');
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(menuLogoutButton()).toBeNull();
  });

  it('should log out and redirect to /login when "Cerrar sesión" is clicked', async () => {
    triggerButton().click();
    fixture.detectChanges();

    menuLogoutButton()!.click();
    await fixture.whenStable();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should still redirect to /login when the logout call fails', async () => {
    authService.logout.mockRejectedValue(new Error('network error'));

    triggerButton().click();
    fixture.detectChanges();

    menuLogoutButton()!.click();
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
