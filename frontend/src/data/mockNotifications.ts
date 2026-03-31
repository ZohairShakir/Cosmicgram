export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "ai_moderation";
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  postImage?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    userId: "u2",
    username: "sarah_designs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    text: "liked your post",
    timestamp: "5m ago",
    isRead: false,
    postImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop",
  },
  {
    id: "n2",
    type: "comment",
    userId: "u4",
    username: "emma_cooks",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    text: 'commented: "This is incredible work! 🎉"',
    timestamp: "20m ago",
    isRead: false,
    postImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop",
  },
  {
    id: "n3",
    type: "follow",
    userId: "u5",
    username: "james_fit",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "started following you",
    timestamp: "1h ago",
    isRead: false,
  },
  {
    id: "n4",
    type: "ai_moderation",
    userId: "system",
    username: "Cosmicgram AI",
    avatar: "",
    text: "flagged and removed a comment containing hate speech on your post",
    timestamp: "2h ago",
    isRead: true,
    postImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop",
  },
  {
    id: "n5",
    type: "like",
    userId: "u6",
    username: "luna_art",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    text: "liked your post",
    timestamp: "3h ago",
    isRead: true,
    postImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop",
  },
  {
    id: "n6",
    type: "mention",
    userId: "u7",
    username: "tech_raj",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    text: "mentioned you in a comment",
    timestamp: "5h ago",
    isRead: true,
  },
  {
    id: "n7",
    type: "ai_moderation",
    userId: "system",
    username: "Cosmicgram AI",
    avatar: "",
    text: "detected and blocked targeted harassment in your DMs",
    timestamp: "1d ago",
    isRead: true,
  },
];
