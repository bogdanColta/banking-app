import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;

  setToken(token: string): void {
    console.log('setToken', token);
    this.authToken = token;
    console.log('setToken1', this.authToken);
  }

  getToken(): string | null {
    console.log('getToken', this.authToken);
    return this.authToken;
  }

  clearToken(): void {
    this.authToken = null;
  }
}
