import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('/bhnr_landing_bg.png')] bg-cover bg-top md:bg-center"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-white/50 via-white/40 to-white/30"></div>
      <div class="container-responsive relative z-10 flex flex-col gap-12 py-16 text-slate-900 lg:flex-row lg:items-center">
      <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-elevated lg:flex-1 relative z-10 order-2 lg:order-1">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <p class="text-sm uppercase tracking-[0.4em] text-slate-500">Gestión corporativa</p>
            <p class="mt-4 text-2xl font-semibold text-slate-900">Panel inteligente</p>
            <p class="mt-2 text-slate-600">Seguimiento en tiempo real de tesorería, financiación activa y alertas.</p>
          </div>
          <img src="/bhnr_logo.png" alt="BHNR" class="h-12 w-auto object-contain" />
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Liquidity</p>
            <p class="mt-2 text-3xl font-semibold text-primary-600">€4,2M</p>
            <p class="text-sm text-slate-600">Disponible inmediato</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Financing</p>
            <p class="mt-2 text-3xl font-semibold text-primary-600">12 proyectos</p>
            <p class="text-sm text-slate-600">Activos con seguimiento</p>
          </div>
        </div>
      </div>
      <div class="space-y-6 lg:flex-1 order-1 lg:order-2 lg:mt-48">
        <h1 class="text-xl font-bold leading-tight text-slate-950 md:text-2xl">
          Potencia tu negocio con Banca Henar
        </h1>
        <p class="text-xl md:text-2xl text-slate-800 leading-relaxed">
          Soluciones financieras ágiles y diseñadas para compañías que no se detienen. Gestiona tus operaciones 100% online
          con asesoramiento experto en pymes y corporates.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            routerLink="/create-account"
            class="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-elevated transition hover:bg-primary-700"
          >
            Crear cuenta empresa
          </a>
        </div>
      </div>
      </div>
    </section>

    <section id="solutions" class="container-responsive grid gap-6 py-16 md:grid-cols-3">
      @for (benefit of benefits; track benefit.title) {
        <article class="rounded-3xl border border-slate-200 bg-white p-6">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">{{ benefit.tag }}</p>
          <h3 class="mt-4 text-xl font-semibold text-slate-900">{{ benefit.title }}</h3>
          <p class="mt-3 text-slate-600">{{ benefit.description }}</p>
        </article>
      }
    </section>

    <section id="help" class="container-responsive py-16">
      <div class="rounded-3xl border border-primary-100 bg-primary-50 p-10 shadow-elevated">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.4em] text-primary-700">Acompañamiento experto</p>
            <h2 class="mt-3 text-3xl font-semibold text-slate-900">¿Necesitas asesoramiento dedicado?</h2>
            <p class="mt-2 text-slate-700">Nuestro equipo corporate responde en menos de 4 horas hábiles.</p>
          </div>
          <a
            href="mailto:corporate@bhnr.com"
            class="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
          >
            Contactar equipo BHNR
          </a>
        </div>
      </div>
    </section>
  `,
})
export class LandingPageComponent {
  readonly benefits = [
    {
      tag: 'Gestión',
      title: '100% gestión online',
      description: 'Firma digital, autorizaciones multiusuario y flujos aprobatorios configurables.',
    },
    {
      tag: 'Financiación',
      title: 'Financiación a medida',
      description: 'Líneas para circulante, avales internacionales y project finance con decisión ágil.',
    },
    {
      tag: 'Expertise',
      title: 'Expertos en pymes y midcorp',
      description: 'Equipo especializado por sector que entiende la operativa de tu negocio.',
    },
  ];
}

