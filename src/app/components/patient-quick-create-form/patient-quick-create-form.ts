import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, form, pattern, required, submit, validate } from '@angular/forms/signals';
import { Alert } from '../alert/alert';
import { Button } from '../button/button';
import { Chip } from '../chip/chip';
import { CollapsibleSection } from '../collapsible-section/collapsible-section';
import { SegmentedControl } from '../segmented-control/segmented-control';
import { TextInput } from '../text-input/text-input';
import { Textarea } from '../textarea/textarea';
import { ALERGIA_QUICK_ADD_VALUES, ESTADO_OPTIONS, SEXO_OPTIONS } from '../../utils/catalogs';
import { isValidCurp } from '../../utils/curp.util';
import { DuplicatePatientMatch, PatientErrorBody } from '../../models/duplicate-patient.model';
import { CreatePatientPayload } from '../../models/patient.model';
import { PatientApiService } from '../../services/api/patient-api.service';
import { AuthService } from '../../services/local/auth.service';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';

interface PatientQuickCreateFormModel {
  fullName: string;
  birthDate: string;
  phone: string;
  curp: string;
  sexo: string | null;
  calleNumero: string;
  colonia: string;
  ciudad: string;
  codigoPostal: string;
  estado: string;
  alergias: string;
}

function emptyModel(): PatientQuickCreateFormModel {
  return {
    fullName: '',
    birthDate: '',
    phone: '',
    curp: '',
    sexo: null,
    calleNumero: '',
    colonia: '',
    ciudad: '',
    codigoPostal: '',
    estado: '',
    alergias: '',
  };
}

@Component({
  selector: 'app-patient-quick-create-form',
  imports: [Alert, Button, Chip, CollapsibleSection, FormField, SegmentedControl, TextInput, Textarea],
  templateUrl: './patient-quick-create-form.html',
  styleUrl: './patient-quick-create-form.css',
})
export class PatientQuickCreateForm {
  private readonly patientApi = inject(PatientApiService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(PatientCreateModalService);
  private readonly router = inject(Router);

  protected readonly sexoOptions = SEXO_OPTIONS;
  protected readonly estadoOptions = ESTADO_OPTIONS;
  protected readonly alergiaQuickAddValues = ALERGIA_QUICK_ADD_VALUES;

  protected readonly moreDetailsExpanded = signal(false);

  protected readonly model = signal<PatientQuickCreateFormModel>({
    ...emptyModel(),
    fullName: this.modalService.prefillName() ?? '',
  });

  protected readonly quickCreateForm = form(this.model, (path) => {
    required(path.fullName, { message: 'El nombre completo es obligatorio.' });
    required(path.birthDate, { message: 'La fecha de nacimiento es obligatoria.' });
    required(path.phone, { message: 'El teléfono es obligatorio.' });
    validate(path.curp, ({ value }) => {
      const curp = value();
      if (!curp) {
        return undefined;
      }
      return isValidCurp(curp)
        ? undefined
        : { kind: 'curp', message: 'El CURP no tiene un formato o dígito verificador válido.' };
    });
    pattern(path.codigoPostal, /^\d{5}$/, { message: 'El código postal debe tener 5 dígitos.' });
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly duplicateMatch = signal<DuplicatePatientMatch | null>(null);
  protected readonly isFreePlan = computed(() => this.authService.currentUser()?.tenant?.subscriptionPlan === 'FREE');

  protected readonly fullNameErrorText = computed(() => this.fieldErrorText(this.quickCreateForm.fullName()));
  protected readonly birthDateErrorText = computed(() => this.fieldErrorText(this.quickCreateForm.birthDate()));
  protected readonly phoneErrorText = computed(() => this.fieldErrorText(this.quickCreateForm.phone()));
  protected readonly curpErrorText = computed(() => this.fieldErrorText(this.quickCreateForm.curp()));
  protected readonly codigoPostalErrorText = computed(() => this.fieldErrorText(this.quickCreateForm.codigoPostal()));

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.serverError.set(null);
    this.duplicateMatch.set(null);

    await submit(this.quickCreateForm, {
      action: () => this.createPatient(false),
      onInvalid: () => this.focusFirstInvalidField(),
    });
  }

  protected async openDuplicateMatch(): Promise<void> {
    const match = this.duplicateMatch();
    if (!match) {
      return;
    }
    this.modalService.close();
    await this.router.navigateByUrl(`/pacientes/${match.id}`);
  }

  protected async createAnyway(): Promise<void> {
    await this.createPatient(true);
  }

  protected handleCancel(): void {
    this.modalService.close();
  }

  protected addAllergyQuickValue(value: string): void {
    this.model.update((current) => ({
      ...current,
      alergias: current.alergias ? `${current.alergias}, ${value}` : value,
    }));
  }

  private async createPatient(confirmDuplicate: boolean): Promise<void> {
    this.submitting.set(true);
    try {
      const patient = await this.patientApi.create(this.buildPayload(confirmDuplicate));
      this.modalService.close();
      await this.router.navigateByUrl(`/pacientes/${patient.id}`);
    } catch (error) {
      const body = (error as { error?: PatientErrorBody } | undefined)?.error;
      if (body?.errorCode === 'POSSIBLE_DUPLICATE' && body.duplicateMatch) {
        this.duplicateMatch.set(body.duplicateMatch);
      } else {
        this.serverError.set(this.extractErrorMessage(error));
      }
    } finally {
      this.submitting.set(false);
    }
  }

  private buildPayload(confirmDuplicate: boolean): CreatePatientPayload {
    const value = this.model();
    return {
      fullName: value.fullName,
      phone: value.phone,
      birthDate: value.birthDate,
      curp: value.curp || null,
      sexo: (value.sexo as CreatePatientPayload['sexo']) || null,
      calleNumero: value.calleNumero || null,
      colonia: value.colonia || null,
      ciudad: value.ciudad || null,
      codigoPostal: value.codigoPostal || null,
      estado: value.estado || null,
      alergias: value.alergias || null,
      confirmDuplicate,
    };
  }

  private focusFirstInvalidField(): void {
    const fields = [this.quickCreateForm.fullName, this.quickCreateForm.birthDate, this.quickCreateForm.phone];
    fields.find((field) => field().invalid())?.().focusBoundControl();
  }

  private fieldErrorText(field: { touched(): boolean; invalid(): boolean; errors(): { message?: string }[] }): string | null {
    if (!field.touched() || !field.invalid()) {
      return null;
    }
    return field.errors()[0]?.message ?? 'Campo inválido.';
  }

  private extractErrorMessage(error: unknown): string {
    const body = (error as { error?: PatientErrorBody } | undefined)?.error;
    if (body?.errorCode === 'PLAN_LIMIT_REACHED') {
      return body.message ?? 'Alcanzaste el límite de pacientes de tu plan.';
    }
    if (body?.errorCode === 'VALIDATION_FAILED' && body.fieldErrors?.length) {
      return body.fieldErrors.map((fieldError) => fieldError.message).join(' ');
    }
    return 'No se pudo crear el paciente. Intenta de nuevo.';
  }
}
