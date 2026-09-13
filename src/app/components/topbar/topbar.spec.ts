import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { Topbar } from './topbar';

@Component({
  selector: 'app-topbar-host',
  imports: [Topbar],
  template: `
    <app-topbar userName="Dra. Ana López" userSubtitle="Odontóloga general" userInitials="AL" planLabel="Plan Free">
      <input topbar-search placeholder="Buscar..." />
    </app-topbar>
  `,
})
class TopbarHost {}

describe('Topbar', () => {
  let fixture: ComponentFixture<TopbarHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarHost],
      providers: [
        { provide: AuthService, useValue: { logout: vi.fn().mockResolvedValue(undefined) } },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarHost);
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

  it('should render the user menu trigger instead of a standalone logout button', () => {
    expect(fixture.nativeElement.querySelector('app-user-menu')).toBeTruthy();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some((button) => button.textContent?.includes('Cerrar sesión'))).toBe(false);
  });
});
