import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="brand">Majestic<span> Miles</span></a>
        <nav [class.open]="menuOpen" (click)="menuOpen = false">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/collections" routerLinkActive="active">Trips</a>
          <a routerLink="/blog" routerLinkActive="active">Travel Guides</a>
          <a routerLink="/about-us" routerLinkActive="active">About</a>
          <a routerLink="/contact-us" routerLinkActive="active">Contact</a>
        </nav>
        <button class="menu-btn" (click)="menuOpen = !menuOpen" aria-label="Toggle menu">☰</button>
      </div>
    </header>

    <main><router-outlet /></main>

    <footer class="footer">
      <div class="container grid grid-3">
        <div>
          <a routerLink="/" class="brand light">Majestic<span> Miles</span></a>
          <p class="muted">From strangers to travel buddies. From trips to lifelong memories.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <a routerLink="/collections">All trips</a><br>
          <a routerLink="/blog">Travel guides</a><br>
          <a routerLink="/about-us">About us</a><br>
          <a routerLink="/contact-us">Contact us</a>
        </div>
        <div>
          <h4>Reach us</h4>
          <p class="muted">Coming soon<br>
          +91 88506 23279<br>majesticmails25&#64;gmail.com</p>
        </div>
      </div>
      <div class="container copyright muted">© {{ year }} Majestic Miles. All rights reserved.</div>
    </footer>
  `,
  styles: [`
    .nav { position: sticky; top: 0; z-index: 50; background: rgba(246,247,244,0.92);
      backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 66px; }
    .brand { font-family: var(--display); font-weight: 800; font-size: 1.35rem; color: var(--ink); }
    .brand span { color: var(--pine); }
    .brand.light { color: #fff; }
    nav { display: flex; gap: 26px; }
    nav a { color: var(--ink); font-weight: 500; font-size: 0.95rem; }
    nav a.active { color: var(--pine); font-weight: 600; }
    .menu-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    @media (max-width: 780px) {
      .menu-btn { display: block; }
      nav { display: none; position: absolute; top: 66px; left: 0; right: 0;
        background: var(--paper); flex-direction: column; padding: 20px;
        border-bottom: 1px solid var(--line); }
      nav.open { display: flex; }
    }
    .footer { background: var(--ink); color: #cfd8d3; padding: 56px 0 0; margin-top: 80px; }
    .footer h4 { color: #fff; }
    .footer a { color: #cfd8d3; line-height: 2; }
    .footer .muted { color: #93a29c; }
    .copyright { border-top: 1px solid #33403b; margin-top: 40px; padding: 18px 20px; font-size: 0.85rem; }
  `]
})
export class AppComponent {
  menuOpen = false;
  year = new Date().getFullYear();
}
