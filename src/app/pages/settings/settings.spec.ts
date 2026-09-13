import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';

describe('Settings', () => {
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Ajustes heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Ajustes');
  });
});
