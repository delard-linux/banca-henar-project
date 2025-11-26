import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, Credentials } from '../models/auth.models';

const STORAGE_KEY = 'bhnr.auth.user';
const TOKEN_KEY = 'bhnr.auth.token';

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSignal = signal<AuthUser | null>(this.restoreUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  async login(credentials: Credentials): Promise<LoginResult> {
    try {
      // Mock authentication - replace with real API call in the future
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user payload – replace with real API integration in the future.
      const mockUser: AuthUser = {
        id: crypto.randomUUID(),
        name: 'Marina Salgado',
        company: 'Henar Logistics S.A.',
        email: `${credentials.identifier}@bhnr.com`,
      };

      // Mock JWT token
      const mockToken = `mock.jwt.${crypto.randomUUID()}`;

      this.userSignal.set(mockUser);

      // Store user and token based on remember preference
      if (credentials.remember) {
        this.persistUser(mockUser, 'local');
        this.persistToken(mockToken, 'local');
      } else {
        this.persistUser(mockUser, 'session');
        this.persistToken(mockToken, 'session');
      }

      return {
        success: true,
        user: mockUser,
        token: mockToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed. Please try again.'
      };
    }
  }

  logout(): void {
    this.userSignal.set(null);
    this.clearPersistedUser();
    this.clearPersistedToken();
  }

  private restoreUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // Try to restore from localStorage first, then sessionStorage
    const localPayload = window.localStorage.getItem(STORAGE_KEY);
    if (localPayload) {
      return JSON.parse(localPayload) as AuthUser;
    }

    const sessionPayload = window.sessionStorage.getItem(STORAGE_KEY);
    return sessionPayload ? (JSON.parse(sessionPayload) as AuthUser) : null;
  }

  private persistUser(user: AuthUser, storage: 'local' | 'session'): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storageKey = JSON.stringify(user);
    if (storage === 'local') {
      window.localStorage.setItem(STORAGE_KEY, storageKey);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, storageKey);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  private persistToken(token: string, storage: 'local' | 'session'): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (storage === 'local') {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.sessionStorage.removeItem(TOKEN_KEY);
    } else {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }

  private clearPersistedUser(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  }

  private clearPersistedToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
  }
}

