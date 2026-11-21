import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section container wrap">
      <div class="card pad">
        <p class="eyebrow">Admin</p>
        <h1>Sign in</h1>
        <p class="muted">Use the admin account created in your Supabase dashboard.</p>
        <form (ngSubmit)="submit()">
          <label for="aemail">Email</label>
          <input id="aemail" name="aemail" type="email" [(ngModel)]="email" required>
          <label for="apass">Password</label>
          <input id="apass" name="apass" type="password" [(ngModel)]="password" required>
          <button class="btn btn-primary" [disabled]="busy()">
            {{ busy() ? 'Signing in…' : 'Sign in' }}
          </button>
          <p class="err" *ngIf="error()">{{ error() }}</p>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .wrap { max-width: 440px; }
    .pad { padding: 32px; }
    .err { color: #b3372f; font-size: 0.88rem; }
  `]
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = ''; password = '';
  busy = signal(false); error = signal('');

  async submit() {
    this.busy.set(true); this.error.set('');
    const err = await this.auth.login(this.email, this.password);
    this.busy.set(false);
    if (err) this.error.set(err);
    else this.router.navigate(['/admin']);
  }
}
