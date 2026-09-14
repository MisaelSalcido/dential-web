import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HistoriaClinica, SaveHistoriaClinicaPayload } from '../../models/historia-clinica.model';

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  async get(patientId: string): Promise<HistoriaClinica> {
    return firstValueFrom(
      this.http.get<HistoriaClinica>(`${this.baseUrl}/patients/${patientId}/historia-clinica`),
    );
  }

  async start(patientId: string): Promise<HistoriaClinica> {
    return firstValueFrom(
      this.http.post<HistoriaClinica>(`${this.baseUrl}/patients/${patientId}/historia-clinica`, {}),
    );
  }

  async saveDraft(patientId: string, payload: SaveHistoriaClinicaPayload): Promise<HistoriaClinica> {
    return firstValueFrom(
      this.http.patch<HistoriaClinica>(`${this.baseUrl}/patients/${patientId}/historia-clinica`, payload),
    );
  }

  async finalize(patientId: string): Promise<HistoriaClinica> {
    return firstValueFrom(
      this.http.post<HistoriaClinica>(`${this.baseUrl}/patients/${patientId}/historia-clinica/finalize`, {}),
    );
  }
}
