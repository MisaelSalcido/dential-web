import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PatientCreateModalService {
  readonly isOpen = signal(false);
  readonly prefillName = signal<string | null>(null);

  open(prefillName: string | null = null): void {
    this.prefillName.set(prefillName);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.prefillName.set(null);
  }
}
