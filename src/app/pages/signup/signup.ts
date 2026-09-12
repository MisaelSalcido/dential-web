import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, email as emailValidator, form, pattern, required, submit } from '@angular/forms/signals';
import { Alert } from '../../components/alert/alert';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { TextInput } from '../../components/text-input/text-input';
import { AuthErrorBody } from '../../models/auth-user.model';
import { AuthService } from '../../services/local/auth.service';

interface SignupFormModel {
  clinicName: string;
  fullName: string;
  email: string;
  password: string;
}

const PASSWORD_PATTERN = /^(?!\d+$).{8,}$/;

@Component({
  selector: 'app-signup',
  imports: [Alert, Button, Card, FormField, RouterLink, TextInput],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly model = signal<SignupFormModel>({
    clinicName: '',
    fullName: '',
    email: '',
    password: '',
  });

  protected readonly signupForm = form(this.model, (path) => {
    required(path.clinicName, { message: 'El nombre de la clínica es obligatorio.' });
    required(path.fullName, { message: 'El nombre completo es obligatorio.' });
    required(path.email, { message: 'El correo es obligatorio.' });
    emailValidator(path.email, { message: 'Ingresa un correo válido.' });
    required(path.password, { message: 'La contraseña es obligatoria.' });
    pattern(path.password, PASSWORD_PATTERN, {
      message: 'La contraseña debe tener al menos 8 caracteres y no ser solo números.',
    });
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly clinicNameErrorText = computed(() => this.fieldErrorText(this.signupForm.clinicName()));
  protected readonly fullNameErrorText = computed(() => this.fieldErrorText(this.signupForm.fullName()));
  protected readonly emailErrorText = computed(() => this.fieldErrorText(this.signupForm.email()));
  protected readonly passwordErrorText = computed(() => this.fieldErrorText(this.signupForm.password()));

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.serverError.set(null);

    await submit(this.signupForm, {
      action: async () => {
        this.submitting.set(true);
        try {
          const { clinicName, fullName, email, password } = this.model();
          await this.authService.signup({ clinicName, fullName, email, password });
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
    const fields = [this.signupForm.clinicName, this.signupForm.fullName, this.signupForm.email, this.signupForm.password];
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
    if (body?.errorCode === 'EMAIL_ALREADY_REGISTERED') {
      return body.message ?? 'Este correo ya está registrado.';
    }
    if (body?.errorCode === 'VALIDATION_FAILED' && body.fieldErrors?.length) {
      return body.fieldErrors.map((fieldError) => fieldError.message).join(' ');
    }
    return 'No se pudo crear la cuenta. Intenta de nuevo.';
  }
}
