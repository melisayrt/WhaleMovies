'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  BookMarked,
  Cpu,
  LayoutDashboard,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';
import { CollectionMovie } from '../../../types';
import { toast } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
  collection: CollectionMovie[];
  collectionCount: number;
}

export default function AppShell({ children, collection, collectionCount }: AppShellProps) {
  // Mobilde menü kapalı (false) başlasın
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: 'nav-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { id: 'nav-daily', label: 'Daily Picks', icon: <CalendarDays size={20} />, href: '/daily-picks' },
    { id: 'nav-discover', label: 'Discover', icon: <Compass size={20} />, href: '/discover' },
    { id: 'nav-library', label: 'My Library', icon: <BookMarked size={20} />, href: '/my-library' },
    { id: 'nav-ai', label: 'AI Brain', icon: <Cpu size={20} />, href: '/ai-brain' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden text-[#e6edf3]">
      
      {/* --- MOBİL SİDEBAR (OVERLAY) --- */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Arka plan karartma */}
        <div className="absolute inset-0 bg-black/70" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Menü İçeriği */}
        <aside className={`absolute top-0 left-0 w-[280px] h-full bg-[#161b22] border-r border-[#30363d] p-6 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2ea043] flex items-center justify-center">🐋</div>
              <span className="font-bold">WhaleMovies</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
                  pathname === item.href ? "bg-[#2ea043]/20 text-[#2ea043]" : "text-[#8b949e]"
                }`}
              >
                {item.icon} <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* --- MASAÜSTÜ SİDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#161b22] border-r border-[#30363d] flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#30363d] gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2ea043] flex items-center justify-center">🐋</div>
          <span className="font-bold">WhaleMovies</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                pathname === item.href ? "bg-[#2ea043]/10 text-[#2ea043]" : "text-[#8b949e] hover:bg-[#21262d]"
              }`}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- ANA İÇERİK ALANI --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-[#8b949e]" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block text-sm text-[#484f58]">
              {pathname.split('/').pop()?.toUpperCase()}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Search size={20} className="text-[#8b949e]" />
            <Bell size={20} className="text-[#8b949e]" />
            <div className="w-8 h-8 rounded-full bg-[#2ea043] flex items-center justify-center font-bold text-xs">W</div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0d1117]">
          {children}
        </main>
      </div>
    </div>
  );
}