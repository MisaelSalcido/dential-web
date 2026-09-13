import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-sidebar-host',
  imports: [Sidebar],
  template: `
    <app-sidebar [collapsed]="collapsed()" (toggled)="toggleCount = toggleCount + 1">
      <span sidebar-logo>Dential</span>
      <a sidebar-nav href="#">Pacientes</a>
      <button sidebar-footer type="button">Ver planes</button>
    </app-sidebar>
  `,
})
class SidebarHost {
  collapsed = signal(false);
  toggleCount = 0;
}

describe('Sidebar', () => {
  let fixture: ComponentFixture<SidebarHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarHost],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should project logo, nav, and footer content into their slots', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Dential');
    expect(text).toContain('Pacientes');
    expect(text).toContain('Ver planes');
  });

  it('should wrap projected nav content in a nav landmark', () => {
    expect(fixture.nativeElement.querySelector('nav a')).toBeTruthy();
  });

  it('should render expanded width by default', () => {
    const root: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(root.className).toContain('w-[232px]');
  });

  it('should switch to a compact width when collapsed', () => {
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(root.className).toContain('w-[72px]');
  });

  it('should emit toggled when the collapse control is clicked', () => {
    const toggleButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label]');
    toggleButton.click();
    expect(fixture.componentInstance.toggleCount).toBe(1);
  });
});
