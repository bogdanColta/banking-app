import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }

  setToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey) || null;
    }
    return null;
  }

  clearToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
