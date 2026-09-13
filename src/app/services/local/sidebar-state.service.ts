import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'dential.sidebar.collapsed';
const MOBILE_BREAKPOINT_PX = 768; // Tailwind's `md` breakpoint

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly collapsed = signal(this.readInitialValue());

  private readonly persistOnChange = effect(() => {
    this.persist(this.collapsed());
  });

  toggle(): void {
    this.collapsed.update((value) => !value);
  }

  private readInitialValue(): boolean {
    const stored = this.readStoredValue();
    if (stored !== null) {
      return stored;
    }
    return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT_PX;
  }

  private readStoredValue(): boolean | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? null : raw === 'true';
    } catch {
      return null;
    }
  }

  private persist(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // localStorage may be unavailable (private browsing, etc.) — the preference simply won't persist.
    }
  }
}
