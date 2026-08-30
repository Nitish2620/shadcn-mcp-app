export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  attachment?: MessageAttachment;
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  statusText?: string;
  messages: Message[];
}

export interface ChatListCardProps {
  title?: string;
  chats?: ChatItem[];
  onSelectChat?: (chat: ChatItem) => void;
  onNewChat?: () => void;
}
