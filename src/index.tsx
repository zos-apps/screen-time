import { useState } from 'react';

interface ScreenTimeProps {
  onClose: () => void;
}

interface AppUsage {
  name: string;
  icon: string;
  time: number;
  category: string;
}

const mockUsage: AppUsage[] = [
  { name: 'Terminal', icon: '⬛', time: 180, category: 'Development' },
  { name: 'Browser', icon: '🌐', time: 120, category: 'Productivity' },
  { name: 'Notes', icon: '📝', time: 45, category: 'Productivity' },
  { name: 'Music', icon: '🎵', time: 90, category: 'Entertainment' },
  { name: 'Messages', icon: '💬', time: 30, category: 'Social' },
];

const ScreenTime: React.FC<ScreenTimeProps> = ({ onClose: _onClose }) => {
  const [period, setPeriod] = useState<'today' | 'week'>('today');
  const [usage] = useState(mockUsage);

  const totalTime = usage.reduce((sum, app) => sum + app.time, 0);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const getPercentage = (time: number) => (time / totalTime) * 100;

  const categories = [...new Set(usage.map(u => u.category))];
  const categoryTotals = categories.map(cat => ({
    name: cat,
    time: usage.filter(u => u.category === cat).reduce((sum, u) => sum + u.time, 0),
  }));

  return (
    <div className="h-full flex flex-col bg-[#1c1c1e] text-white">
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2 mb-4">
          {(['today', 'week'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${period === p ? 'bg-blue-600' : 'bg-white/10'}
              `}
            >
              {p === 'today' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="text-4xl font-light">{formatTime(totalTime)}</div>
          <div className="text-sm text-white/50 mt-1">Total Screen Time</div>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <h3 className="text-xs font-semibold text-white/50 uppercase mb-3">By Category</h3>
        <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-white/10">
          {categoryTotals.map((cat, i) => (
            <div
              key={cat.name}
              style={{ width: `${getPercentage(cat.time)}%` }}
              className={`h-full ${
                i === 0 ? 'bg-blue-500' :
                i === 1 ? 'bg-green-500' :
                i === 2 ? 'bg-purple-500' : 'bg-orange-500'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/60">
          {categoryTotals.map((cat, i) => (
            <span key={cat.name} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-blue-500' :
                i === 1 ? 'bg-green-500' :
                i === 2 ? 'bg-purple-500' : 'bg-orange-500'
              }`} />
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-xs font-semibold text-white/50 uppercase mb-3">Most Used</h3>
        <div className="space-y-3">
          {usage.sort((a, b) => b.time - a.time).map(app => (
            <div key={app.name} className="flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{app.name}</span>
                  <span className="text-white/60">{formatTime(app.time)}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${getPercentage(app.time)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
          Set App Limits
        </button>
      </div>
    </div>
  );
};

export default ScreenTime;
