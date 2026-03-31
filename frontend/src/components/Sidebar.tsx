import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, User,
  Menu, Shield, X
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import NotificationPanel from "./NotificationPanel";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: Film, label: "Reels", path: "/reels" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Heart, label: "Notifications", path: "#notifications" },
  { icon: PlusSquare, label: "Create", path: "/create" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const { unreadNotifications, currentUser } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r border-border bg-card z-40 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[245px]"
        }`}
      >
        <div className="p-4 pt-6 pb-2">
          {collapsed ? (
            <div className="flex justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
          ) : (
            <Link to="/" className="flex items-center gap-2 px-2">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">Cosmicgram</span>
            </Link>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path.replace("#", ""));
            const isNotif = path === "#notifications";

            return (
              <motion.div key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isNotif ? (
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`flex items-center gap-3 w-full rounded-lg px-3 py-3 transition-colors relative ${
                      showNotifications
                        ? "bg-secondary text-foreground font-semibold"
                        : "text-foreground/70 hover:bg-secondary/60"
                    }`}
                  >
                    <div className="relative">
                      <Icon className="h-6 w-6" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                          {unreadNotifications}
                        </span>
                      )}
                    </div>
                    {!collapsed && <span>{label}</span>}
                  </button>
                ) : (
                  <Link
                    to={path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                      isActive
                        ? "bg-secondary text-foreground font-semibold"
                        : "text-foreground/70 hover:bg-secondary/60"
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isActive ? "stroke-[2.5]" : ""}`} />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </nav>

        {/* Safety Status */}
        {!collapsed && (
          <div className="px-4 py-4 mb-4 mx-2 bg-secondary/20 rounded-xl border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Shield className="h-3 w-3 text-primary" />
                Safety Status
              </span>
              <span className="text-[10px] font-black text-foreground">{(currentUser.strikes || 0)} / 3</span>
            </div>
            <div className="flex gap-1 h-1.5">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`flex-1 rounded-full transition-all duration-500 ${
                    (currentUser.strikes || 0) >= s 
                      ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                      : "bg-muted"
                  }`} 
                />
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 leading-tight">
              {(currentUser.strikes || 0) >= 2 ? "Warning: One more strike will result in account restriction." : "Your account is in good standing."}
            </p>
          </div>
        )}

        <div className="p-2 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 rounded-lg px-3 py-3 w-full text-foreground/70 hover:bg-secondary/60 transition-colors"
          >
            <Menu className="h-6 w-6" />
            {!collapsed && <span>More</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-1">
        <div className="flex items-center justify-around py-2">
          {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[7]].map(({ icon: Icon, label, path }) => {
            const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
            return (
              <Link key={label} to={path} className="flex flex-col items-center p-1">
                <Icon className={`h-6 w-6 ${isActive ? "text-foreground stroke-[2.5]" : "text-muted-foreground"}`} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Cosmicgram</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <Heart className="h-6 w-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
          <Link to="/messages">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 z-50 bg-foreground/20"
            />
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 lg:left-[72px] top-0 h-screen w-[340px] bg-card border-r border-border z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <NotificationPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
