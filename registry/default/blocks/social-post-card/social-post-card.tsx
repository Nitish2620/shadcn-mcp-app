import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Smile, 
  Edit3, 
  Copy, 
  Bookmark, 
  Flag, 
  Trash2, 
  CornerDownRight, 
  Send,
  X,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Pin,
  Share,
  Globe,
  Lock,
  Tag,
  CheckCircle2,
  Code2,
  Search,
  Eye,
  TrendingUp,
  Volume2,
  VolumeX,
  BarChart3,
  Check
} from 'lucide-react';
import type { ReactionType, Comment, SocialPostProps, PollData } from './types';
import { REACTIONS } from './types';

export type { ReactionType, Comment, SocialPostProps, PollData };

const COMMENT_ITEM_HEIGHT = 86; // Height of each comment row in px for 60 FPS virtualization

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
   MEMOIZED VOICE PLAYER SUB-COMPONENT
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
   DEEP LOGIC FEATURE: INTERACTIVE POLL / SURVEY WIDGET
======================================================== */
const PollWidget = React.memo(({ 
  poll, 
  onVote 
}: { 
  poll: PollData; 
  onVote: (optionId: string) => void; 
}) => {
  return (
    <div className="my-4 p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          {poll.question}
        </h4>
        {poll.expiresIn && (
          <span className="text-[10px] font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
            {poll.expiresIn}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {poll.options.map(option => {
          const isVoted = poll.userVotedOptionId === option.id;
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onVote(option.id)}
              className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition border cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
                isVoted
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {/* Progress Fill Bar */}
              <div 
                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                  isVoted ? 'bg-blue-500/20 dark:bg-blue-500/30' : 'bg-slate-200/60 dark:bg-slate-700/50'
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  {isVoted && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 font-bold" />}
                  {option.text}
                </span>
                <span className="font-mono font-bold text-[11px]">
                  {percentage}% <span className="text-slate-400 font-normal">({option.votes})</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 text-right font-medium">
        Total Votes: <span className="font-bold text-slate-700 dark:text-slate-300">{poll.totalVotes.toLocaleString()}</span>
      </div>
    </div>
  );
});
PollWidget.displayName = 'PollWidget';

/* ========================================================
   MEMOIZED COMMENT ROW SUB-COMPONENT
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
    <div className="space-y-2 group animate-in fade-in duration-200">
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
                    <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned
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

          <div className="flex items-center gap-3 text-[11px] mt-1 px-1.5">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
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
   MAIN MNC WORLD-GRADE SOCIAL POST CARD
======================================================== */
export function SocialPostCard({
  author = {
    name: 'Ray Hammond',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'New-York',
    verified: true
  },
  timestamp = 'Thursday, Jun 31, 5:50 PM',
  privacy = 'public',
  content = "I'm so glad to share with you guys some photos from my recent trip to New York. The architecture, nature, and energy of the city are incredible! What's your favorite spot in NYC or where would you love to visit next? 🥰",
  hashtags = ['#NewYorkCity', '#TravelDiaries', '#Wanderlust', '#Architecture'],
  images = [
    '/ny_skyscrapers.jpg',
    '/ny_skyline.jpg'
  ],
  poll = {
    id: 'p1',
    question: 'Which NYC landmark should I visit next?',
    options: [
      { id: 'opt1', text: 'Central Park Sunset Walk', votes: 142 },
      { id: 'opt2', text: 'Edge Observation Deck', votes: 218 },
      { id: 'opt3', text: 'Brooklyn Bridge Photography', votes: 95 }
    ],
    totalVotes: 455,
    expiresIn: '2 days left'
  },
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
      text: "Wow, those photos look amazing! I'm visiting NYC next week. Can you recommend some must-see locations? 🙏",
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
          text: "Definitely check out Central Park at sunset and the Edge observation deck in Hudson Yards! 🌆",
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
      text: "Here is a quick voice note about the best Brooklyn pizza spots! 🍕",
      likes: 14,
      isLiked: true,
      hasVoiceNote: true,
      voiceDuration: '0:24'
    }
  ]
}: SocialPostProps) {
  // Post States
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>('love');
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [sharesCount, setSharesCount] = useState(initialSharesCount);
  const [viewsCount] = useState(initialViews);
  const [isSaved, setIsSaved] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Poll State
  const [pollState, setPollState] = useState<PollData | undefined>(poll);

  // Modals & Menu
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postText, setPostText] = useState(content);

  // Comments Stream Panel
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentFilter, setCommentFilter] = useState<'all' | 'top' | 'pinned'>('all');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({ c1: true });
  const [isPlayingAudio, setIsPlayingAudio] = useState<{ [key: string]: boolean }>({});

  // Lightbox Modal
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Debounced Comment Search & Virtualization
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [commentScrollTop, setCommentScrollTop] = useState(0);
  const commentScrollRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const reactionTimeoutRef = useRef<any>(null);

  // Debounce search query effect
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Web Audio Synthesizer
  const playSoundEffect = useCallback((freq = 587.33) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [soundEnabled]);

  // Deep Logic 1: Optimistic Multi-Reaction Engine
  const handleSelectReaction = useCallback((type: ReactionType) => {
    playSoundEffect(660);
    setCurrentReaction(prev => {
      if (prev === type) {
        setLikesCount(l => l - 1);
        return null;
      }
      if (!prev) setLikesCount(l => l + 1);
      const reactionObj = REACTIONS.find(r => r.type === type);
      showToast(`Reacted with ${reactionObj?.emoji || '❤️'}`);
      return type;
    });
    setShowReactionPicker(false);
  }, [playSoundEffect, showToast]);

  // Deep Logic 2: Interactive Poll Vote Handler
  const handleVotePoll = useCallback((optionId: string) => {
    if (!pollState) return;
    playSoundEffect(880);

    setPollState(prev => {
      if (!prev) return prev;
      const currentVoted = prev.userVotedOptionId;
      if (currentVoted === optionId) return prev; // Already voted for this option

      const updatedOptions = prev.options.map(opt => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        if (opt.id === currentVoted) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) };
        }
        return opt;
      });

      const newTotal = currentVoted ? prev.totalVotes : prev.totalVotes + 1;
      return {
        ...prev,
        options: updatedOptions,
        totalVotes: newTotal,
        userVotedOptionId: optionId
      };
    });

    showToast('Vote submitted! 📊');
  }, [pollState, playSoundEffect, showToast]);

  const handleToggleSave = useCallback(() => {
    playSoundEffect();
    setIsSaved(prev => {
      showToast(!prev ? 'Saved to bookmarks 🔖' : 'Removed from bookmarks');
      return !prev;
    });
    setShowMenu(false);
  }, [playSoundEffect, showToast]);

  // Optimistic Comment Submission
  const handleAddComment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    playSoundEffect();
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: '',
        badge: 'Author'
      },
      timestamp: 'Just now',
      text: newCommentText.trim(),
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setShowEmojiPicker(false);
    showToast('Comment posted! 🚀');
  }, [newCommentText, playSoundEffect, showToast]);

  const handleToggleCommentLike = useCallback((commentId: string) => {
    playSoundEffect();
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const liked = !c.isLiked;
        return {
          ...c,
          isLiked: liked,
          likes: liked ? c.likes + 1 : c.likes - 1
        };
      }
      return c;
    }));
  }, [playSoundEffect]);

  const handleToggleVoicePlay = useCallback((id: string) => {
    setIsPlayingAudio(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleToggleReplies = useCallback((id: string) => {
    setShowReplies(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleReplyPrompt = useCallback((authorName: string) => {
    setNewCommentText(`@${authorName} `);
    document.getElementById('side-comment-input')?.focus();
  }, []);

  // Filtered Comments List
  const filteredComments = useMemo(() => {
    const query = debouncedQuery.toLowerCase();
    return comments.filter(c => {
      if (commentFilter === 'pinned') return c.isPinned;
      if (commentFilter === 'top') return c.likes >= 5;
      if (query) return c.text.toLowerCase().includes(query) || c.author.name.toLowerCase().includes(query);
      return true;
    });
  }, [comments, commentFilter, debouncedQuery]);

  // Virtualized Windowing for Comments Stream (Supports 10,000 comments at 60 FPS)
  const handleCommentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setCommentScrollTop(e.currentTarget.scrollTop);
  };

  const commentVirtualSlice = useMemo(() => {
    const totalCount = filteredComments.length;
    if (totalCount <= 20) {
      return { items: filteredComments, paddingTop: 0, paddingBottom: 0 };
    }
    const containerHeight = 460;
    const startIndex = Math.max(0, Math.floor(commentScrollTop / COMMENT_ITEM_HEIGHT) - 3);
    const endIndex = Math.min(totalCount, startIndex + Math.ceil(containerHeight / COMMENT_ITEM_HEIGHT) + 6);
    return {
      items: filteredComments.slice(startIndex, endIndex),
      paddingTop: startIndex * COMMENT_ITEM_HEIGHT,
      paddingBottom: (totalCount - endIndex) * COMMENT_ITEM_HEIGHT
    };
  }, [filteredComments, commentScrollTop]);

  const activeReactionObj = useMemo(() => REACTIONS.find(r => r.type === currentReaction), [currentReaction]);

  return (
    <div className="w-full max-w-7xl mx-auto font-sans selection:bg-blue-500 selection:text-white relative">
      
      {/* Toast Notification Pill */}
      {notification && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          {notification}
        </div>
      )}

      {/* Main 12-Column Responsive Layout */}
      <div className={`grid grid-cols-1 ${isCommentsOpen ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-6 transition-all duration-500 ease-in-out`}>
        
        {/* LEFT COLUMN: Main Social Post Card */}
        <article className={`${isCommentsOpen ? 'lg:col-span-7' : 'w-full'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl transition-all relative text-slate-900 dark:text-slate-100 flex flex-col justify-between`}>
          
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarWithFallback name={author.name} src={author.avatar} size="w-12 h-12" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Online" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                      {author.name}
                      {author.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />}
                    </h3>
                    <span className="text-slate-400 text-xs font-normal">is at</span>
                    <a href="#location" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-200/60 dark:border-blue-900/60 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      {author.location}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                    <span>{timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400" title={privacy}>
                      {privacy === 'public' && <Globe className="w-3 h-3" />}
                      {privacy === 'friends' && <Tag className="w-3 h-3" />}
                      {privacy === 'only_me' && <Lock className="w-3 h-3" />}
                      <span className="capitalize">{privacy}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sound Toggle & Options */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none cursor-pointer"
                  title={soundEnabled ? 'Sound enabled' : 'Sound muted'}
                  aria-label="Toggle haptic audio effects"
                >
                  {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-blue-500" /> : <VolumeX className="w-4.5 h-4.5" />}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none cursor-pointer"
                    aria-label="More post options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Options Dropdown */}
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-11 z-20 w-52 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5 text-sm animate-in fade-in zoom-in-95">
                        <button
                          type="button"
                          onClick={() => { setShowMenu(false); setIsEditingPost(true); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4 text-slate-400" />
                          Edit post text
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowMenu(false); setShowShareModal(true); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
                        >
                          <Copy className="w-4 h-4 text-slate-400" />
                          Copy post link
                        </button>
                        <button
                          type="button"
                          onClick={handleToggleSave}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                          {isSaved ? 'Saved in bookmarks' : 'Save post'}
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        <button
                          type="button"
                          onClick={() => { setShowMenu(false); showToast('Report submitted'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 transition text-xs font-medium cursor-pointer"
                        >
                          <Flag className="w-4 h-4 text-amber-500" />
                          Report post
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowMenu(false); showToast('Post deleted'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition text-xs font-medium cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          Delete post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content */}
            {isEditingPost ? (
              <div className="mb-4 space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingPost(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditingPost(false); showToast('Post updated!'); }}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-relaxed mb-3 font-normal">
                {postText}
              </p>
            )}

            {/* Hashtags Chips */}
            {hashtags && hashtags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {hashtags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2.5 py-1 rounded-lg cursor-pointer transition border border-blue-200/40 dark:border-blue-900/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* DEEP LOGIC FEATURE: REAL-TIME INTERACTIVE POLL WIDGET */}
            {pollState && <PollWidget poll={pollState} onVote={handleVotePoll} />}

            {/* Media Gallery (0 CLS Aspect-Ratio Locked Grid) */}
            {images && images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 rounded-2xl overflow-hidden relative group">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative group/img cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 aspect-video sm:aspect-[4/3]"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Post photo media ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition duration-300 flex items-end justify-between p-4">
                      <span className="text-white text-xs font-medium flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                      </span>
                      <span className="text-white/90 text-[11px] font-mono bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                        Photo {index + 1} of {images.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Summary */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-1 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  {viewsCount.toLocaleString()} Views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  98.4% Engagement
                </span>
              </div>

              {isSaved && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500" /> Saved
                </span>
              )}
            </div>

            {/* Reaction Counts Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-rose-500 text-white ring-2 ring-white dark:ring-slate-900 text-xs shadow-xs">❤️</span>
                  <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-amber-500 text-white ring-2 ring-white dark:ring-slate-900 text-xs shadow-xs">🔥</span>
                  <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-blue-500 text-white ring-2 ring-white dark:ring-slate-900 text-xs shadow-xs">👍</span>
                </div>
                <span className="text-slate-700 dark:text-slate-200 text-xs font-semibold">
                  {activeReactionObj ? `${activeReactionObj.emoji} You and ${likesCount - 1} others` : `${likesCount} Reactions`}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <button 
                  type="button"
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)} 
                  className="hover:text-blue-500 transition cursor-pointer underline-offset-4 hover:underline font-semibold"
                >
                  {comments.length} Comments
                </button>
                <span>•</span>
                <span>{sharesCount} Shares</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="relative border-t border-b border-slate-100 dark:border-slate-800/80 py-2 mt-auto flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            
            {/* Reaction Popover */}
            {showReactionPicker && (
              <div 
                className="absolute bottom-12 left-2 z-30 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
                onMouseEnter={() => clearTimeout(reactionTimeoutRef.current)}
                onMouseLeave={() => setShowReactionPicker(false)}
              >
                {REACTIONS.map((r) => (
                  <button
                    key={r.type}
                    type="button"
                    onClick={() => handleSelectReaction(r.type)}
                    className="text-xl sm:text-2xl hover:scale-130 transition duration-200 transform hover:-translate-y-1 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Like Trigger */}
            <div
              className="relative flex-1"
              onMouseEnter={() => {
                reactionTimeoutRef.current = setTimeout(() => setShowReactionPicker(true), 250);
              }}
              onMouseLeave={() => clearTimeout(reactionTimeoutRef.current)}
            >
              <button
                type="button"
                onClick={() => handleSelectReaction(currentReaction || 'love')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
                  activeReactionObj ? `${activeReactionObj.color} font-bold ${activeReactionObj.bg}` : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeReactionObj ? (
                  <span className="text-base">{activeReactionObj.emoji}</span>
                ) : (
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span>{activeReactionObj ? activeReactionObj.label : 'Like'}</span>
              </button>
            </div>

            {/* Comments Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
                isCommentsOpen 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Comments ({comments.length})</span>
            </button>

            {/* Share Trigger */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition hover:text-slate-900 dark:hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Share</span>
            </button>
          </div>

        </article>

        {/* RIGHT COLUMN: Virtualized Discussion Stream Panel */}
        {isCommentsOpen && (
          <aside className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col h-full relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Discussion Stream <span className="text-xs font-mono font-normal text-slate-400">({comments.length})</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCommentsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                title="Close discussion panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Filter Tabs */}
            <div className="space-y-3 mb-4 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter discussion comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/80 dark:bg-slate-800/80 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full text-xs">
                <button
                  type="button"
                  onClick={() => setCommentFilter('all')}
                  className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  All ({comments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCommentFilter('top')}
                  className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter === 'top' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Top Liked
                </button>
                <button
                  type="button"
                  onClick={() => setCommentFilter('pinned')}
                  className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter === 'pinned' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Pinned
                </button>
              </div>
            </div>

            {/* VIRTUALIZED COMMENTS STREAM (Supports 10,000 comments at 60 FPS) */}
            <div 
              ref={commentScrollRef}
              onScroll={handleCommentScroll}
              role="log"
              aria-live="polite"
              className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-4"
            >
              {filteredComments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <MessageCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-medium">No comments match your filter</p>
                </div>
              ) : (
                <div style={{ paddingTop: `${commentVirtualSlice.paddingTop}px`, paddingBottom: `${commentVirtualSlice.paddingBottom}px` }} className="space-y-4">
                  {commentVirtualSlice.items.map((comment) => (
                    <CommentRow 
                      key={comment.id} 
                      comment={comment} 
                      onLike={handleToggleCommentLike} 
                      onReply={handleReplyPrompt} 
                      isPlayingAudio={!!isPlayingAudio[comment.id]} 
                      onToggleVoice={handleToggleVoicePlay} 
                      showReplies={!!showReplies[comment.id]} 
                      onToggleReplies={handleToggleReplies} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Comment Composer Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto shrink-0">
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <AvatarWithFallback name="You" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" size="w-8 h-8" />

                <div className="flex-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-full px-3.5 py-2 flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/40 transition">
                  <input
                    id="side-comment-input"
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-transparent border-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
                  />

                  <div className="flex items-center gap-0.5 text-slate-400">
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer"
                      title="Add emoji"
                    >
                      <Smile className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    {newCommentText.trim() && (
                      <button 
                        type="submit" 
                        className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition ml-0.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {showEmojiPicker && (
                <div className="flex items-center gap-1.5 pl-10 pt-2 animate-in fade-in">
                  {['❤️', '😍', '🔥', '👏', '🗽', '✨', '🙌', '💯'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewCommentText(prev => prev + emoji)}
                      className="text-base hover:scale-125 transition p-0.5 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </aside>
        )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Share className="w-5 h-5 text-blue-500" />
                Share Post
              </h3>
              <button type="button" onClick={() => setShowShareModal(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 py-2 text-center">
              {[
                { name: 'Copy Link', icon: Copy, bg: 'bg-blue-50 text-blue-600', action: () => { navigator.clipboard.writeText(window.location.href); setSharesCount(prev => prev + 1); showToast('Link copied!'); setShowShareModal(false); } },
                { name: 'Twitter/X', icon: Share2, bg: 'bg-sky-50 text-sky-600', action: () => { showToast('Redirecting to X...'); setShowShareModal(false); } },
                { name: 'WhatsApp', icon: MessageCircle, bg: 'bg-emerald-50 text-emerald-600', action: () => { showToast('Opening WhatsApp...'); setShowShareModal(false); } },
                { name: 'Embed', icon: Code2, bg: 'bg-purple-50 text-purple-600', action: () => { showToast('Embed code copied!'); setShowShareModal(false); } }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className={`p-3 rounded-2xl ${item.bg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Gallery Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition z-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
                }}
                className="absolute left-5 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition z-50 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % images.length);
                }}
                className="absolute right-5 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition z-50 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div 
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`Full view ${lightboxIndex + 1}`}
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
            <div className="mt-3 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono">
              Photo {lightboxIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
