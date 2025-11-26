import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-responsive text-slate-900">
      <div class="rounded-3xl border border-dashed border-primary-200 bg-white p-10 text-center">
        <p class="text-sm uppercase tracking-[0.4em] text-slate-500">Operativa</p>
        <h1 class="mt-4 text-4xl font-semibold text-slate-900">Wizard Alta Empresa</h1>
        <p class="mx-auto mt-4 max-w-2xl text-slate-600">
          Esta pantalla reservará el flujo de onboarding corporativo. Aquí se integrará el wizard en 3 pasos descrito en la
          especificación funcional. Mientras tanto se muestra un placeholder validado.
        </p>
      </div>
    </section>
  `,
})
export class OnboardingComponent {}

