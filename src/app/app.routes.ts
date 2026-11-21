import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'collections', loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent) },
  { path: 'collections/:slug', loadComponent: () => import('./pages/collections/collection-detail.component').then(m => m.CollectionDetailComponent) },
  { path: 'tours/:slug', loadComponent: () => import('./pages/trip-detail/trip-detail.component').then(m => m.TripDetailComponent) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog-list.component').then(m => m.BlogListComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog/blog-detail.component').then(m => m.BlogDetailComponent) },
  { path: 'about-us', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact-us', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'admin/login', loadComponent: () => import('./pages/admin/login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/trips/new', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/trip-form.component').then(m => m.TripFormComponent) },
  { path: 'admin/trips/:id', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/trip-form.component').then(m => m.TripFormComponent) },
  { path: '**', redirectTo: '' }
];
