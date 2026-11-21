export interface Collection {
  id: string; slug: string; name: string;
  tagline?: string; description?: string; cover_image?: string;
  trips?: Trip[];
}

export interface ItineraryDay { day: number; title: string; details: string; }

export interface MediaItem {
  id: string; name: string; mimeType: string;
  isGif: boolean; url: string; thumb: string;
}

export interface Trip {
  id: string; collection_id: string; slug: string; title: string;
  summary?: string; description?: string;
  price: number; currency: string;
  duration_days: number; duration_label?: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  location?: string;
  itinerary: ItineraryDay[];
  inclusions: string[]; exclusions: string[];
  upcoming_dates: string[];
  drive_folder_id?: string; cover_image?: string;
  is_featured: boolean; is_active: boolean;
  gallery?: MediaItem[];
  collections?: { name: string; slug: string };
}

export interface BlogPost {
  id: string; slug: string; title: string;
  excerpt?: string; body?: string; cover_image?: string; created_at: string;
}

export interface Booking {
  id?: string; trip_id: string; full_name: string; email: string;
  phone: string; travellers: number; travel_date?: string;
  message?: string; status?: string; created_at?: string;
  trips?: { title: string };
}
