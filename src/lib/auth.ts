import { User, Role } from '../types';
import { authApi } from './api';

const TOKEN_KEY = 'vitalsync_jwt_token';
const USER_KEY = 'vitalsync_user_profile';

export const DEFAULT_DOCTOR_USER: User = {
  id: 'doc-101',
  email: 'dr.smith@hospital.com',
  name: 'Dr. Sarah Miller',
  role: 'doctor',
  title: 'Lead Cardiologist',
  specialty: 'Cardiology',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
};

export const DEFAULT_PATIENT_USER: User = {
  id: 'pat-202',
  email: 'sarah.johnson@patient.com',
  name: 'Sarah Johnson',
  role: 'patient',
  title: 'Member since 2022',
  memberSince: '2022',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
};

export const auth = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored user profile', e);
      this.clearToken();
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout(): void {
    this.clearToken();
  },

  getRole(): Role | null {
    const user = this.getUser();
    return user ? user.role : null;
  },

  async login(email: string, password?: string): Promise<User> {
    const { token, user } = await authApi.login(email, password);
    this.setToken(token);
    this.setUser(user);
    return user;
  },
};
