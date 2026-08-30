export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
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
