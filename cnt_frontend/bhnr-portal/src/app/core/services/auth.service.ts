import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, Credentials } from '../models/auth.models';

const STORAGE_KEY = 'bhnr.auth.user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.restoreUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  login(credentials: Credentials): AuthUser {
    // Mock user payload – replace with real API integration in the future.
    const mockUser: AuthUser = {
      id: crypto.randomUUID(),
      name: 'Marina Salgado',
      company: 'Henar Logistics S.A.',
      email: `${credentials.identifier}@bhnr.com`,
    };

    this.userSignal.set(mockUser);

    if (credentials.remember) {
      this.persistUser(mockUser);
    } else {
      this.clearPersistedUser();
    }

    return mockUser;
  }

  logout(): void {
    this.userSignal.set(null);
    this.clearPersistedUser();
  }

  private restoreUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const payload = window.localStorage.getItem(STORAGE_KEY);
    return payload ? (JSON.parse(payload) as AuthUser) : null;
  }

  private persistUser(user: AuthUser): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private clearPersistedUser(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }
}

