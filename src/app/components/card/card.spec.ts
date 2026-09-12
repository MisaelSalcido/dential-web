import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

describe('Card', () => {
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
  });

  function nativeDiv(): HTMLDivElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply default variant classes', () => {
    fixture.detectChanges();
    expect(nativeDiv().className).toContain('shadow-card');
  });

  it('should apply dashed variant classes', () => {
    fixture.componentRef.setInput('variant', 'dashed');
    fixture.detectChanges();
    expect(nativeDiv().className).toContain('border-dashed');
  });
});
