import { useApp } from "@/context/AppContext";
import { BadgeCheck } from "lucide-react";
import { currentUser, suggestedUsers } from "@/data/mockUsers";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const RightSidebar = () => {
  const { toggleFollow, users } = useApp();

  return (
    <aside className="hidden xl:block w-[320px] flex-shrink-0 sticky top-0 h-screen py-8 px-4">
      {/* Mini Profile */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile">
          <img src={currentUser.avatar} alt={currentUser.username} className="w-12 h-12 rounded-full object-cover" />
        </Link>
        <div className="flex-1">
          <Link to="/profile" className="text-sm font-semibold flex items-center gap-1">
            {currentUser.username}
            {currentUser.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary fill-primary stroke-primary-foreground" />}
          </Link>
          <span className="text-sm text-muted-foreground">{currentUser.displayName}</span>
        </div>
      </div>

      {/* AI Safety Banner */}
      <div className="gradient-ai rounded-xl p-4 mb-6 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5" />
          <span className="font-semibold text-sm">AI Content Shield</span>
        </div>
        <p className="text-xs opacity-90">
          Our AI actively monitors for hate speech, offensive content, targeted harassment, and harmful symbols. Your feed is protected.
        </p>
        <div className="flex gap-2 mt-3">
          <div className="bg-primary-foreground/20 rounded-lg px-2 py-1 text-xs">99.2% accuracy</div>
          <div className="bg-primary-foreground/20 rounded-lg px-2 py-1 text-xs">Real-time</div>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground">Suggested for you</span>
          <button className="text-xs font-semibold text-foreground">See All</button>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user) => {
            const u = users.find((x) => x.id === user.id) || user;
            return (
              <div key={u.id} className="flex items-center gap-3">
                <Link to={`/profile/${u.username}`}>
                  <img src={u.avatar} alt={u.username} className="w-9 h-9 rounded-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${u.username}`} className="text-sm font-semibold flex items-center gap-1 truncate">
                    {u.username}
                    {u.isVerified && <BadgeCheck className="h-3 w-3 text-primary fill-primary stroke-primary-foreground flex-shrink-0" />}
                  </Link>
                  <span className="text-xs text-muted-foreground truncate block">{u.displayName}</span>
                </div>
                <button
                  onClick={() => toggleFollow(u.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                    u.isFollowing
                      ? "bg-secondary text-secondary-foreground"
                      : "text-primary hover:text-primary/80"
                  }`}
                >
                  {u.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/50 mt-8"><p className="text-xs text-muted-foreground/50 mt-8">© 2026 Cosmicgram · AI-Powered Safety</p></p>
    </aside>
  );
};

export default RightSidebar;
