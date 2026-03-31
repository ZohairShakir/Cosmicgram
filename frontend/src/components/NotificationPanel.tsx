import { useApp } from "@/context/AppContext";
import { Shield, Heart, MessageSquare, UserPlus, AtSign } from "lucide-react";

const NotificationPanel = () => {
  const { notifications } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="h-4 w-4 text-destructive" />;
      case "comment": return <MessageSquare className="h-4 w-4 text-primary" />;
      case "follow": return <UserPlus className="h-4 w-4 text-success" />;
      case "mention": return <AtSign className="h-4 w-4 text-accent" />;
      case "ai_moderation": return <Shield className="h-4 w-4 text-primary" />;
      default: return null;
    }
  };

  return (
    <div className="divide-y divide-border">
      {notifications.map((n) => (
        <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.isRead ? "bg-primary/5" : ""}`}>
          <div className="relative flex-shrink-0">
            {n.type === "ai_moderation" ? (
              <div className="w-10 h-10 rounded-full gradient-ai flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
            ) : (
              <img src={n.avatar} alt={n.username} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-0.5">
              {getIcon(n.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-semibold">{n.username}</span>{" "}
              <span className="text-muted-foreground">{n.text}</span>
            </p>
            <span className="text-xs text-muted-foreground">{n.timestamp}</span>
          </div>
          {n.postImage && (
            <img src={n.postImage} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
