import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';
import { PatientSearchResults } from './patient-search-results';

function sampleResult(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'p1',
    fullName: 'Jorge Aguilar Ortiz',
    folio: '000001',
    phone: '5544218890',
    edad: 38,
    hasAllergies: false,
    lastVisitAt: null,
    ...overrides,
  };
}

describe('PatientSearchResults', () => {
  let fixture: ComponentFixture<PatientSearchResults>;
  let modalService: PatientCreateModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSearchResults],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientSearchResults);
    modalService = TestBed.inject(PatientCreateModalService);
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render each result with name, folio, and phone', () => {
    fixture.componentRef.setInput('results', [sampleResult()]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Jorge Aguilar Ortiz');
    expect(fixture.nativeElement.textContent).toContain('000001');
    expect(fixture.nativeElement.textContent).toContain('5544218890');
  });

  it('should show an allergy badge when the result has allergies', () => {
    fixture.componentRef.setInput('results', [sampleResult({ hasAllergies: true })]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Alergias');
  });

  it('should emit resultSelected when a result is clicked', () => {
    fixture.componentRef.setInput('results', [sampleResult()]);
    fixture.detectChanges();

    const emitted = vi.fn();
    fixture.componentInstance.resultSelected.subscribe(emitted);
    (fixture.nativeElement.querySelector('a') as HTMLAnchorElement).click();

    expect(emitted).toHaveBeenCalled();
  });

  it('should show "sin coincidencias" and open the create modal with the query when there are no results', () => {
    fixture.componentRef.setInput('results', []);
    fixture.componentRef.setInput('query', 'Nueva Persona');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sin coincidencias');
    const openSpy = vi.spyOn(modalService, 'open');

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(openSpy).toHaveBeenCalledWith('Nueva Persona');
  });
});
