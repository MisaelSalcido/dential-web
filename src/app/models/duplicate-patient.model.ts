export interface DuplicatePatientMatch {
  id: string;
  fullName: string;
  folio: string;
  phone: string;
  lastVisitAt: string | null;
}

export interface PatientErrorBody {
  errorCode: string;
  message?: string;
  fieldErrors?: { field: string; message: string }[];
  duplicateMatch?: DuplicatePatientMatch;
}
