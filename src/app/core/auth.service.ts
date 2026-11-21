import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Thin wrapper over Supabase Auth for the admin panel.
 * Sessions are persisted by supabase-js; token() returns the current
 * access token that the ApiService forwards to the Node API.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
  );

  readonly isLoggedIn = signal(false);
  private accessToken: string | null = null;

  constructor() {
    this.supabase.auth.getSession().then(({ data }) => {
      this.accessToken = data.session?.access_token ?? null;
      this.isLoggedIn.set(!!this.accessToken);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.accessToken = session?.access_token ?? null;
      this.isLoggedIn.set(!!this.accessToken);
    });
  }

  token(): string | null { return this.accessToken; }

  async login(email: string, password: string): Promise<string | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    this.accessToken = data.session?.access_token ?? null;
    this.isLoggedIn.set(true);
    return null;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.accessToken = null;
    this.isLoggedIn.set(false);
  }
}
