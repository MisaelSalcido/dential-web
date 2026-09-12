import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarHost],
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

  it('should emit userMenuClicked when the user block is clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.clicked).toBe(true);
  });
});
