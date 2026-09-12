import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';

describe('Tabs', () => {
  let fixture: ComponentFixture<Tabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs);
    fixture.componentRef.setInput('tabs', [
      { id: 'historia', label: 'Historia clínica' },
      { id: 'odontograma', label: 'Odontograma' },
      { id: 'consentimientos', label: 'Consentimientos', locked: true },
    ]);
  });

  function tabButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one tab per item', () => {
    fixture.detectChanges();
    expect(tabButtons().length).toBe(3);
  });

  it('should mark the active tab as aria-selected', () => {
    fixture.componentRef.setInput('activeTab', 'odontograma');
    fixture.detectChanges();
    expect(tabButtons()[1].getAttribute('aria-selected')).toBe('true');
    expect(tabButtons()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('should disable locked tabs and not activate them on click', () => {
    fixture.componentRef.setInput('activeTab', 'historia');
    fixture.detectChanges();
    expect(tabButtons()[2].disabled).toBe(true);
    tabButtons()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('historia');
  });

  it('should select a tab on click', () => {
    fixture.detectChanges();
    tabButtons()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('odontograma');
  });

  it('should skip locked tabs when navigating with ArrowRight', () => {
    fixture.componentRef.setInput('activeTab', 'odontograma');
    fixture.detectChanges();
    tabButtons()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab()).toBe('historia');
  });
});
