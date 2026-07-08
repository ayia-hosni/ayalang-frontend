import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, AuthUser } from '../models/question.model';

const TOKEN_KEY = 'aya_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = computed(() => !!this.token());
  ready = signal(false);

  constructor(private http: HttpClient) {
    if (this.token()) {
      this.fetchProfile().finally(() => this.ready.set(true));
    } else {
      this.ready.set(true);
    }
  }

  async register(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password }),
    );
    this.applyAuth(res);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }),
    );
    this.applyAuth(res);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  setXP(totalXP: number): void {
    const user = this.currentUser();
    if (user) this.currentUser.set({ ...user, totalXP });
  }

  private async fetchProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<AuthUser>(`${environment.apiUrl}/users/me`),
      );
      this.currentUser.set(user);
    } catch {
      this.logout();
    }
  }

  private applyAuth(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    this.token.set(res.accessToken);
    this.currentUser.set(res.user);
  }
}
