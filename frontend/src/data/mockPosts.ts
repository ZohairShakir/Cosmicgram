export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  aiLabel?: 'Not Hateful' | 'Hateful';
  aiConfidence?: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  location?: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
  aiSafe: boolean;
  aiLabel?: 'Not Hateful' | 'Hateful';
  aiConfidence?: number;
}

export const mockPosts: Post[] = [
  {
    id: "p1",
    userId: "u2",
    username: "sarah_designs",
    displayName: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
    caption: "Building the future of safe online spaces 🛡️✨ Every line of code matters when it comes to protecting communities. #Cosmicgram #TechForGood #AI",
    likes: 1243,
    comments: [
      { id: "c1", userId: "u3", username: "mike_travels", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", text: "This is amazing work! Keep it up! 🔥", timestamp: "2h ago", likes: 12 },
      { id: "c2", userId: "u4", username: "emma_cooks", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", text: "So important for our digital future", timestamp: "1h ago", likes: 8 },
    ],
    timestamp: "3h ago",
    isLiked: false,
    isSaved: false,
    aiSafe: true,
  },
  {
    id: "p2",
    userId: "u4",
    username: "emma_cooks",
    displayName: "Emma Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
    caption: "Sunday brunch perfection 🥐☕ Sharing recipes that bring people together, not apart. Food is a universal language of love!",
    likes: 5621,
    comments: [
      { id: "c3", userId: "u6", username: "luna_art", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", text: "This looks absolutely delicious! 😍", timestamp: "30m ago", likes: 23 },
    ],
    timestamp: "5h ago",
    isLiked: true,
    isSaved: true,
    aiSafe: true,
  },
  {
    id: "p3",
    userId: "u6",
    username: "luna_art",
    displayName: "Luna Garcia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=800&fit=crop",
    caption: "Art has the power to heal and unite 🎨 Today's piece is inspired by the beauty of diversity. Every color belongs on the canvas. #DigitalArt #Unity",
    likes: 12890,
    comments: [
      { id: "c4", userId: "u7", username: "tech_raj", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", text: "The colors are incredible! What software do you use?", timestamp: "1h ago", likes: 5 },
      { id: "c5", userId: "u2", username: "sarah_designs", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", text: "This is breathtaking Luna! 💜", timestamp: "45m ago", likes: 18 },
    ],
    timestamp: "8h ago",
    isLiked: false,
    isSaved: false,
    aiSafe: true,
  },
  {
    id: "p4",
    userId: "u3",
    username: "mike_travels",
    displayName: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=800&fit=crop",
    caption: "Finding peace in the temples of Kyoto 🏯 Travel teaches us that despite our differences, we share the same sky. #Travel #Kyoto #Peace",
    likes: 3456,
    comments: [
      { id: "c6", userId: "u8", username: "nina_nature", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", text: "I was there last spring! Such a magical place 🌸", timestamp: "2h ago", likes: 7 },
    ],
    timestamp: "12h ago",
    isLiked: true,
    isSaved: false,
    aiSafe: true,
  },
  {
    id: "p5",
    userId: "u7",
    username: "tech_raj",
    displayName: "Raj Patel",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=800&fit=crop",
    caption: "Our AI moderation model just hit 99.2% accuracy in detecting hate speech! 🤖🛡️ Technology should protect, not harm. #AIforGood #Cosmicgram",
    likes: 2134,
    comments: [
      { id: "c7", userId: "u2", username: "sarah_designs", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", text: "This is groundbreaking! Can't wait to see the paper 📝", timestamp: "4h ago", likes: 15 },
      { id: "c8", userId: "u5", username: "james_fit", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", text: "The future of social media right here", timestamp: "3h ago", likes: 9 },
    ],
    timestamp: "1d ago",
    isLiked: false,
    isSaved: true,
    aiSafe: true,
  },
  {
    id: "p6",
    userId: "u8",
    username: "nina_nature",
    displayName: "Nina Tanaka",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    isVerified: false,
    location: "Yellowstone National Park",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
    caption: "Nature doesn't discriminate. The forest welcomes everyone 🌲🌍 Let's protect our planet together. #Nature #Conservation #EarthLove",
    likes: 8765,
    comments: [],
    timestamp: "1d ago",
    isLiked: false,
    isSaved: false,
    aiSafe: true,
  },
];

export const explorePosts = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop",
];
