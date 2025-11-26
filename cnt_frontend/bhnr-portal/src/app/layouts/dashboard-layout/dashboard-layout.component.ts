import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-white text-slate-900">
      <div class="flex">
        <aside class="hidden w-72 flex-shrink-0 border-r border-slate-200 bg-white p-6 md:block">
          <div class="mb-10">
            <img src="/bhnr_logo.png" alt="BHNR" class="mb-3 w-48 object-contain" />
            <p class="text-lg font-semibold text-primary-800">Banca Henar Business</p>
          </div>

          <nav class="space-y-6 text-sm">
            <div>
              <p class="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">General</p>
              <a
                routerLink="/app/dashboard"
                routerLinkActive="border-primary-500 bg-primary-50 text-primary-800"
                class="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-slate-700 transition hover:text-primary-800"
              >
                <span class="h-2 w-2 rounded-full bg-primary-500"></span>
                Home
              </a>
            </div>

            <div>
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-slate-700 hover:text-primary-800"
                (click)="toggleOperations()"
              >
                <span class="flex items-center gap-3">
                  <span class="h-2 w-2 rounded-full bg-primary-500"></span>
                  Operations
                </span>
                <span class="text-xs" [class.rotate-180]="operationsOpen()">⌃</span>
              </button>
              <div class="mt-2 space-y-2 pl-7" *ngIf="operationsOpen()">
                <a
                  routerLink="/create-account"
                  routerLinkActive="text-primary-800 font-semibold"
                  class="block rounded-lg px-3 py-2 text-slate-700 hover:bg-primary-50 hover:text-primary-800"
                >
                  Company registration
                </a>
              </div>
            </div>

            <div class="space-y-2 text-slate-500">
              <p class="text-xs uppercase tracking-[0.2em]">Coming soon</p>
              <div class="rounded-xl border border-slate-200 px-4 py-3 bg-white">Accounts &amp; Cards</div>
              <div class="rounded-xl border border-slate-200 px-4 py-3 bg-white">Financing</div>
              <div class="rounded-xl border border-slate-200 px-4 py-3 bg-white">Documentation</div>
              <div class="rounded-xl border border-slate-200 px-4 py-3 bg-white">Settings</div>
            </div>
          </nav>
        </aside>

        <section class="flex flex-1 flex-col">
          <header class="border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm text-slate-500">Corporate Panel</p>
                <p class="text-2xl font-semibold text-slate-900">
                  Hello, {{ user()?.name ?? 'User' }} — {{ user()?.company ?? 'BHNR' }}
                </p>
              </div>
              <div class="flex items-center gap-4 text-sm">
                <div class="hidden rounded-full border border-slate-300 px-4 py-2 text-slate-700 md:block">
                  {{ user()?.email ?? 'corporate@bhnr.com' }}
                </div>
                <button
                  type="button"
                  class="rounded-full bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
                  (click)="handleLogout()"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main class="flex-1 bg-white px-6 py-8">
            <router-outlet />
          </main>
        </section>
      </div>

      <!-- Logout Confirmation Dialog -->
      <div 
        *ngIf="showLogoutConfirm()"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
        (click)="cancelLogout()"
      >
        <div 
          class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <h2 class="text-2xl font-semibold text-slate-900">Sign out</h2>
          <p class="mt-3 text-slate-600">
            Are you sure you want to sign out? You will need to enter your credentials again to access your account.
          </p>
          <div class="mt-6 flex gap-3">
            <button
              type="button"
              (click)="cancelLogout()"
              class="flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="confirmLogout()"
              class="flex-1 rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly operationsOpen = signal(true);
  readonly showLogoutConfirm = signal(false);

  handleLogout(): void {
    // Show confirmation dialog
    this.showLogoutConfirm.set(true);
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
    void this.router.navigate(['/home']);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  toggleOperations(): void {
    this.operationsOpen.update((state) => !state);
  }
}

