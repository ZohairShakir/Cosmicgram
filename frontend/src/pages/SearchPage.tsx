import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, Shield, TrendingUp } from "lucide-react";
import { mockUsers } from "@/data/mockUsers";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const SearchPage = () => {
  const { toggleFollow, users } = useApp();
  const [query, setQuery] = useState("");

  const allUsers = mockUsers.map((mu) => users.find((u) => u.id === mu.id) || mu);
  const filtered = query
    ? allUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.displayName.toLowerCase().includes(query.toLowerCase())
      )
    : allUsers;

  return (
    <div className="max-w-xl mx-auto">
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-secondary rounded-xl py-3 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
          >
            <Link to={`/profile/${user.username}`}>
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${user.username}`} className="text-sm font-semibold block truncate">
                {user.username}
              </Link>
              <span className="text-xs text-muted-foreground truncate block">{user.displayName} · {user.followers.toLocaleString()} followers</span>
            </div>
            <button
              onClick={() => toggleFollow(user.id)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                user.isFollowing
                  ? "bg-secondary text-secondary-foreground"
                  : "gradient-primary text-primary-foreground"
              }`}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No users found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
