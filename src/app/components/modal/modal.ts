import { Component, ElementRef, effect, input, model, viewChild } from '@angular/core';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'app-modal',
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  open = model<boolean>(false);
  ariaLabel = input<string>('Diálogo');

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocusedElement: HTMLElement | null = null;

  constructor() {
    // WCAG 2.4.3: move focus into the dialog on open, restore it to the trigger on close.
    effect(() => {
      const dialog = this.dialogRef()?.nativeElement;
      if (this.open() && dialog) {
        this.lastFocusedElement = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.focusFirstElement(dialog));
      } else if (!this.open() && this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    });
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.trapTab(event);
    }
  }

  private focusFirstElement(dialog: HTMLElement): void {
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable[0] ?? dialog).focus();
  }

  private trapTab(event: KeyboardEvent): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) {
      return;
    }
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
