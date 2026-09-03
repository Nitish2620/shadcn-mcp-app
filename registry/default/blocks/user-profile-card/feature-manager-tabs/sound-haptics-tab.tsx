import React from 'react';
import { Music } from 'lucide-react';

interface SoundHapticsTabProps {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const SoundHapticsTab = React.memo(({
  soundEnabled, setSoundEnabled
}: SoundHapticsTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-pink-400" />
          Sound &amp; Haptic Effects
        </h2>
        <p className="text-xs text-slate-400 mt-1">Manage web audio oscillators and haptic audio synthesis response.</p>
      </div>

      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="font-bold text-xs text-white">Audio Synthesis Sound Effects</div>
          <div className="text-[10px] text-slate-400">Play web audio frequency tones on interaction</div>
        </div>
        <button 
          type="button" 
          role="switch"
          aria-checked={soundEnabled}
          aria-label="Toggle Audio Synthesis Sound Effects"
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            soundEnabled ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {soundEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
});

SoundHapticsTab.displayName = 'SoundHapticsTab';
export default SoundHapticsTab;
