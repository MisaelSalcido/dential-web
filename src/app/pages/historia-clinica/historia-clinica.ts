import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FormField, form, required } from '@angular/forms/signals';
import { Alert } from '../../components/alert/alert';
import { Badge } from '../../components/badge/badge';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { Chip } from '../../components/chip/chip';
import { CollapsibleSection } from '../../components/collapsible-section/collapsible-section';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { SegmentedControl } from '../../components/segmented-control/segmented-control';
import { TextInput } from '../../components/text-input/text-input';
import { Textarea } from '../../components/textarea/textarea';
import { SegmentedOption } from '../../models/segmented-option.model';
import { HistoriaClinica as HistoriaClinicaModel, SectionKey } from '../../models/historia-clinica.model';
import { HistoriaClinicaApiService } from '../../services/api/historia-clinica-api.service';
import { PatientApiService } from '../../services/api/patient-api.service';
import { AuthService } from '../../services/local/auth.service';
import { ALERGIA_QUICK_ADD_VALUES } from '../../utils/catalogs';

const NIEGA_REFIERE_OPTIONS: SegmentedOption[] = [
  { value: 'false', label: 'Niega' },
  { value: 'true', label: 'Refiere' },
];

type PatologicoQuickAddField = 'diabetes' | 'hipertension' | 'cardiopatias';

const PATOLOGICO_QUICK_ADD_OPTIONS: { field: PatologicoQuickAddField; label: string }[] = [
  { field: 'diabetes', label: 'Diabetes' },
  { field: 'hipertension', label: 'Hipertensión' },
  { field: 'cardiopatias', label: 'Cardiopatías' },
];

const SECTION_LABELS: Record<SectionKey, string> = {
  antecedentesHeredofamiliares: 'Antecedentes heredofamiliares',
  antecedentesPersonalesPatologicos: 'Antecedentes personales patológicos',
  antecedentesNoPatologicos: 'Antecedentes personales no patológicos',
  padecimientoActual: 'Padecimiento actual',
  interrogatorioAparatosSistemas: 'Interrogatorio por aparatos y sistemas',
  exploracionFisica: 'Exploración física y signos vitales',
};

interface HistoriaClinicaFormModel {
  antecedentesHeredofamiliares: string;
  antecedentesPersonalesPatologicos: {
    alergias: string;
    diabetes: string;
    hipertension: string;
    cardiopatias: string;
    otros: string;
    tabaquismoRefiere: string;
    tabaquismoDetalle: string;
    alcoholRefiere: string;
    alcoholDetalle: string;
    sustanciasRefiere: string;
    sustanciasDetalle: string;
  };
  antecedentesNoPatologicos: string;
  padecimientoActual: {
    motivoConsulta: string;
    descripcionPadecimiento: string;
  };
  interrogatorioAparatosSistemas: string;
  exploracionFisica: {
    tensionArterialSistolica: string;
    tensionArterialDiastolica: string;
    frecuenciaCardiaca: string;
    frecuenciaRespiratoria: string;
    temperatura: string;
    pesoKg: string;
    tallaCm: string;
    cabezaCuello: string;
    atm: string;
    tejidosBlandos: string;
  };
}

function emptyFormModel(): HistoriaClinicaFormModel {
  return {
    antecedentesHeredofamiliares: '',
    antecedentesPersonalesPatologicos: {
      alergias: '',
      diabetes: '',
      hipertension: '',
      cardiopatias: '',
      otros: '',
      tabaquismoRefiere: 'false',
      tabaquismoDetalle: '',
      alcoholRefiere: 'false',
      alcoholDetalle: '',
      sustanciasRefiere: 'false',
      sustanciasDetalle: '',
    },
    antecedentesNoPatologicos: '',
    padecimientoActual: { motivoConsulta: '', descripcionPadecimiento: '' },
    interrogatorioAparatosSistemas: '',
    exploracionFisica: {
      tensionArterialSistolica: '',
      tensionArterialDiastolica: '',
      frecuenciaCardiaca: '',
      frecuenciaRespiratoria: '',
      temperatura: '',
      pesoKg: '',
      tallaCm: '',
      cabezaCuello: '',
      atm: '',
      tejidosBlandos: '',
    },
  };
}

