import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Collection, Trip, BlogPost, Booking } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = environment.apiUrl;

  /* ---- public ---- */
  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.base}/collections`);
  }
  getCollection(slug: string): Observable<Collection> {
    return this.http.get<Collection>(`${this.base}/collections/${slug}`);
  }
  getTrips(opts: { featured?: boolean; sort?: string } = {}): Observable<Trip[]> {
    const params: string[] = [];
    if (opts.featured) params.push('featured=true');
    if (opts.sort) params.push(`sort=${opts.sort}`);
    return this.http.get<Trip[]>(`${this.base}/trips${params.length ? '?' + params.join('&') : ''}`);
  }
  getTrip(slug: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.base}/trips/${slug}`);
  }
  getBlogs(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.base}/blogs`);
  }
  getBlog(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blogs/${slug}`);
  }
  createBooking(b: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, b);
  }
  sendContact(payload: { full_name: string; email: string; phone?: string; message: string }) {
    return this.http.post(`${this.base}/contact`, payload);
  }

  /* ---- admin (Bearer token) ---- */
  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.token() ?? ''}` });
  }
  adminGetTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.base}/admin/trips`, { headers: this.authHeaders() });
  }
  adminCreateTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(`${this.base}/admin/trips`, trip, { headers: this.authHeaders() });
  }
  adminUpdateTrip(id: string, trip: Partial<Trip>): Observable<Trip> {
    return this.http.put<Trip>(`${this.base}/admin/trips/${id}`, trip, { headers: this.authHeaders() });
  }
  adminDeleteTrip(id: string) {
    return this.http.delete(`${this.base}/admin/trips/${id}`, { headers: this.authHeaders() });
  }
  adminGetBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/admin/bookings`, { headers: this.authHeaders() });
  }
  adminUpdateBooking(id: string, status: string) {
    return this.http.put(`${this.base}/admin/bookings/${id}`, { status }, { headers: this.authHeaders() });
  }
}
