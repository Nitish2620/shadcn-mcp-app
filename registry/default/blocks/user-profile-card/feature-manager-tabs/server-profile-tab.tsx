import React from 'react';
import { ShieldAlert, Upload } from 'lucide-react';
import type { UserProfileData } from '../types';

interface ServerProfileTabProps {
  editServerNickname: string;
  setEditServerNickname: (val: string) => void;
  onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profile: UserProfileData;
}

export const ServerProfileTab = React.memo(({
  editServerNickname, setEditServerNickname,
  onAvatarUpload, onBannerUpload,
  profile
}: ServerProfileTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          Server-Specific Profiles
        </h2>
        <p className="text-xs text-slate-400 mt-1">Customize your nickname and avatar specific to your current Discord server.</p>
      </div>

      <div>
        <label htmlFor="server-nickname-input" className="block text-xs font-bold text-slate-300 mb-1">Server Nickname</label>
        <input 
          id="server-nickname-input"
          type="text" 
          value={editServerNickname}
          onChange={(e) => setEditServerNickname(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-300">Server Avatar</span>
          <label htmlFor="server-avatar-upload" className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-900 block focus-within:ring-2 focus-within:ring-purple-500">
            <Upload className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Upload Server Avatar</span>
            <input id="server-avatar-upload" type="file" accept="image/*" onChange={onAvatarUpload} className="sr-only" />
          </label>
        </div>
        <div className="space-y-2">
          <span className="block text-xs font-bold text-slate-300">Server Banner</span>
          <label htmlFor="server-banner-upload" className="border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-900 block focus-within:ring-2 focus-within:ring-pink-500">
            <Upload className="w-5 h-5 text-pink-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Upload Server Banner</span>
            <input id="server-banner-upload" type="file" accept="image/*" onChange={onBannerUpload} className="sr-only" />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">Assigned Server Roles</label>
        <ul className="flex flex-wrap gap-2" aria-label="Assigned Server Roles">
          {profile.serverRoles?.map(role => (
            <li key={role.id} className={`text-xs font-extrabold bg-gradient-to-r ${role.colorGradient} bg-clip-text text-transparent px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900`}>
              {role.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

ServerProfileTab.displayName = 'ServerProfileTab';
export default ServerProfileTab;
