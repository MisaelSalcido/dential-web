import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chip } from './chip';

describe('Chip', () => {
  let fixture: ComponentFixture<Chip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chip],
    }).compileComponents();

    fixture = TestBed.createComponent(Chip);
  });

  function nativeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('should create', () => {
    fixture.componentRef.setInput('label', 'Penicilina');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the label', () => {
    fixture.componentRef.setInput('label', 'Penicilina');
    fixture.detectChanges();
    expect(nativeButton().textContent?.trim()).toBe('Penicilina');
  });

  it('should emit the label when clicked', () => {
    fixture.componentRef.setInput('label', 'Látex');
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.selected.subscribe((value) => (emitted = value));

    nativeButton().click();

    expect(emitted).toBe('Látex');
  });

  it('should respect disabled', () => {
    fixture.componentRef.setInput('label', 'Ninguna conocida');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(nativeButton().disabled).toBe(true);
  });

  it('should not emit when disabled and clicked', () => {
    fixture.componentRef.setInput('label', 'Ninguna conocida');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.selected.subscribe((value) => (emitted = value));

    nativeButton().click();

    expect(emitted).toBeUndefined();
  });
});
