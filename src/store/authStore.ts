import {create} from 'zustand';
import {supabase} from '../lib/supabase';
import type {Profile, UserRole} from '../types/database';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,

  loadUser: async () => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (user) {
        const {data: profile} = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({user, profile, isAuthenticated: true, loading: false});
      } else {
        set({user: null, profile: null, isAuthenticated: false, loading: false});
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({user: null, profile: null, isAuthenticated: false, loading: false});
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const {data: profile} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({user: data.user, profile, isAuthenticated: true});
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const {data: profile} = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          })
          .select()
          .single();

        set({user: data.user, profile, isAuthenticated: true});
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({user: null, profile: null, isAuthenticated: false});
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const {profile} = get();
      if (!profile) throw new Error('No profile found');

      const {data, error} = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      set({profile: data});
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
}));