function fromApi(hc: HistoriaClinicaModel): HistoriaClinicaFormModel {
  return {
    antecedentesHeredofamiliares: hc.antecedentesHeredofamiliares ?? '',
    antecedentesPersonalesPatologicos: {
      alergias: hc.antecedentesPersonalesPatologicos.alergias ?? '',
      diabetes: hc.antecedentesPersonalesPatologicos.diabetes ?? '',
      hipertension: hc.antecedentesPersonalesPatologicos.hipertension ?? '',
      cardiopatias: hc.antecedentesPersonalesPatologicos.cardiopatias ?? '',
      otros: hc.antecedentesPersonalesPatologicos.otros ?? '',
      tabaquismoRefiere: String(hc.antecedentesPersonalesPatologicos.tabaquismoRefiere),
      tabaquismoDetalle: hc.antecedentesPersonalesPatologicos.tabaquismoDetalle ?? '',
      alcoholRefiere: String(hc.antecedentesPersonalesPatologicos.alcoholRefiere),
      alcoholDetalle: hc.antecedentesPersonalesPatologicos.alcoholDetalle ?? '',
      sustanciasRefiere: String(hc.antecedentesPersonalesPatologicos.sustanciasRefiere),
      sustanciasDetalle: hc.antecedentesPersonalesPatologicos.sustanciasDetalle ?? '',
    },
    antecedentesNoPatologicos: hc.antecedentesNoPatologicos ?? '',
    padecimientoActual: {
      motivoConsulta: hc.padecimientoActual.motivoConsulta ?? '',
      descripcionPadecimiento: hc.padecimientoActual.descripcionPadecimiento ?? '',
    },
    interrogatorioAparatosSistemas: hc.interrogatorioAparatosSistemas ?? '',
    exploracionFisica: {
      tensionArterialSistolica: hc.exploracionFisica.tensionArterialSistolica?.toString() ?? '',
      tensionArterialDiastolica: hc.exploracionFisica.tensionArterialDiastolica?.toString() ?? '',
      frecuenciaCardiaca: hc.exploracionFisica.frecuenciaCardiaca?.toString() ?? '',
      frecuenciaRespiratoria: hc.exploracionFisica.frecuenciaRespiratoria?.toString() ?? '',
      temperatura: hc.exploracionFisica.temperatura?.toString() ?? '',
      pesoKg: hc.exploracionFisica.pesoKg?.toString() ?? '',
      tallaCm: hc.exploracionFisica.tallaCm?.toString() ?? '',
      cabezaCuello: hc.exploracionFisica.cabezaCuello ?? '',
      atm: hc.exploracionFisica.atm ?? '',
      tejidosBlandos: hc.exploracionFisica.tejidosBlandos ?? '',
    },
  };
}

function toNumberOrNull(value: string): number | null {
  return value.trim() === '' ? null : Number(value);
}

@Component({
  selector: 'app-historia-clinica',
  imports: [Alert, Badge, Button, Card, Chip, CollapsibleSection, DatePipe, FormField, ProgressBar, SegmentedControl, TextInput, Textarea],
  templateUrl: './historia-clinica.html',
  styleUrl: './historia-clinica.css',
})
export class HistoriaClinica {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly historiaClinicaApi = inject(HistoriaClinicaApiService);
  private readonly patientApi = inject(PatientApiService);
  private readonly authService = inject(AuthService);

  private readonly patientId = toSignal(this.route.paramMap.pipe(map((params) => params.get('patientId'))), {
    initialValue: this.route.snapshot.paramMap.get('patientId'),
  });

