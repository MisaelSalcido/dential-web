import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchField } from './search-field';

describe('SearchField', () => {
  let fixture: ComponentFixture<SearchField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchField],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchField);
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function container(): HTMLDivElement {
    return fixture.nativeElement.querySelectorAll('div')[1];
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should update the value model on input', () => {
    fixture.detectChanges();
    nativeInput().value = 'Ana';
    nativeInput().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Ana');
  });

  it('should apply focused styles while the input has focus', () => {
    fixture.detectChanges();
    nativeInput().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(container().className).toContain('ring-primary/12');

    nativeInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(container().className).not.toContain('ring-primary/12');
  });

  it('should render the keyboard hint by default', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('⌘K');
  });
});
