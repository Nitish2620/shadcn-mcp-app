import React, { useState, useMemo } from 'react';

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getGradient(name: string): string {
  const gradients = ['from-red-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-500'];
  const index = name.length % gradients.length;
  return gradients[index];
}

export const AvatarWithFallback = React.memo(({ name, src, size = "w-11 h-11" }: { name: string; src?: string; size?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const gradient = useMemo(() => getGradient(name), [name]);

  if (!src || imgError) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 shadow-2xs`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setImgError(true)}
      className={`${size} rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0`}
    />
  );
});
AvatarWithFallback.displayName = 'AvatarWithFallback';