  protected readonly niegaRefiereOptions = NIEGA_REFIERE_OPTIONS;
  protected readonly sectionLabels = SECTION_LABELS;
  protected readonly patologicoQuickAddOptions = PATOLOGICO_QUICK_ADD_OPTIONS;
  protected readonly alergiaQuickAddValues = ALERGIA_QUICK_ADD_VALUES;

  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly historiaClinica = signal<HistoriaClinicaModel | null>(null);
  protected readonly patientFicha = signal<{ curp: string | null; sexo: string | null; domicilio: string | null; alergias: string | null } | null>(null);

  protected readonly model = signal<HistoriaClinicaFormModel>(emptyFormModel());

  protected readonly historiaClinicaForm = form(this.model, (path) => {
    required(path.antecedentesPersonalesPatologicos.tabaquismoDetalle, {
      when: (ctx) => ctx.valueOf(path.antecedentesPersonalesPatologicos.tabaquismoRefiere) === 'true',
      message: 'Especifica frecuencia/cantidad.',
    });
    required(path.antecedentesPersonalesPatologicos.alcoholDetalle, {
      when: (ctx) => ctx.valueOf(path.antecedentesPersonalesPatologicos.alcoholRefiere) === 'true',
      message: 'Especifica frecuencia/cantidad.',
    });
    required(path.antecedentesPersonalesPatologicos.sustanciasDetalle, {
      when: (ctx) => ctx.valueOf(path.antecedentesPersonalesPatologicos.sustanciasRefiere) === 'true',
      message: 'Especifica frecuencia/cantidad.',
    });
  });

  protected readonly saving = signal(false);
  protected readonly finalizing = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly finalizeError = signal<string | null>(null);
  protected readonly incompleteSectionLabels = signal<string[]>([]);

