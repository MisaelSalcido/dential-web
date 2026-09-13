import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

@Component({
  selector: 'app-empty-state-host',
  imports: [EmptyState],
  template: `
    <app-empty-state title="Sin citas para hoy" description="Aún no hay una agenda conectada." [hint]="hint()">
      <svg icon><circle cx="1" cy="1" r="1" /></svg>
    </app-empty-state>
  `,
})
class EmptyStateHost {
  hint = signal<string | null>(null);
}

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyStateHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateHost],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title, description, and projected icon', () => {
    expect(fixture.nativeElement.textContent).toContain('Sin citas para hoy');
    expect(fixture.nativeElement.textContent).toContain('Aún no hay una agenda conectada.');
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });

  it('should not render a hint line when hint is not provided', () => {
    const paragraphs = fixture.nativeElement.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);
  });

  it('should render an optional hint line when provided', () => {
    fixture.componentInstance.hint.set('Disponible próximamente');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Disponible próximamente');
  });
});
