'use client';

import React from 'react';
import { PlusCircle, Heart, PlaySquare } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { id: 1, action: 'Added to Library', movie: 'Dune: Part Two', time: '2 hours ago', icon: <PlusCircle size={16} />, color: 'text-[#2ea043]' },
    { id: 2, action: 'Rated 9/10', movie: 'Oppenheimer', time: 'Yesterday', icon: <Heart size={16} />, color: 'text-red-400' },
    { id: 3, action: 'Watched', movie: 'Blade Runner 2049', time: '3 days ago', icon: <PlaySquare size={16} />, color: 'text-blue-400' },
    { id: 4, action: 'Added to Library', movie: 'Poor Things', time: '1 week ago', icon: <PlusCircle size={16} />, color: 'text-[#2ea043]' },
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[#30363d]">
        <h2 className="text-lg font-semibold text-[#e6edf3]">Recent Activity</h2>
      </div>
      
      <div className="divide-y divide-[#30363d]">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#21262d] transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center ${activity.color}`}>
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#e6edf3]">
                  {activity.action} <span className="font-bold text-white">"{activity.movie}"</span>
                </p>
                <p className="text-xs text-[#8b949e] mt-0.5">{activity.time}</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-[#8b949e] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}