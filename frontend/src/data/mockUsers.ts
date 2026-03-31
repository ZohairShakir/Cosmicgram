export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isFollowing: boolean;
  isVerified: boolean;
  strikes: number;
}

export const currentUser: User = {
  id: "u1",
  username: "alex_guardian",
  displayName: "Alex Chen",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  bio: "Building safer communities with AI 🛡️\nSoftware Engineer | Cosmicgram Advocate",
  followers: 1243,
  following: 567,
  postsCount: 48,
  isFollowing: false,
  isVerified: true,
  strikes: 0,
};

export const mockUsers: User[] = [
  {
    id: "u2",
    username: "sarah_designs",
    displayName: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "UI/UX Designer 🎨 | Creating inclusive digital spaces",
    followers: 8934,
    following: 432,
    postsCount: 156,
    isFollowing: true,
    isVerified: true,
    strikes: 0,
  },
  {
    id: "u3",
    username: "mike_travels",
    displayName: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Travel photographer 📸 | 30 countries and counting",
    followers: 12400,
    following: 890,
    postsCount: 312,
    isFollowing: false,
    isVerified: false,
    strikes: 0,
  },
  {
    id: "u4",
    username: "emma_cooks",
    displayName: "Emma Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Chef & Food Blogger 🍳 | Recipes from around the world",
    followers: 45200,
    following: 234,
    postsCount: 523,
    isFollowing: true,
    isVerified: true,
    strikes: 0,
  },
  {
    id: "u5",
    username: "james_fit",
    displayName: "James Park",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Fitness Coach 💪 | Healthy mind, healthy body",
    followers: 3200,
    following: 567,
    postsCount: 89,
    isFollowing: false,
    isVerified: false,
    strikes: 0,
  },
  {
    id: "u6",
    username: "luna_art",
    displayName: "Luna Garcia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Digital Artist ✨ | Spreading positivity through art",
    followers: 67800,
    following: 123,
    postsCount: 245,
    isFollowing: true,
    isVerified: true,
    strikes: 0,
  },
  {
    id: "u7",
    username: "tech_raj",
    displayName: "Raj Patel",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "AI Researcher 🤖 | Making tech safer for everyone",
    followers: 5600,
    following: 345,
    postsCount: 67,
    isFollowing: false,
    isVerified: true,
    strikes: 0,
  },
  {
    id: "u8",
    username: "nina_nature",
    displayName: "Nina Tanaka",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Nature Photographer 🌿 | Conservation advocate",
    followers: 23100,
    following: 678,
    postsCount: 198,
    isFollowing: true,
    isVerified: false,
    strikes: 0,
  },
];

export const suggestedUsers = mockUsers.filter((u) => !u.isFollowing).slice(0, 5);
