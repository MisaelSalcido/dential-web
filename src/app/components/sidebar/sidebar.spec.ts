import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-sidebar-host',
  imports: [Sidebar],
  template: `
    <app-sidebar>
      <span sidebar-logo>Dential</span>
      <a sidebar-nav href="#">Pacientes</a>
      <button sidebar-footer type="button">Ver planes</button>
    </app-sidebar>
  `,
})
class SidebarHost {}

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
});
