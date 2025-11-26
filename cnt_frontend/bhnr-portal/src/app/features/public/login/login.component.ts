import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-responsive flex min-h-[calc(100vh-240px)] items-center justify-center py-16">
      <div class="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-elevated">
        <p class="text-sm uppercase tracking-[0.4em] text-primary-600">Client access</p>
        <h1 class="mt-3 text-3xl font-semibold text-slate-900">BHNR Corporate Portal</h1>
        <p class="mt-2 text-slate-600">
          Sign in with your identifier or Tax ID and manage your business operations with enhanced security.
        </p>

        <form class="mt-10 space-y-6" [formGroup]="form" (ngSubmit)="handleSubmit()">
          <div>
            <label class="text-sm font-semibold text-slate-800">Identifier / Tax ID</label>
            <input
              type="text"
              formControlName="identifier"
              class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none"
              placeholder="ES12345678"
            />
            <p class="mt-2 text-sm text-rose-600" *ngIf="shouldShowError('identifier')">
              This field is required (minimum 5 characters).
            </p>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-800">Password</label>
            <input
              type="password"
              formControlName="password"
              class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none"
              placeholder="••••••••"
            />
            <p class="mt-2 text-sm text-rose-600" *ngIf="shouldShowError('password')">
              Enter your corporate password.
            </p>
          </div>

          <label class="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" formControlName="remember" class="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600" />
            Remember secure session
          </label>

          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting()"
            class="w-full rounded-2xl bg-primary-600 px-6 py-3 text-center text-lg font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {{ isSubmitting() ? 'Validating...' : 'Sign In' }}
          </button>

          <div class="text-right text-sm">
            <a href="#" class="text-primary-700 hover:text-primary-900">Forgot your password?</a>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.buildForm();
  readonly isSubmitting = signal(false);

  private buildForm() {
    return this.fb.nonNullable.group({
      identifier: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      remember: this.fb.nonNullable.control(true),
    });
  }

  shouldShowError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      this.authService.login(this.form.getRawValue());
      await this.router.navigate(['/app/dashboard']);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

