'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormProps {
  onSuccess: () => void;
}

// Backend integration point: replace with real registration API
const mockRegister = async (username: string, email: string): Promise<{ ok: boolean; message: string }> => {
  await new Promise((r) => setTimeout(r, 1100));
  if (username === 'whalepro') return { ok: false, message: 'Username already taken — try another' };
  return { ok: true, message: 'Account created successfully!' };
};

const PASSWORD_REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '', agreeTerms: false },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await mockRegister(data.username, data.email);
      if (result.ok) {
        toast.success('Account created! Please sign in to continue.');
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#e6edf3] mb-1">Create your account</h2>
        <p className="text-sm text-[#8b949e]">Join millions of movie enthusiasts</p>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="reg-username" className="block text-sm font-medium text-[#c9d1d9]">
          Username
        </label>
        <input
          id="reg-username"
          type="text"
          autoComplete="username"
          placeholder="choose_a_username"
          className={`w-full px-4 py-3 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
            errors.username ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
          }`}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            maxLength: { value: 20, message: 'Max 20 characters' },
            pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores' },
          })}
        />
        {errors.username && (
          <p className="text-xs text-red-400">⚠ {errors.username.message}</p>
        )}
        <p className="text-xs text-[#484f58]">Letters, numbers, and underscores only</p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-[#c9d1d9]">
          Email address
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-3 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
            errors.email ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
          }`}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-400">⚠ {errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-[#c9d1d9]">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className={`w-full px-4 py-3 pr-12 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
              errors.password ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters required' },
              onChange: (e) => setWatchedPassword(e.target.value),
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">⚠ {errors.password.message}</p>
        )}

        {/* Password strength indicators */}
        {(watchedPassword || passwordValue) && (
          <div className="space-y-1 pt-1">
            {PASSWORD_REQUIREMENTS.map((req) => {
              const passes = req.test(watchedPassword || passwordValue);
              return (
                <div key={`req-${req.label}`} className="flex items-center gap-2">
                  <CheckCircle2
                    size={12}
                    className={passes ? 'text-[#2ea043]' : 'text-[#30363d]'}
                  />
                  <span className={`text-xs ${passes ? 'text-[#2ea043]' : 'text-[#484f58]'}`}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-[#c9d1d9]">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className={`w-full px-4 py-3 pr-12 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
              errors.confirmPassword ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
            }`}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === passwordValue || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">⚠ {errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms */}
      <div className="space-y-1">
        <div className="flex items-start gap-2.5">
          <input
            id="agree-terms"
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-[#30363d] bg-[#0d1117] accent-[#2ea043] cursor-pointer flex-shrink-0"
            {...register('agreeTerms', {
              required: 'You must agree to the terms to continue',
            })}
          />
          <label htmlFor="agree-terms" className="text-sm text-[#8b949e] cursor-pointer leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-[#2ea043] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#2ea043] hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-xs text-red-400">⚠ {errors.agreeTerms.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-[#2ea043] hover:bg-[#3dd68c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#2ea043]/20"
        style={{ minHeight: '48px' }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Creating account…</span>
          </>
        ) : (
          <>
            <UserPlus size={18} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
}