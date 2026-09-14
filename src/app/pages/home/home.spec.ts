import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let router: Router;
  let patientCreateModalService: PatientCreateModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    router = TestBed.inject(Router);
    patientCreateModalService = TestBed.inject(PatientCreateModalService);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the today\'s-appointments empty state', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sin citas para hoy');
  });

  it('should show acciones rápidas with a new-patient and a search-patient action', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some((button) => button.textContent?.includes('Nuevo paciente'))).toBe(true);
    expect(buttons.some((button) => button.textContent?.includes('Buscar paciente'))).toBe(true);
  });

  it('should open the patient create modal when "Nuevo paciente" is clicked, without navigating', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const newPatientButton = buttons.find((button) => button.textContent?.includes('Nuevo paciente'));

    newPatientButton!.click();

    expect(patientCreateModalService.isOpen()).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to /pacientes when "Buscar paciente" is clicked', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const searchPatientButton = buttons.find((button) => button.textContent?.includes('Buscar paciente'));

    searchPatientButton!.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes');
  });

  it('should show the notas-pendientes empty state', () => {
    expect(fixture.nativeElement.textContent).toContain('Sin notas pendientes');
  });

  it('should show the radiografías-y-fotos empty state with no paid-plan lock wording', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sin radiografías ni fotos');
    expect(text).not.toContain('plan de pago');
  });

  it('should render all three empty-state messages with distinct wording', () => {
    const text = fixture.nativeElement.textContent;
    const titles = ['Sin citas para hoy', 'Sin notas pendientes', 'Sin radiografías ni fotos'];
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) {
      expect(text).toContain(title);
    }
  });
});
