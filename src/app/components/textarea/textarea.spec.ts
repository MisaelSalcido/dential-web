import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Textarea } from './textarea';

describe('Textarea', () => {
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea],
    }).compileComponents();

    fixture = TestBed.createComponent(Textarea);
    fixture.componentRef.setInput('label', 'Notas');
  });

  function nativeTextarea(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should update the value model on input', () => {
    fixture.detectChanges();
    nativeTextarea().value = 'Sin dolor';
    nativeTextarea().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Sin dolor');
  });

  it('should apply error classes when errorText is set', () => {
    fixture.componentRef.setInput('errorText', 'Requerido');
    fixture.detectChanges();
    expect(nativeTextarea().className).toContain('border-danger');
  });

  it('should apply the requested resize class', () => {
    fixture.componentRef.setInput('resize', 'none');
    fixture.detectChanges();
    expect(nativeTextarea().className).toContain('resize-none');
  });
});
