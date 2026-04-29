'use client';

import React, { useState } from 'react';
import { Copy, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface DemoCredentialBoxProps {
  onFill: (email: string, password: string) => void;
}

const DEMO_ACCOUNTS = [
  { role: 'Movie Enthusiast', username: 'whalepro', password: 'cinema2024', movies: 42 },
  { role: 'Casual Viewer', username: 'filmfan_kai', password: 'watchlist99', movies: 11 },
];

export default function DemoCredentialBox({ onFill }: DemoCredentialBoxProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (value: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Could not copy — try manually');
    }
  };

  return (
    <div className="mt-5 bg-[#161b22] border border-[#2ea043]/30 rounded-2xl p-5 relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2ea043]/60 to-transparent" />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-[#2ea043]/20 flex items-center justify-center">
          <Zap size={14} className="text-[#2ea043]" />
        </div>
        <span className="text-sm font-semibold text-[#e6edf3]">Demo Accounts</span>
        <span className="text-xs text-[#484f58] ml-auto">Click a row to autofill</span>
      </div>

      <div className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <div
            key={`demo-${account.username}`}
            className="group flex items-center gap-3 p-3 bg-[#0d1117] border border-[#30363d] hover:border-[#2ea043]/50 rounded-xl cursor-pointer transition-all duration-200"
            onClick={() => {
              onFill(account.username, account.password);
              toast.success(`Demo account "${account.username}" autofilled — click Sign In`);
            }}
          >
            {/* Role badge */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#2ea043]/10 flex items-center justify-center text-sm">
                🐋
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#e6edf3]">{account.role}</span>
                <span className="text-xs text-[#484f58]">·</span>
                <span className="text-xs text-[#484f58]">{account.movies} movies</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs font-mono text-[#2ea043]">{account.username}</span>
                <span className="text-xs text-[#30363d]">|</span>
                <span className="text-xs font-mono text-[#8b949e]">{account.password}</span>
              </div>
            </div>

            {/* Copy buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(account.username, `${account.username}-user`);
                }}
                className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#484f58] hover:text-[#8b949e] transition-colors"
                title="Copy username"
              >
                {copiedField === `${account.username}-user` ? (
                  <Check size={12} className="text-[#2ea043]" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(account.password, `${account.username}-pass`);
                }}
                className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#484f58] hover:text-[#8b949e] transition-colors"
                title="Copy password"
              >
                {copiedField === `${account.username}-pass` ? (
                  <Check size={12} className="text-[#2ea043]" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            </div>

            {/* Use arrow */}
            <div className="text-[#484f58] group-hover:text-[#2ea043] transition-colors text-xs font-medium">
              Use →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}