export type Sexo = 'FEMENINO' | 'MASCULINO';

export interface Patient {
  id: string;
  folio: string;
  fullName: string;
  phone: string;
  birthDate: string;
  edad: number;
  curp: string | null;
  sexo: Sexo | null;
  calleNumero: string | null;
  colonia: string | null;
  ciudad: string | null;
  codigoPostal: string | null;
  estado: string | null;
  alergias: string | null;
  hasHistoriaClinica: boolean;
  historiaClinicaId: string | null;
  createdAt: string;
}

// lastVisitAt is always null in this feature since appointments/notas don't exist yet (data-model.md).
export interface PatientSummary {
  id: string;
  fullName: string;
  folio: string;
  phone: string;
  edad: number;
  hasAllergies: boolean;
  lastVisitAt: string | null;
}

export interface CreatePatientPayload {
  fullName: string;
  phone: string;
  birthDate: string;
  curp?: string | null;
  sexo?: Sexo | null;
  calleNumero?: string | null;
  colonia?: string | null;
  ciudad?: string | null;
  codigoPostal?: string | null;
  estado?: string | null;
  alergias?: string | null;
  confirmDuplicate?: boolean;
}

export interface PatientSearchResponse {
  results: PatientSummary[];
}
