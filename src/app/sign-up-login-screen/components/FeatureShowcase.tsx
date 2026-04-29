import React from 'react';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Daily Picks',
    description: '5 personalized recommendations refresh every day based on your taste',
  },
  {
    icon: '🧠',
    title: 'AI Brain',
    description: 'Mood-based suggestions — tell it how you feel, get the perfect film',
  },
  {
    icon: '📊',
    title: 'Collection Stats',
    description: 'Track genres, ratings, and trends across your entire watchlist',
  },
];

export default function FeatureShowcase() {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-5 text-center">
        Everything you need to find your next film
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {FEATURES?.map((feature) => (
          <div
            key={`feature-${feature?.title}`}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xl">
              {feature?.icon}
            </div>
            <div className="text-xs font-semibold text-[#e6edf3]">{feature?.title}</div>
            <div className="text-xs text-[#484f58] leading-relaxed">{feature?.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}