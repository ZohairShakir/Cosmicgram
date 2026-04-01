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
  isAiGenerated?: boolean;
}

export const mockPosts: Post[] = [];

export const explorePosts: string[] = [];
