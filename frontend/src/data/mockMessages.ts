export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    userId: "u2",
    username: "sarah_designs",
    displayName: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    lastMessage: "That design looks amazing! 🎨",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: "m1", senderId: "u2", text: "Hey! How's the new feature coming along?", timestamp: "10:30 AM", isRead: true },
      { id: "m2", senderId: "u1", text: "It's going great! The AI moderation is working really well", timestamp: "10:32 AM", isRead: true },
      { id: "m3", senderId: "u2", text: "That's awesome! Can you show me a demo?", timestamp: "10:35 AM", isRead: true },
      { id: "m4", senderId: "u1", text: "Sure! I'll send you the link", timestamp: "10:36 AM", isRead: true },
      { id: "m5", senderId: "u2", text: "That design looks amazing! 🎨", timestamp: "10:40 AM", isRead: false },
    ],
  },
  {
    id: "conv2",
    userId: "u7",
    username: "tech_raj",
    displayName: "Raj Patel",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    lastMessage: "The model accuracy is now at 99.5%! 🚀",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: "m6", senderId: "u7", text: "Hey, the new hate speech detection model is ready", timestamp: "9:00 AM", isRead: true },
      { id: "m7", senderId: "u1", text: "Great! What's the accuracy?", timestamp: "9:05 AM", isRead: true },
      { id: "m8", senderId: "u7", text: "The model accuracy is now at 99.5%! 🚀", timestamp: "9:10 AM", isRead: true },
    ],
  },
  {
    id: "conv3",
    userId: "u6",
    username: "luna_art",
    displayName: "Luna Garcia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    lastMessage: "I'd love to collaborate on the safety campaign!",
    lastMessageTime: "3h ago",
    unreadCount: 1,
    isOnline: false,
    messages: [
      { id: "m9", senderId: "u6", text: "Hi Alex! Love what you're doing with Cosmicgram", timestamp: "Yesterday", isRead: true },
      { id: "m10", senderId: "u1", text: "Thanks Luna! Your art is incredible too", timestamp: "Yesterday", isRead: true },
      { id: "m11", senderId: "u6", text: "I'd love to collaborate on the safety campaign!", timestamp: "3h ago", isRead: false },
    ],
  },
  {
    id: "conv4",
    userId: "u4",
    username: "emma_cooks",
    displayName: "Emma Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "The recipe is ready! 🍕",
    lastMessageTime: "1d ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: "m12", senderId: "u4", text: "The recipe is ready! 🍕", timestamp: "Yesterday", isRead: true },
    ],
  },
];
