'use client';

import React from 'react';
import { Film, Star, Clock, Trophy } from 'lucide-react';

export default function StatGrid() {
  const stats = [
    { id: 1, label: 'Total Watched', value: '128', icon: <Film size={20} />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 2, label: 'Average Rating', value: '8.4', icon: <Star size={20} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { id: 3, label: 'Watch Time (hrs)', value: '342', icon: <Clock size={20} />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { id: 4, label: 'Favorite Genre', value: 'Sci-Fi', icon: <Trophy size={20} />, color: 'text-[#2ea043]', bg: 'bg-[#2ea043]/10', border: 'border-[#2ea043]/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 hover:border-[#484f58] transition-colors duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#8b949e] text-sm font-medium">{stat.label}</span>
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
              {stat.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-[#e6edf3]">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}