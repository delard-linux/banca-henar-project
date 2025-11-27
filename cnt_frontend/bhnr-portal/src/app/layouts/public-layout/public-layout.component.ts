import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-white text-slate-900">
      <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div class="container-responsive flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <a routerLink="/home" class="flex items-center gap-3 font-semibold tracking-wide text-lg">
            <img src="/bhnr_logo_solo_p.png" alt="Banca Henar" class="h-10 w-10 object-contain" />
            <span class="text-primary-800">Banca Henar for Business</span>
          </a>

          <div class="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <nav class="flex items-center gap-6 text-sm text-slate-600 font-medium">
              <a href="#solutions" class="hover:text-primary-700 transition-colors">Solutions</a>
              <a href="#financing" class="hover:text-primary-700 transition-colors">Financing</a>
              <a href="#help" class="hover:text-primary-700 transition-colors">Help</a>
            </nav>
            <div class="flex items-center gap-2">
              <a
                routerLink="/create-account"
                class="rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition"
              >
                Become a client
              </a>
              <a
                routerLink="/auth/login"
                class="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
              >
                Client access
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-slate-200 bg-white">
        <div class="container-responsive flex flex-col gap-3 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {{ currentYear }} Banca Henar. All rights reserved.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-primary-700">Privacy</a>
            <a href="#" class="hover:text-primary-700">Cookies</a>
            <a href="#" class="hover:text-primary-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  readonly currentYear = new Date().getFullYear();
}

