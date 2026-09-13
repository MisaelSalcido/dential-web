import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Patients } from './patients';

describe('Patients', () => {
  let fixture: ComponentFixture<Patients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Patients],
    }).compileComponents();

    fixture = TestBed.createComponent(Patients);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Pacientes heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Pacientes');
  });
});
