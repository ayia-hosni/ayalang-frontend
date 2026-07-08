import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideMic } from '@lucide/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  imports: [FormsModule, LucideMic],
  templateUrl: './auth-view.component.html',
})
export class AuthViewComponent {
  mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private auth: AuthService) {}

  toggleMode() {
    this.mode.update((m) => (m === 'login' ? 'register' : 'login'));
    this.errorMessage.set(null);
  }

  async submit() {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      if (this.mode() === 'login') {
        await this.auth.login(this.email, this.password);
      } else {
        await this.auth.register(this.email, this.password);
      }
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message ?? 'Something went wrong. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
