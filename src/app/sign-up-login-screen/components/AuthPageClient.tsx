'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import FeatureShowcase from './FeatureShowcase';
import BrandPanel from './BrandPanel';
import DemoCredentialBox from './DemoCredentials';

export type AuthTab = 'login' | 'register';

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [prefillPassword, setPrefillPassword] = useState('');
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Backend integration point: set auth token/session cookie here
    router.push('/discover');
  };

  const handleDemoFill = (email: string, password: string) => {
    setPrefillEmail(email);
    setPrefillPassword(password);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left brand panel — hidden on mobile */}
      <BrandPanel />

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-16 bg-[#0d1117] relative">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ea043] to-[#3dd68c] flex items-center justify-center text-xl shadow-lg">
            🐋
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#e6edf3]">
            WhaleMovies Pro
          </span>
        </div>

        <div className="w-full max-w-md animate-scaleIn">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-[#161b22] border border-[#30363d] p-1 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'login' ?'bg-[#2ea043] text-white shadow-md' :'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'register' ?'bg-[#2ea043] text-white shadow-md' :'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form area */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
            {activeTab === 'login' ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                prefillEmail={prefillEmail}
                prefillPassword={prefillPassword}
              />
            ) : (
              <RegisterForm onSuccess={() => setActiveTab('login')} />
            )}
          </div>

          {/* Demo credentials */}
          <DemoCredentialBox onFill={handleDemoFill} />
        </div>

        {/* Feature showcase below form */}
        <div className="w-full max-w-md mt-10">
          <FeatureShowcase />
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-[#484f58] text-center">
          By signing in you agree to our{' '}
          <a href="#" className="text-[#2ea043] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#2ea043] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}