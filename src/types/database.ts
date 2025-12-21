export type UserRole = 'patient' | 'provider';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  profile_id: string;
  specialties: string[];
  credentials: string;
  bio: string;
  licensed_states: string[];
  years_experience: number;
  is_accepting_patients: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  type: 'initial_consultation' | 'follow_up' | 'medication_management' | 'therapy';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  video_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  mood: number; // 1-10
  energy: number; // 1-10
  sleep_quality: number; // 1-10
  anxiety: number; // 1-10
  stress: number; // 1-10
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'exercise' | 'guide';
  content: string;
  url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
}
