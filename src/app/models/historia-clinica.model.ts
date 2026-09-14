export type HistoriaClinicaStatus = 'DRAFT' | 'FINALIZADO';

export interface AntecedentesPersonalesPatologicos {
  alergias: string | null;
  diabetes: string | null;
  hipertension: string | null;
  cardiopatias: string | null;
  otros: string | null;
  tabaquismoRefiere: boolean;
  tabaquismoDetalle: string | null;
  alcoholRefiere: boolean;
  alcoholDetalle: string | null;
  sustanciasRefiere: boolean;
  sustanciasDetalle: string | null;
}

export interface PadecimientoActual {
  motivoConsulta: string | null;
  descripcionPadecimiento: string | null;
}

export interface ExploracionFisica {
  tensionArterialSistolica: number | null;
  tensionArterialDiastolica: number | null;
  frecuenciaCardiaca: number | null;
  frecuenciaRespiratoria: number | null;
  temperatura: number | null;
  pesoKg: number | null;
  tallaCm: number | null;
  cabezaCuello: string | null;
  atm: string | null;
  tejidosBlandos: string | null;
}

export type SectionKey =
  | 'antecedentesHeredofamiliares'
  | 'antecedentesPersonalesPatologicos'
  | 'antecedentesNoPatologicos'
  | 'padecimientoActual'
  | 'interrogatorioAparatosSistemas'
  | 'exploracionFisica';

export type SectionCompleteness = Record<SectionKey, boolean>;

export interface FinalizedBy {
  userId: string;
  name: string | null;
  cedula: string | null;
}

export interface HistoriaClinica {
  id: string;
  status: HistoriaClinicaStatus;
  antecedentesHeredofamiliares: string | null;
  antecedentesPersonalesPatologicos: AntecedentesPersonalesPatologicos;
  antecedentesNoPatologicos: string | null;
  padecimientoActual: PadecimientoActual;
  interrogatorioAparatosSistemas: string | null;
  exploracionFisica: ExploracionFisica;
  sectionCompleteness: SectionCompleteness;
  overallCompletenessPercent: number;
  finalizedBy: FinalizedBy | null;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SaveHistoriaClinicaPayload = Partial<
  Pick<
    HistoriaClinica,
    | 'antecedentesHeredofamiliares'
    | 'antecedentesPersonalesPatologicos'
    | 'antecedentesNoPatologicos'
    | 'padecimientoActual'
    | 'interrogatorioAparatosSistemas'
    | 'exploracionFisica'
  >
>;

export interface HistoriaClinicaIncompleteError {
  errorCode: 'HISTORIA_CLINICA_INCOMPLETE';
  incompleteSections: SectionKey[];
}

export interface HistoriaClinicaAlreadyExistsError {
  errorCode: 'HISTORIA_CLINICA_ALREADY_EXISTS';
  historiaClinicaId: string;
}
