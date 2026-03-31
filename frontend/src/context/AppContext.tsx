import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockPosts, type Post, type Comment } from "@/data/mockPosts";
import { mockUsers, currentUser, type User } from "@/data/mockUsers";
import { mockNotifications, type Notification } from "@/data/mockNotifications";

interface AppContextType {
  posts: Post[];
  users: User[];
  currentUser: User;
  notifications: Notification[];
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string, aiLabel?: 'Not Hateful' | 'Hateful', aiConfidence?: number) => void;
  addPost: (post: Omit<Post, "id" | "userId" | "username" | "displayName" | "avatar" | "isVerified" | "likes" | "comments" | "isLiked" | "isSaved">) => void;
  toggleFollow: (userId: string) => void;
  unreadNotifications: number;
  addStrike: () => void;
  isBlocked: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [myUser, setMyUser] = useState<User>(currentUser);
  const [notifications] = useState<Notification[]>(mockNotifications);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  }, []);

  const addComment = useCallback((postId: string, text: string, aiLabel?: 'Not Hateful' | 'Hateful', aiConfidence?: number) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: myUser.id,
      username: myUser.username,
      avatar: myUser.avatar,
      text,
      timestamp: "Just now",
      likes: 0,
      aiLabel,
      aiConfidence,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
  }, [myUser]);

  const addPost = useCallback(
    (partial: Omit<Post, "id" | "userId" | "username" | "displayName" | "avatar" | "isVerified" | "likes" | "comments" | "isLiked" | "isSaved">) => {
      const newPost: Post = {
        ...partial,
        id: `p_${Date.now()}`,
        userId: myUser.id,
        username: myUser.username,
        displayName: myUser.displayName,
        avatar: myUser.avatar,
        isVerified: myUser.isVerified,
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [myUser]
  );

  const toggleFollow = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u))
    );
  }, []);

  const addStrike = useCallback(() => {
    setMyUser((prev) => ({ ...prev, strikes: (prev.strikes || 0) + 1 }));
  }, []);

  const isBlocked = (myUser.strikes || 0) >= 3;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{ posts, users, currentUser: myUser, notifications, toggleLike, toggleSave, addComment, addPost, toggleFollow, unreadNotifications, addStrike, isBlocked }}
    >
      {children}
    </AppContext.Provider>
  );
};
