export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  image: string;
  isViewed: boolean;
  timestamp: string;
}

export const mockStories: Story[] = [
  {
    id: "s1",
    userId: "u2",
    username: "sarah_designs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1200&fit=crop",
    isViewed: false,
    timestamp: "2h ago",
  },
  {
    id: "s2",
    userId: "u4",
    username: "emma_cooks",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1200&fit=crop",
    isViewed: false,
    timestamp: "4h ago",
  },
  {
    id: "s3",
    userId: "u6",
    username: "luna_art",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1200&fit=crop",
    isViewed: true,
    timestamp: "6h ago",
  },
  {
    id: "s4",
    userId: "u3",
    username: "mike_travels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=1200&fit=crop",
    isViewed: false,
    timestamp: "8h ago",
  },
  {
    id: "s5",
    userId: "u7",
    username: "tech_raj",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1200&fit=crop",
    isViewed: true,
    timestamp: "10h ago",
  },
  {
    id: "s6",
    userId: "u8",
    username: "nina_nature",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1200&fit=crop",
    isViewed: false,
    timestamp: "12h ago",
  },
  {
    id: "s7",
    userId: "u5",
    username: "james_fit",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1200&fit=crop",
    isViewed: true,
    timestamp: "14h ago",
  },
];
