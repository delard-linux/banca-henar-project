import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-screen bg-white flex items-center justify-center py-8 px-4">
      <div class="w-full max-w-4xl">
        <!-- Header -->
        <div class="mb-6">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Paso 1 de 3</p>
            <div class="flex gap-2">
              <div class="h-2 w-12 rounded-full bg-primary-600"></div>
              <div class="h-2 w-12 rounded-full bg-slate-200"></div>
              <div class="h-2 w-12 rounded-full bg-slate-200"></div>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Create Corporate Account</h1>
          <p class="mt-1 text-sm text-slate-600">Completa los datos básicos de tu empresa para iniciar el proceso de alta.</p>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-4">
          <!-- Grid for fields -->
          <div class="grid gap-4 md:grid-cols-2">
            <!-- Company Name -->
            <div>
              <label class="text-sm font-semibold text-slate-800">Company Name *</label>
              <input
                type="text"
                formControlName="companyName"
                class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="Acme Corporation S.L."
              />
              <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('companyName')">
                El nombre de la empresa es obligatorio.
              </p>
            </div>

            <!-- Tax ID (CIF/NIF) -->
            <div>
              <label class="text-sm font-semibold text-slate-800">Tax ID (CIF/NIF) *</label>
              <input
                type="text"
                formControlName="taxId"
                class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="B12345678"
              />
              <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('taxId')">
                El CIF/NIF es obligatorio (mínimo 9 caracteres).
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="text-sm font-semibold text-slate-800">Corporate Email *</label>
              <input
                type="email"
                formControlName="email"
                class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="contact@acme.com"
              />
              <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('email')">
                Introduce un email corporativo válido.
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="text-sm font-semibold text-slate-800">Phone Number *</label>
              <input
                type="tel"
                formControlName="phone"
                class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                placeholder="+34 912 345 678"
              />
              <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('phone')">
                El teléfono es obligatorio.
              </p>
            </div>

            <!-- Industry -->
            <div class="md:col-span-2">
              <label class="text-sm font-semibold text-slate-800">Industry / Sector *</label>
              <select
                formControlName="industry"
                class="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              >
                <option value="" disabled>Selecciona un sector</option>
                @for (sector of sectors; track sector) {
                  <option [value]="sector">{{ sector }}</option>
                }
              </select>
              <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('industry')">
                Selecciona el sector de tu empresa.
              </p>
            </div>
          </div>

          <!-- Terms -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label class="flex items-start gap-3 text-xs text-slate-700">
              <input
                type="checkbox"
                formControlName="acceptTerms"
                class="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
              />
              <span>
                Acepto los <a href="#" class="font-semibold text-primary-700 hover:underline">términos y condiciones</a> y la
                <a href="#" class="font-semibold text-primary-700 hover:underline">política de privacidad</a> de Banca Henar Empresas.
              </span>
            </label>
            <p class="mt-1 text-xs text-rose-600" *ngIf="shouldShowError('acceptTerms')">
              Debes aceptar los términos para continuar.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              (click)="handleCancel()"
              class="rounded-2xl border border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting()"
              class="rounded-2xl bg-primary-600 px-6 py-2.5 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {{ isSubmitting() ? 'Procesando...' : 'Continuar' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
})
export class OnboardingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.buildForm();
  readonly isSubmitting = signal(false);

  readonly sectors = [
    'Tecnología',
    'Comercio',
    'Servicios profesionales',
    'Manufactura',
    'Construcción',
    'Hostelería y turismo',
    'Salud',
    'Educación',
    'Transporte y logística',
    'Finanzas',
    'Otros',
  ];

  private buildForm() {
    return this.fb.nonNullable.group({
      companyName: this.fb.nonNullable.control('', [Validators.required]),
      taxId: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(9)]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      phone: this.fb.nonNullable.control('', [Validators.required]),
      industry: this.fb.nonNullable.control('', [Validators.required]),
      acceptTerms: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
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
      // TODO: Aquí irá la lógica para enviar los datos al backend
      console.log('Form data:', this.form.getRawValue());
      
      // Simular llamada async
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar al siguiente paso (placeholder por ahora)
      await this.router.navigate(['/app/dashboard']);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  handleCancel(): void {
    void this.router.navigate(['/home']);
  }
}

