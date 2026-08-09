import React, { useState } from 'react';
import { User, Role } from '../../types';
import { auth } from '../../lib/auth';
import { authApi } from '../../lib/api';
import { Activity, ShieldCheck, UserCheck, Stethoscope, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthCardProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('doctor');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

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
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);

    try {
      const { token, user } = await authApi.register({ email, password, name, role, specialty });
      auth.setToken(token);
      auth.setUser(user);
      onLoginSuccess(user);
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const displayMsg = Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg || err.message || 'Registration failed';
      setErrorMessage(displayMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f3eb] text-[#1d1c17] font-sans-dm relative">
      {/* Back to Landing Page link */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-[#444655] hover:text-[#2849e5] bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-[#e7e2da] shadow-xs hover:border-[#a2baff] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      )}

      <main className="w-full max-w-[460px] animate-in fade-in duration-500 my-10">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-warm-xl border border-[#e7e2da] flex flex-col items-center">
          {/* Logo & Brand Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#2849e5] text-white rounded-2xl flex items-center justify-center mb-3 shadow-warm-md">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif-display font-normal text-[#1d1c17] tracking-tight">VitalSync</h1>
            <p className="text-xs text-[#444655] mt-1 font-medium tracking-wide uppercase">Clinical Intelligence Platform</p>
          </div>

          {!isRegisterMode ? (
            /* Sign In Form */
            <>
              <form onSubmit={handleSignIn} className="w-full space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider" htmlFor="email">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.smith@hospital.com"
                    required
                    className="w-full h-12 px-4 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all placeholder:text-[#757687]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider" htmlFor="password">
                      PASSWORD
                    </label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-[#2849e5] hover:underline">
                      FORGOT?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-12 px-4 pr-11 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all placeholder:text-[#757687]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757687] hover:text-[#2849e5] transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-[#ba1a1a] bg-[#ffdad6]/50 p-3 rounded-xl border border-[#ffdad6]">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#2849e5] hover:bg-[#4865ff] text-white font-medium text-base rounded-full active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-warm-md"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="pt-3 border-t border-[#e7e2da]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#757687] text-center mb-1">
                    Demo credentials are pre-seeded in the database.
                  </p>
                  <p className="text-[11px] text-[#444655] text-center">
                    Use doctor or patient email logins to access your environment.
                  </p>
                </div>
              </form>

              {/* Register link */}
              <div className="pt-4 text-center w-full">
                <p className="text-sm text-[#444655]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMessage('');
                    }}
                    className="text-[#2849e5] font-semibold hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </p>
              </div>
            </>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Miller or Sarah Johnson"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@hospital.com"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider">PASSWORD (MIN 8 CHARS)</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757687] hover:text-[#2849e5] transition-colors cursor-pointer"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider">ACCOUNT ROLE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'doctor'
                        ? 'bg-[#2849e5] text-white border-[#2849e5] shadow-xs'
                        : 'bg-[#f8f3eb] text-[#444655] border-[#e7e2da] hover:bg-[#f2ede5]'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" /> Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'patient'
                        ? 'bg-[#2849e5] text-white border-[#2849e5] shadow-xs'
                        : 'bg-[#f8f3eb] text-[#444655] border-[#e7e2da] hover:bg-[#f2ede5]'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" /> Patient
                  </button>
                </div>
              </div>

              {role === 'doctor' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#444655] uppercase tracking-wider">SPECIALTY</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Lead Cardiologist"
                    className="w-full h-12 px-4 rounded-xl border border-[#e7e2da] bg-[#f8f3eb]/40 text-[#1d1c17] text-sm focus:ring-2 focus:ring-[#2849e5] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="text-xs text-[#ba1a1a] bg-[#ffdad6]/50 p-3 rounded-xl border border-[#ffdad6]">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2849e5] hover:bg-[#4865ff] text-white font-medium text-base rounded-full active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-warm-md"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="pt-4 text-center">
                <p className="text-sm text-[#444655]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMessage('');
                    }}
                    className="text-[#2849e5] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-[#757687] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2849e5]" /> SECURE ACCESS • ISO 27001 CERTIFIED
          </p>
        </div>
      </main>
    </div>
  );
};

