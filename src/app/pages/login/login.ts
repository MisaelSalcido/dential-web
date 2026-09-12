import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, email as emailValidator, form, required, submit } from '@angular/forms/signals';
import { Alert } from '../../components/alert/alert';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { TextInput } from '../../components/text-input/text-input';
import { AuthErrorBody } from '../../models/auth-user.model';
import { AuthService } from '../../services/local/auth.service';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [Alert, Button, Card, FormField, RouterLink, TextInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly model = signal<LoginFormModel>({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email, { message: 'El correo es obligatorio.' });
    emailValidator(path.email, { message: 'Ingresa un correo válido.' });
    required(path.password, { message: 'La contraseña es obligatoria.' });
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly emailErrorText = computed(() => this.fieldErrorText(this.loginForm.email()));
  protected readonly passwordErrorText = computed(() => this.fieldErrorText(this.loginForm.password()));

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.serverError.set(null);

    await submit(this.loginForm, {
      action: async () => {
        this.submitting.set(true);
        try {
          await this.authService.login({ email: this.model().email, password: this.model().password });
          await this.router.navigateByUrl('/');
        } catch (error) {
          this.serverError.set(this.extractErrorMessage(error));
        } finally {
          this.submitting.set(false);
        }
      },
      onInvalid: () => this.focusFirstInvalidField(),
    });
  }

  private focusFirstInvalidField(): void {
    const fields = [this.loginForm.email, this.loginForm.password];
    fields.find((field) => field().invalid())?.().focusBoundControl();
  }

  private fieldErrorText(field: { touched(): boolean; invalid(): boolean; errors(): { message?: string }[] }): string | null {
    if (!field.touched() || !field.invalid()) {
      return null;
    }
    return field.errors()[0]?.message ?? 'Campo inválido.';
  }

  private extractErrorMessage(error: unknown): string {
    const body = (error as { error?: AuthErrorBody } | undefined)?.error;
    if (body?.errorCode === 'ACCOUNT_LOCKED') {
      return body.message ?? 'Cuenta bloqueada temporalmente. Intenta de nuevo más tarde.';
    }
    if (body?.errorCode === 'INVALID_CREDENTIALS') {
      return body.message ?? 'Correo o contraseña incorrectos.';
    }
    return 'No se pudo iniciar sesión. Intenta de nuevo.';
  }
}
