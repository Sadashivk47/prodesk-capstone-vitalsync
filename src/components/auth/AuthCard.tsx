import React, { useState } from 'react';
import { User, Role } from '../../types';
import { auth } from '../../lib/auth';
import { authApi } from '../../lib/api';
import { Activity, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

interface AuthCardProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('doctor');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await auth.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    setIsLoading(true);

    try {
      const { token, user } = await authApi.register({ email, name, role, specialty });
      auth.setToken(token);
      auth.setUser(user);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/50">
      <main className="w-full max-w-[440px] animate-in fade-in duration-500">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-sm border border-slate-200 flex flex-col items-center">
          {/* Logo & Brand Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-teal-800 text-teal-300 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-teal-900/10">
              <Activity className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">VitalSync</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Clinical Intelligence Platform</p>
          </div>

          {!isRegisterMode ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.smith@hospital.com"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="password">
                    PASSWORD
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-teal-800 hover:underline">
                    FORGOT?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-teal-800 text-white font-semibold text-base rounded-lg hover:bg-teal-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-sm shadow-teal-900/10"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-1">
                  Demo credentials are not stored in the client.
                </p>
                <p className="text-[11px] text-slate-500 text-center">
                  Use the seeded user logins from the deployment notes.
                </p>
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMessage('');
                    }}
                    className="text-teal-800 font-semibold hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Miller or Sarah Johnson"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@hospital.com"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">ACCOUNT ROLE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'doctor'
                        ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" /> Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'patient'
                        ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" /> Patient
                  </button>
                </div>
              </div>

              {role === 'doctor' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">SPECIALTY</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Lead Cardiologist"
                    className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-teal-800 text-white font-semibold text-base rounded-lg hover:bg-teal-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="pt-4 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMessage('');
                    }}
                    className="text-teal-800 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" /> SECURE ACCESS • ISO 27001 CERTIFIED
          </p>
        </div>
      </main>
    </div>
  );
};