  protected readonly isDentist = computed(() => this.authService.currentUser()?.role === 'DENTIST');
  protected readonly isFinalizado = computed(() => this.historiaClinica()?.status === 'FINALIZADO');

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    const patientId = this.patientId();
    if (!patientId) {
      return;
    }
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const [hc, patient] = await Promise.all([
        this.historiaClinicaApi.get(patientId),
        this.patientApi.getById(patientId),
      ]);
      this.historiaClinica.set(hc);
      this.model.set(fromApi(hc));
      this.patientFicha.set({
        curp: patient.curp,
        sexo: patient.sexo,
        domicilio: [patient.calleNumero, patient.colonia, patient.ciudad, patient.estado].filter(Boolean).join(', ') || null,
        alergias: patient.alergias,
      });
    } catch {
      this.loadError.set('No se pudo cargar la historia clínica.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async saveDraft(): Promise<void> {
    const patientId = this.patientId();
    if (!patientId) {
      return;
    }
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const value = this.model();
      const updated = await this.historiaClinicaApi.saveDraft(patientId, {
        antecedentesHeredofamiliares: value.antecedentesHeredofamiliares,
        antecedentesPersonalesPatologicos: {
          alergias: value.antecedentesPersonalesPatologicos.alergias || null,
          diabetes: value.antecedentesPersonalesPatologicos.diabetes || null,
          hipertension: value.antecedentesPersonalesPatologicos.hipertension || null,
          cardiopatias: value.antecedentesPersonalesPatologicos.cardiopatias || null,
          otros: value.antecedentesPersonalesPatologicos.otros || null,
          tabaquismoRefiere: value.antecedentesPersonalesPatologicos.tabaquismoRefiere === 'true',
          tabaquismoDetalle: value.antecedentesPersonalesPatologicos.tabaquismoDetalle || null,
          alcoholRefiere: value.antecedentesPersonalesPatologicos.alcoholRefiere === 'true',
          alcoholDetalle: value.antecedentesPersonalesPatologicos.alcoholDetalle || null,
          sustanciasRefiere: value.antecedentesPersonalesPatologicos.sustanciasRefiere === 'true',
          sustanciasDetalle: value.antecedentesPersonalesPatologicos.sustanciasDetalle || null,
        },
        antecedentesNoPatologicos: value.antecedentesNoPatologicos,
        padecimientoActual: {
          motivoConsulta: value.padecimientoActual.motivoConsulta || null,
          descripcionPadecimiento: value.padecimientoActual.descripcionPadecimiento || null,
        },
        interrogatorioAparatosSistemas: value.interrogatorioAparatosSistemas,
        exploracionFisica: {
          tensionArterialSistolica: toNumberOrNull(value.exploracionFisica.tensionArterialSistolica),
          tensionArterialDiastolica: toNumberOrNull(value.exploracionFisica.tensionArterialDiastolica),
          frecuenciaCardiaca: toNumberOrNull(value.exploracionFisica.frecuenciaCardiaca),
          frecuenciaRespiratoria: toNumberOrNull(value.exploracionFisica.frecuenciaRespiratoria),
          temperatura: toNumberOrNull(value.exploracionFisica.temperatura),
          pesoKg: toNumberOrNull(value.exploracionFisica.pesoKg),
          tallaCm: toNumberOrNull(value.exploracionFisica.tallaCm),
          cabezaCuello: value.exploracionFisica.cabezaCuello || null,
          atm: value.exploracionFisica.atm || null,
          tejidosBlandos: value.exploracionFisica.tejidosBlandos || null,
        },
      });
      this.historiaClinica.set(updated);
      this.model.set(fromApi(updated));
      this.patientFicha.update((ficha) =>
        ficha ? { ...ficha, alergias: updated.antecedentesPersonalesPatologicos.alergias } : ficha,
      );
    } catch (error) {
      this.saveError.set(this.extractFieldErrorMessage(error) ?? 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  protected async finalize(): Promise<void> {
    const patientId = this.patientId();
    if (!patientId) {
      return;
    }
    this.finalizeError.set(null);
    this.incompleteSectionLabels.set([]);
    this.finalizing.set(true);
    try {
      const updated = await this.historiaClinicaApi.finalize(patientId);
      this.historiaClinica.set(updated);
      this.model.set(fromApi(updated));
    } catch (error) {
      const body = (error as { error?: { errorCode?: string; incompleteSections?: SectionKey[] } } | undefined)?.error;
      if (body?.errorCode === 'HISTORIA_CLINICA_INCOMPLETE' && body.incompleteSections) {
        this.incompleteSectionLabels.set(body.incompleteSections.map((key) => this.sectionLabels[key]));
        this.finalizeError.set('Completa las secciones pendientes antes de finalizar.');
      } else {
        this.finalizeError.set('No se pudo finalizar. Intenta de nuevo.');
      }
    } finally {
      this.finalizing.set(false);
    }
  }

  protected addAllergyQuickValue(value: string): void {
    this.model.update((current) => ({
      ...current,
      antecedentesPersonalesPatologicos: {
        ...current.antecedentesPersonalesPatologicos,
        alergias: current.antecedentesPersonalesPatologicos.alergias
          ? `${current.antecedentesPersonalesPatologicos.alergias}, ${value}`
          : value,
      },
    }));
  }

  protected addPatologicoQuickValue(field: PatologicoQuickAddField, value: string): void {
    this.model.update((current) => ({
      ...current,
      antecedentesPersonalesPatologicos: {
        ...current.antecedentesPersonalesPatologicos,
        [field]: current.antecedentesPersonalesPatologicos[field]
          ? `${current.antecedentesPersonalesPatologicos[field]}, ${value}`
          : value,
      },
    }));
  }

  private extractFieldErrorMessage(error: unknown): string | null {
    const body = (error as { error?: { fieldErrors?: { message: string }[] } } | undefined)?.error;
    return body?.fieldErrors?.[0]?.message ?? null;
  }
}
