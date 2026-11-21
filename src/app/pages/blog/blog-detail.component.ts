import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { BlogPost } from '../../core/models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="section container narrow" *ngIf="post() as p">
      <a routerLink="/blog" class="crumb">← All guides</a>
      <p class="eyebrow">{{ p.created_at | date:'d MMMM y' }}</p>
      <h1>{{ p.title }}</h1>
      <p class="lead muted">{{ p.excerpt }}</p>
      <p class="body">{{ p.body }}</p>
    </article>
  `,
  styles: [`
    .narrow { max-width: 760px; }
    .crumb { display: inline-block; margin-bottom: 16px; font-weight: 500; }
    .lead { font-size: 1.1rem; }
    .body { font-size: 1.02rem; white-space: pre-line; }
  `]
})
export class BlogDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  post = signal<BlogPost | null>(null);
  ngOnInit() {
    this.route.paramMap.subscribe(p =>
      this.api.getBlog(p.get('slug')!).subscribe(b => this.post.set(b)));
  }
}
