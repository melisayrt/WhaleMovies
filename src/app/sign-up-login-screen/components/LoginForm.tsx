'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSuccess: () => void;
  prefillEmail: string;
  prefillPassword: string;
}

// Backend integration point: replace this with real auth API call
const mockLogin = async (username: string, password: string): Promise<boolean> => {
  await new Promise((r) => setTimeout(r, 900));
  return username === 'whalepro' && password === 'cinema2024';
};

export default function LoginForm({ onSuccess, prefillEmail, prefillPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (prefillEmail) setValue('username', prefillEmail);
    if (prefillPassword) setValue('password', prefillPassword);
  }, [prefillEmail, prefillPassword, setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const ok = await mockLogin(data.username, data.password);
      if (ok) {
        toast.success('Welcome back! Loading your collection…', { duration: 2000 });
        setTimeout(onSuccess, 600);
      } else {
        toast.error('Invalid credentials — use the demo account below to sign in');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#e6edf3] mb-1">Welcome back</h2>
        <p className="text-sm text-[#8b949e]">Sign in to your movie universe</p>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="login-username" className="block text-sm font-medium text-[#c9d1d9]">
          Username
        </label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          placeholder="your_username"
          className={`w-full px-4 py-3 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
            errors.username ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
          }`}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 2, message: 'Username must be at least 2 characters' },
          })}
        />
        {errors.username && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <span>⚠</span> {errors.username.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-medium text-[#c9d1d9]">
            Password
          </label>
          <a href="#" className="text-xs text-[#2ea043] hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 pr-12 bg-[#0d1117] border rounded-xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2ea043]/40 focus:border-[#2ea043] ${
              errors.password ? 'border-red-500' : 'border-[#30363d] hover:border-[#484f58]'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 4, message: 'Password must be at least 4 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <span>⚠</span> {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <input
          id="remember-me"
          type="checkbox"
          className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] accent-[#2ea043] cursor-pointer"
          {...register('rememberMe')}
        />
        <label htmlFor="remember-me" className="text-sm text-[#8b949e] cursor-pointer">
          Keep me signed in for 30 days
        </label>
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
            <span>Signing in…</span>
          </>
        ) : (
          <>
            <LogIn size={18} />
            <span>Sign In</span>
          </>
        )}
      </button>
    </form>
  );
}