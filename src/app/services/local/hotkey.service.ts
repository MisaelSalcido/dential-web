import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HotkeyService {
  private readonly bindings = new Map<string, () => void>();

  register(combo: string, handler: () => void): () => void {
    if (this.bindings.has(combo)) {
      throw new Error(`Hotkey "${combo}" is already registered.`);
    }
    this.bindings.set(combo, handler);
    return () => this.bindings.delete(combo);
  }

  handleKeydownEvent(event: KeyboardEvent): void {
    // Require Ctrl alone so e.g. Ctrl+Shift+1 doesn't also trigger the Ctrl+1 binding.
    if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }

    const handler = this.bindings.get(`ctrl+${event.code}`);
    if (!handler) {
      return;
    }

    event.preventDefault();
    handler();
  }
}
