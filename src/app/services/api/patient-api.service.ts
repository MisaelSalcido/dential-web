import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePatientPayload, Patient, PatientSearchResponse, PatientSummary } from '../../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/patients`;

  async create(payload: CreatePatientPayload): Promise<Patient> {
    return firstValueFrom(this.http.post<Patient>(this.baseUrl, payload));
  }

  async getById(id: string): Promise<Patient> {
    return firstValueFrom(this.http.get<Patient>(`${this.baseUrl}/${id}`));
  }

  async search(query: string): Promise<PatientSummary[]> {
    const params = new HttpParams().set('q', query);
    const response = await firstValueFrom(
      this.http.get<PatientSearchResponse>(`${this.baseUrl}/search`, { params }),
    );
    return response.results;
  }
}
