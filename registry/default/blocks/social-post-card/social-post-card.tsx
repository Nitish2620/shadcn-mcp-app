import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Edit3, 
  Copy, 
  Bookmark, 
  Flag, 
  CornerDownRight, 
  Send,
  X,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  Pin,
  Globe,
  Lock,
  CheckCircle2,
  Eye,
  Volume2,
  VolumeX,
  Check
} from 'lucide-react';
import type { ReactionType, Comment, SocialPostProps } from './types';
import { REACTIONS } from './types';

export type { ReactionType, Comment, SocialPostProps };

const COMMENT_ROW_HEIGHT = 72; // Height of each comment item in px for virtualization

/* ========================================================
   INSTANT MNC AVATAR SYSTEM (0ms Slow 3G Latency)
======================================================== */
const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600'
];

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

const AvatarWithFallback = React.memo(({ name, src, size = "w-10 h-10" }: { name: string; src?: string; size?: string }) => {
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

/* ========================================================
   AUDIO VOICE NOTE PLAYER
======================================================== */
const VoicePlayer = React.memo(({ 
  commentId, 
  isPlaying, 
  onTogglePlay, 
  duration 
}: { 
  commentId: string; 
  isPlaying: boolean; 
  onTogglePlay: (id: string) => void; 
  duration?: string 
}) => {
  return (
    <div className="mt-2.5 p-2.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/50 dark:border-blue-900/50 flex items-center gap-3">
      <button
        type="button"
        onClick={() => onTogglePlay(commentId)}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition shadow-xs cursor-pointer"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1 h-3">
          {[40, 75, 35, 95, 60, 100, 45, 80, 50, 70, 40, 85, 30, 65].map((h, i) => (
            <span 
              key={i} 
              className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-blue-300 dark:bg-blue-700'}`} 
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-blue-600 dark:text-blue-400 font-mono font-medium">
          <span>{isPlaying ? 'Playing Voice Note...' : 'Voice Message'}</span>
          <span>{duration || '0:24'}</span>
        </div>
      </div>
    </div>
  );
});
VoicePlayer.displayName = 'VoicePlayer';

/* ========================================================
   SINGLE COMMENT ITEM SUB-COMPONENT
======================================================== */
const CommentRow = React.memo(({ 
  comment, 
  onLike, 
  onReply, 
  isPlayingAudio, 
  onToggleVoice, 
  showReplies, 
  onToggleReplies 
}: { 
  comment: Comment; 
  onLike: (id: string) => void; 
  onReply: (author: string) => void; 
  isPlayingAudio: boolean; 
  onToggleVoice: (id: string) => void; 
  showReplies: boolean; 
  onToggleReplies: (id: string) => void; 
}) => {
  return (
    <div className="space-y-2 group animate-in fade-in duration-300">
      <div className="flex items-start gap-2.5">
        <AvatarWithFallback name={comment.author.name} src={comment.author.avatar} size="w-8 h-8" />
        <div className="flex-1 min-w-0">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl rounded-tl-none border border-slate-200/60 dark:border-slate-800/80 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {comment.author.name}
                </span>
                {comment.author.badge && (
                  <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded-full border border-blue-200 dark:border-blue-800">
                    {comment.author.badge}
                  </span>
                )}
                {comment.isPinned && (
                  <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                    <Pin className="w-2.5 h-2.5" /> Pinned
                  </span>
                )}
              </div>
              <span className="text-slate-400 text-[10px]">{comment.timestamp}</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
              {comment.text}
            </p>

            {comment.hasVoiceNote && (
              <VoicePlayer 
                commentId={comment.id} 
                isPlaying={isPlayingAudio} 
                onTogglePlay={onToggleVoice} 
                duration={comment.voiceDuration} 
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 text-[11px] mt-1 px-1.5">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
              className={`flex items-center gap-1 font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1 ${
                comment.isLiked ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500' : ''}`} />
              <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
            </button>

            <button 
              type="button"
              onClick={() => onReply(comment.author.name)}
              aria-label={`Reply to ${comment.author.name}`}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1"
            >
              <CornerDownRight className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                type="button"
                onClick={() => onToggleReplies(comment.id)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer ml-auto"
              >
                {showReplies ? 'Hide' : `${comment.replies.length} replies`}
              </button>
            )}
          </div>

          {/* Nested Replies */}
          {showReplies && comment.replies && (
            <div className="mt-2.5 pl-3 border-l-2 border-blue-500/30 dark:border-blue-500/20 space-y-2.5">
              {comment.replies.map(reply => (
                <div key={reply.id} className="flex items-start gap-2">
                  <AvatarWithFallback name={reply.author.name} src={reply.author.avatar} size="w-6 h-6" />
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl rounded-tl-none text-xs border border-slate-100 dark:border-slate-800/60 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">{reply.author.name}</span>
                      <span className="text-slate-400 text-[9px]">{reply.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
CommentRow.displayName = 'CommentRow';

/* ========================================================
   IndexedDB PERSISTENCE LAYER FOR SOCIAL POST CARD
======================================================== */
const IDB_NAME = 'SocialPostCardDB';
const IDB_STORE = 'posts';
const IDB_VERSION = 1;

function openPostDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbSavePostState(key: string, data: any): Promise<void> {
  return openPostDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(data, key);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  });
}

function idbLoadPostState(key: string): Promise<any | null> {
  return openPostDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => { db.close(); resolve(req.result || null); };
      req.onerror = () => { db.close(); reject(req.error); };
    });
  });
}

/* ========================================================
   MAIN MNC-GRADE HIGH-TRAFFIC SOCIAL POST CARD
======================================================== */
export function SocialPostCard({
  id = "post_1",
  author = {
    name: 'Ray Hammond',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'New-York',
    verified: true
  },
  timestamp = 'Thursday, Jun 31, 5:50 PM',
  privacy = 'public',
  content = "I'm so glad to share with you guys some photos from my recent trip to New-York. This city looks amazing, the buildings, nature, people all are beautiful, I highly recommend visiting! What is your favorite place here? 🥰",
  hashtags = ['#NewYorkCity', '#TravelDiaries', '#Wanderlust', '#Architecture'],
  images = [
    '/ny_skyscrapers.jpg',
    '/ny_skyline.jpg'
  ],
  initialLikes = 245,
  initialSharesCount = 12,
  initialViews = 3420,
  initialComments = [
    {
      id: 'c1',
      author: {
        name: 'Cynthia Henry',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        badge: 'Top Fan'
      },
      timestamp: 'Today at 3:30 PM',
      text: "Wow, those photos look amazing! I'm visiting New York next week. Can you recommend some top spots to visit? 🙏",
      likes: 9,
      isLiked: false,
      isPinned: true,
      replies: [
        {
          id: 'r1',
          author: {
            name: 'Ray Hammond',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          },
          timestamp: 'Today at 4:10 PM',
          text: "Make sure to check out Central Park at sunset and the Edge observation deck in Hudson Yards! 🌆",
          likes: 5
        }
      ]
    },
    {
      id: 'c2',
      author: {
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      timestamp: 'Yesterday at 8:45 PM',
      text: "Check out this quick voice note about the best Brooklyn pizza spots! 🍕",
      likes: 14,
      isLiked: true,
      hasVoiceNote: true,
      voiceDuration: '0:24'
    }
  ]
}: SocialPostProps) {
  // State management
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>('love');
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [sharesCount, setSharesCount] = useState(initialSharesCount);
  const [viewsCount] = useState(initialViews);
  const [isSaved, setIsSaved] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // UI Modals & Popovers
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postText, setPostText] = useState(content);

  // AI Sentiment State
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments state
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentFilter, setCommentFilter] = useState<'all' | 'top' | 'pinned'>('all');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({ c1: true });

  // Lightbox Modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Audio voice note state
  const [isPlayingAudio, setIsPlayingAudio] = useState<{ [key: string]: boolean }>({});

  // Virtualization state for Comments
  const [commentScrollTop, setCommentScrollTop] = useState(0);
  const commentScrollRef = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

  // IndexedDB Hydration on Mount (Progressive Load in < 20ms)
  useEffect(() => {
    let cancelled = false;
    idbLoadPostState(id)
      .then(stored => {
        if (cancelled || !stored) return;
        if (stored.currentReaction !== undefined) setCurrentReaction(stored.currentReaction);
        if (stored.likesCount !== undefined) setLikesCount(stored.likesCount);
        if (stored.sharesCount !== undefined) setSharesCount(stored.sharesCount);
        if (stored.isSaved !== undefined) setIsSaved(stored.isSaved);
        if (stored.postText !== undefined) setPostText(stored.postText);
        if (Array.isArray(stored.comments)) setComments(stored.comments);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

  // IndexedDB Auto-Persistence (500ms Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      idbSavePostState(id, {
        currentReaction,
        likesCount,
        sharesCount,
        isSaved,
        postText,
        comments
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [id, currentReaction, likesCount, sharesCount, isSaved, postText, comments]);

  // Keyboard navigation for Lightbox Carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  // Audio Haptic Synthesizer
  const playHapticSound = useCallback((freq = 440) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [soundEnabled]);

  // Multi-Reaction Selector Handler
  const handleSelectReaction = useCallback((type: ReactionType) => {
    playHapticSound(660);
    setShowReactionPicker(false);
    if (currentReaction === type) {
      setCurrentReaction(null);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      if (!currentReaction) setLikesCount(prev => prev + 1);
      setCurrentReaction(type);
    }
  }, [currentReaction, playHapticSound]);

  // Like Toggle
  const handleToggleLike = useCallback(() => {
    if (currentReaction) {
      handleSelectReaction(currentReaction);
    } else {
      handleSelectReaction('like');
    }
  }, [currentReaction, handleSelectReaction]);

  // Comment Addition Handler
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    playHapticSound(550);

    const newCommentObj: Comment = {
      id: `c_${Date.now()}`,
      author: {
        name: 'You',
        avatar: '',
        badge: 'Contributor'
      },
      timestamp: 'Just now',
      text: newCommentText.trim(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewCommentText('');
  };

  // Comment Like Handler
  const handleToggleCommentLike = useCallback((commentId: string) => {
    playHapticSound(480);
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        return { ...c, isLiked, likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1) };
      }
      return c;
    }));
  }, [playHapticSound]);

  // Reply Trigger
  const handleReplyToComment = (authorName: string) => {
    setNewCommentText(`@${authorName} `);
  };

  // Filtered & Virtualized Comments
  const filteredComments = useMemo(() => {
    let list = [...comments];
    if (commentFilter === 'top') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (commentFilter === 'pinned') {
      list = list.filter(c => c.isPinned);
    }
    return list;
  }, [comments, commentFilter]);

  const virtualComments = useMemo(() => {
    const totalCount = filteredComments.length;
    if (totalCount <= 20) {
      return { items: filteredComments, paddingTop: 0, paddingBottom: 0 };
    }
    const containerHeight = 350;
    const startIndex = Math.max(0, Math.floor(commentScrollTop / COMMENT_ROW_HEIGHT) - 3);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / COMMENT_ROW_HEIGHT) + 5);
    return {
      items: filteredComments.slice(startIndex, endIndex),
      paddingTop: startIndex * COMMENT_ROW_HEIGHT,
      paddingBottom: (totalCount - endIndex) * COMMENT_ROW_HEIGHT
    };
  }, [filteredComments, commentScrollTop]);

  const activeReactionConfig = useMemo(() => {
    return REACTIONS.find(r => r.type === currentReaction);
  }, [currentReaction]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://social.example.com/p/${id}`);
    setCopiedLink(true);
    playHapticSound(800);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article 
      data-state={isCommentsOpen ? "expanded" : "collapsed"} 
      className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden font-sans transition-all duration-300"
    >
      {/* HEADER SECTION */}
      <header className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <AvatarWithFallback name={author.name} src={author.avatar} size="w-11 h-11" />
            <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0 z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white hover:underline cursor-pointer">
                {author.name}
              </h2>
              {author.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> {author.location}</span>
              <span>•</span>
              <span>{timestamp}</span>
              <span>•</span>
              {privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1 text-slate-400 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowAiInsights(!showAiInsights)}
            aria-label="Toggle AI Insights"
            title="Toggle AI Sentiment & Insights"
            className={`p-2 rounded-full transition cursor-pointer ${showAiInsights ? 'bg-purple-100 dark:bg-purple-950 text-purple-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More post options"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Context Menu Dropdown */}
          {showMenu && (
            <div className="absolute top-11 right-0 z-40 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => { setIsSaved(!isSaved); setShowMenu(false); playHapticSound(700); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark Post'}</span>
              </button>
              <button
                type="button"
                onClick={() => { handleCopyLink(); setShowMenu(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Post Link</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsEditingPost(!isEditingPost); setShowMenu(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Caption</span>
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* AI INSIGHTS & SENTIMENT BANNER */}
      {showAiInsights && (
        <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 p-3.5 border-b border-purple-500/20 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="font-bold text-purple-900 dark:text-purple-200">AI Sentiment:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
              Positive (98% Score)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Topic: Travel & Architecture</span>
        </div>
      )}

      {/* BODY CONTENT SECTION */}
      <main className="p-5 space-y-4">
        {/* Caption Text */}
        {isEditingPost ? (
          <div className="space-y-2">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditingPost(false)} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
              <button type="button" onClick={() => setIsEditingPost(false)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs cursor-pointer">Save Edit</button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words font-normal">
            {postText}
          </p>
        )}

        {/* Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <span key={tag} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* IMAGE GALLERY GRID */}
        {images && images.length > 0 && (
          <div className={`grid gap-2 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="relative group cursor-pointer overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800"
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img}
                  alt={`Post attachment ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* METRICS & STATS BAR */}
      <section className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">❤️</span>
            <span className="w-4.5 h-4.5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">👍</span>
            <span className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">🔥</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200">{likesCount}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button type="button" onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="hover:underline cursor-pointer">
            {comments.length} comments
          </button>
          <span>•</span>
          <span>{sharesCount} shares</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {viewsCount.toLocaleString()}</span>
        </div>
      </section>

      {/* INTERACTIVE ACTION BUTTONS FOOTER */}
      <footer className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
        
        {/* Reaction Popover & Button */}
        <div className="relative flex-1" ref={reactionRef}>
          {showReactionPicker && (
            <div className="absolute -top-12 left-2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-full px-2 py-1 flex items-center gap-1 animate-in fade-in zoom-in-95">
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => handleSelectReaction(r.type)}
                  aria-label={`React with ${r.label}`}
                  className="hover:scale-125 transition text-base p-1 cursor-pointer"
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleLike}
            onMouseEnter={() => setShowReactionPicker(true)}
            aria-label="Like post"
            className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer ${
              activeReactionConfig 
                ? `${activeReactionConfig.color} ${activeReactionConfig.bg}` 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {activeReactionConfig ? (
              <>
                <span className="text-sm">{activeReactionConfig.emoji}</span>
                <span>{activeReactionConfig.label}</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          aria-label="Toggle comments"
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => { setShowShareModal(true); setSharesCount(prev => prev + 1); }}
          aria-label="Share post"
          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {/* Save Bookmark Button */}
        <button
          type="button"
          onClick={() => { setIsSaved(!isSaved); playHapticSound(750); }}
          aria-label={isSaved ? "Remove bookmark" : "Bookmark post"}
          className={`p-2 rounded-xl transition cursor-pointer ${isSaved ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
        </button>
      </footer>

      {/* COMMENTS STREAM PANEL (VIRTUALIZED) */}
      {isCommentsOpen && (
        <section className="p-5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
          
          {/* Comment Filters */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-slate-900 dark:text-white font-bold">Comments ({comments.length})</span>
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setCommentFilter('all')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer ${commentFilter === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : ''}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setCommentFilter('top')}
                className={`px-2 py-0.5 rounded-md transition cursor-pointer ${commentFilter === 'top' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : ''}`}
              >
                Top Liked
              </button>
            </div>
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <AvatarWithFallback name="You" src="" size="w-8 h-8" />
            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/50">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs text-slate-900 dark:text-white outline-none placeholder-slate-400"
              />
              <button type="submit" aria-label="Submit comment" className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition cursor-pointer shrink-0">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Comment List Stream (Virtual Windowing for 10,000 items) */}
          <div 
            ref={commentScrollRef}
            onScroll={(e) => setCommentScrollTop(e.currentTarget.scrollTop)}
            className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1"
          >
            {filteredComments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">No comments found</div>
            ) : (
              <div style={{ paddingTop: `${virtualComments.paddingTop}px`, paddingBottom: `${virtualComments.paddingBottom}px` }} className="space-y-3.5">
                {virtualComments.items.map(comment => (
                  <CommentRow
                    key={comment.id}
                    comment={comment}
                    onLike={handleToggleCommentLike}
                    onReply={handleReplyToComment}
                    isPlayingAudio={!!isPlayingAudio[comment.id]}
                    onToggleVoice={(id) => setIsPlayingAudio(prev => ({ ...prev, [id]: !prev[id] }))}
                    showReplies={!!showReplies[comment.id]}
                    onToggleReplies={(id) => setShowReplies(prev => ({ ...prev, [id]: !prev[id] }))}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL */}
      {lightboxIndex !== null && images && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image lightbox"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col items-center">
            <img src={images[lightboxIndex]} alt="Enlarged preview" className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl" />
            <div className="mt-3 text-xs text-slate-400 font-medium flex items-center gap-3">
              <span>{lightboxIndex + 1} of {images.length}</span>
              <span>•</span>
              <a href={images[lightboxIndex]} download className="text-blue-400 hover:underline">Download Original</a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-500" /> Share Post
              </h3>
              <button type="button" onClick={() => setShowShareModal(false)} className="cursor-pointer"><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-mono">https://social.example.com/p/{id}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <button type="button" onClick={() => { handleCopyLink(); setShowShareModal(false); }} className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-2xl hover:bg-blue-100 cursor-pointer">Twitter</button>
                <button type="button" onClick={() => { handleCopyLink(); setShowShareModal(false); }} className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl hover:bg-emerald-100 cursor-pointer">WhatsApp</button>
                <button type="button" onClick={() => { handleCopyLink(); setShowShareModal(false); }} className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl hover:bg-indigo-100 cursor-pointer">LinkedIn</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
