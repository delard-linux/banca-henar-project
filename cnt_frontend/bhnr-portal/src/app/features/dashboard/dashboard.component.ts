import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-responsive space-y-10 text-slate-900">
      <div class="grid gap-6 md:grid-cols-3">
        @for (card of summaryCards; track card.label) {
          <article class="rounded-3xl border border-slate-200 bg-white p-6">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">{{ card.label }}</p>
            <p class="mt-3 text-3xl font-semibold">{{ card.value }}</p>
            <p class="text-sm text-slate-600">{{ card.description }}</p>
          </article>
        }
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <article class="rounded-3xl border border-slate-200 bg-white p-6">
          <header class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Alertas</p>
              <h2 class="text-2xl font-semibold text-slate-900">Movimientos recientes</h2>
            </div>
            <span class="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">{{ recentAlerts.length }} activos</span>
          </header>
          <ul class="mt-6 space-y-4">
            @for (alert of recentAlerts; track alert.title) {
              <li class="rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500">{{ alert.tag }}</p>
                <p class="mt-1 text-lg font-semibold">{{ alert.title }}</p>
                <p class="text-sm text-slate-600">{{ alert.detail }}</p>
              </li>
            }
          </ul>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6">
          <header class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Operativa</p>
              <h2 class="text-2xl font-semibold text-slate-900">En curso</h2>
            </div>
            <span class="rounded-full border border-primary-200 px-3 py-1 text-sm text-primary-700">Track en tiempo real</span>
          </header>

          <div class="mt-6 space-y-4">
            @for (op of operations; track op.name) {
              <div class="rounded-2xl border border-slate-200 bg-white p-4">
                <div class="flex items-center justify-between">
                  <p class="text-lg font-semibold">{{ op.name }}</p>
                  <span class="text-sm text-slate-600">{{ op.stage }}</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-slate-200">
                  <div class="h-full rounded-full bg-primary-600" [style.width.%]="op.progress"></div>
                </div>
                <p class="mt-2 text-sm text-slate-600">{{ op.description }}</p>
              </div>
            }
          </div>
        </article>
      </div>
    </section>
  `,
})
export class DashboardComponent {
  readonly summaryCards = [
    { label: 'Tesorería global', value: '€ 12,4 M', description: 'Disponible inmediato 24h' },
    { label: 'Financiación activa', value: '€ 32,8 M', description: '12 operaciones vivas' },
    { label: 'Órdenes pendientes', value: '8 autorizaciones', description: '3 requieren firma dual' },
  ];

  readonly recentAlerts = [
    { tag: 'Riesgo', title: 'Línea circulante - revisión', detail: 'Actualiza estados financieros Q4' },
    { tag: 'Firma', title: 'Alta filial LATAM', detail: 'Pendiente segunda autorización' },
    { tag: 'Cobros', title: 'Pagos programados', detail: 'Confirma lote 23 operaciones confirmings' },
  ];

  readonly operations = [
    { name: 'Project Finance Solar HN-04', stage: 'Aprobación comité', progress: 68, description: 'Comité semanal 27/11' },
    { name: 'Línea avales internacionales', stage: 'Documentación', progress: 45, description: 'Legal revisando addendum' },
    { name: 'Alta empresa — filial Portugal', stage: 'Onboarding', progress: 80, description: 'Listo para validación final' },
  ];
}

