import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section container">
      <p class="eyebrow">Contact us</p>
      <h1>Say hello</h1>
      <div class="cols">
        <div class="card pad">
          <p class="ok" *ngIf="sent()">Message sent! We usually reply within a day.</p>
          <form *ngIf="!sent()" (ngSubmit)="submit()">
            <label for="cname">Full name</label>
            <input id="cname" name="cname" [(ngModel)]="form.full_name" required>
            <label for="cemail">Email</label>
            <input id="cemail" name="cemail" type="email" [(ngModel)]="form.email" required>
            <label for="cphone">Phone (optional)</label>
            <input id="cphone" name="cphone" [(ngModel)]="form.phone">
            <label for="cmsg">Message</label>
            <textarea id="cmsg" name="cmsg" rows="5" [(ngModel)]="form.message" required></textarea>
            <button class="btn btn-primary" [disabled]="sending()">
              {{ sending() ? 'Sending…' : 'Send message' }}
            </button>
            <p class="err" *ngIf="error()">{{ error() }}</p>
          </form>
        </div>
        <div>
          <h3>Office</h3>
          <p class="muted">Coming soon</p>
          <h3>Phone / WhatsApp</h3>
          <p class="muted">+91 88506 23279</p>
          <h3>Email</h3>
          <p class="muted">majesticmails25&#64;gmail.com</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; margin-top: 24px; }
    @media (max-width: 780px) { .cols { grid-template-columns: 1fr; } }
    .pad { padding: 28px; }
    .ok { background: #eaf6ef; border: 1px solid #bfe3cd; padding: 14px;
      border-radius: 10px; color: var(--pine-deep); }
    .err { color: #b3372f; font-size: 0.88rem; }
  `]
})
export class ContactComponent {
  private api = inject(ApiService);
  form = { full_name: '', email: '', phone: '', message: '' };
  sending = signal(false); sent = signal(false); error = signal('');

  submit() {
    if (!this.form.full_name || !this.form.email || !this.form.message) {
      this.error.set('Name, email and message are required.'); return;
    }
    this.sending.set(true); this.error.set('');
    this.api.sendContact(this.form).subscribe({
      next: () => { this.sent.set(true); this.sending.set(false); },
      error: () => { this.error.set('Could not send — please try again.'); this.sending.set(false); }
    });
  }
}
