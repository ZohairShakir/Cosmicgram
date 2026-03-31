import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Grid3X3, Film, BookmarkCheck, Settings, BadgeCheck, Shield,
  MapPin, Link as LinkIcon
} from "lucide-react";
import { currentUser, mockUsers } from "@/data/mockUsers";
import { mockPosts } from "@/data/mockPosts";
import { useApp } from "@/context/AppContext";

const Profile = () => {
  const { username } = useParams();
  const { toggleFollow, users } = useApp();
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = !username || username === currentUser.username;
  const profileUser = isOwnProfile
    ? currentUser
    : users.find((u) => u.username === username) || mockUsers.find((u) => u.username === username) || currentUser;

  const userPosts = mockPosts.filter((p) => p.username === profileUser.username);
  const displayPosts = isOwnProfile ? mockPosts.slice(0, 6) : userPosts;

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

  const tabs = [
    { id: "posts", icon: Grid3X3, label: "Posts" },
    { id: "reels", icon: Film, label: "Reels" },
    { id: "saved", icon: BookmarkCheck, label: "Saved" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12 mb-8 px-4">
        <div className="story-ring flex-shrink-0">
          <div className="story-ring-inner">
            <img src={profileUser.avatar} alt={profileUser.username} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{profileUser.username}</h1>
              {profileUser.isVerified && (
                <BadgeCheck className="h-5 w-5 text-primary fill-primary stroke-primary-foreground" />
              )}
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <button className="px-4 py-1.5 bg-secondary rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors">
                    Edit profile
                  </button>
                  <button className="p-1.5 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollow(profileUser.id)}
                    className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      profileUser.isFollowing
                        ? "bg-secondary text-secondary-foreground"
                        : "gradient-primary text-primary-foreground"
                    }`}
                  >
                    {profileUser.isFollowing ? "Following" : "Follow"}
                  </button>
                  <button className="px-4 py-1.5 bg-secondary rounded-lg text-sm font-semibold">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-8 mb-4">
            <div><span className="font-semibold">{profileUser.postsCount}</span> <span className="text-muted-foreground">posts</span></div>
            <div><span className="font-semibold">{formatCount(profileUser.followers)}</span> <span className="text-muted-foreground">followers</span></div>
            <div><span className="font-semibold">{formatCount(profileUser.following)}</span> <span className="text-muted-foreground">following</span></div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-sm">{profileUser.displayName}</p>
            <p className="text-sm whitespace-pre-line">{profileUser.bio}</p>
          </div>

          {isOwnProfile && (
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <Shield className="h-3.5 w-3.5" />
              <span>AI Content Protection Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-border">
        <div className="flex justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-t-2 transition-colors ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {displayPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="aspect-square cursor-pointer overflow-hidden rounded-sm"
          >
            <img src={post.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
