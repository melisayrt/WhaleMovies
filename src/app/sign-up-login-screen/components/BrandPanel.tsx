'use client';

import React from 'react';

const GENRE_PILLS = [
  '🎬 Action',
  '🧠 Sci-Fi',
  '😂 Comedy',
  '😱 Horror',
  '❤️ Romance',
  '🕵️ Mystery',
  '🎭 Drama',
  '✨ Fantasy',
];

const STATS = [
  { value: '850K+', label: 'Movies catalogued' },
  { value: '12M+', label: 'Collections created' },
  { value: '99%', label: 'Match accuracy' },
];

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] 2xl:w-[640px] flex-col justify-between bg-gradient-to-br from-[#161b22] via-[#0d1117] to-[#0a0f14] border-r border-[#30363d] px-12 py-14 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2ea043] opacity-[0.04] blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-[#2ea043] opacity-[0.06] blur-3xl" />
      </div>
      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2ea043] to-[#3dd68c] flex items-center justify-center text-2xl shadow-xl">
          🐋
        </div>
        <div>
          <span className="text-xl font-bold text-[#e6edf3] tracking-tight">
            WhaleMovies
          </span>
          <span className="ml-1.5 text-xs font-semibold bg-[#2ea043]/20 text-[#2ea043] px-2 py-0.5 rounded-full border border-[#2ea043]/30">
            PRO
          </span>
        </div>
      </div>
      {/* Hero copy */}
      <div className="relative z-10">
        <h1 className="text-4xl xl:text-5xl font-bold text-[#e6edf3] leading-tight mb-6">
          Your personal{' '}
          <span className="text-[#2ea043]">cinema</span>
          {' '}universe
        </h1>
        <p className="text-[#8b949e] text-lg leading-relaxed mb-10">
          Discover films you&apos;ll love, build your watchlist, and let our AI
          match your mood to the perfect movie — every single day.
        </p>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {GENRE_PILLS?.map((pill) => (
            <span
              key={`pill-${pill}`}
              className="px-3 py-1.5 text-sm font-medium bg-[#21262d] border border-[#30363d] rounded-full text-[#8b949e] hover:border-[#2ea043] hover:text-[#2ea043] transition-colors duration-200 cursor-default"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {STATS?.map((stat) => (
            <div
              key={`stat-${stat?.label}`}
              className="bg-[#21262d]/60 border border-[#30363d] rounded-xl p-4"
            >
              <div className="text-2xl font-bold text-[#2ea043] font-tabular">
                {stat?.value}
              </div>
              <div className="text-xs text-[#484f58] mt-1 font-medium">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom testimonial */}
      <div className="relative z-10 bg-[#21262d]/60 border border-[#30363d] rounded-xl p-5">
        <p className="text-sm text-[#8b949e] italic leading-relaxed">
          &quot;WhaleMovies completely changed how I discover films. The AI recommendations
          are eerily accurate — it knew I&apos;d love Annihilation before I did.&quot;
        </p>
        <div className="flex items-center gap-2.5 mt-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2ea043] to-[#3dd68c] flex items-center justify-center text-sm font-bold text-white">
            M
          </div>
          <div>
            <div className="text-xs font-semibold text-[#e6edf3]">Marcus Reeves</div>
            <div className="text-xs text-[#484f58]">Film critic · 847 movies collected</div>
          </div>
          <div className="ml-auto flex gap-0.5">
            {[1,2,3,4,5]?.map((s) => (
              <span key={`star-${s}`} className="text-[#2ea043] text-xs">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}