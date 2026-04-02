import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  Shield, BadgeCheck, ShieldCheck, ShieldAlert, AlertTriangle, X
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Post } from "@/data/mockPosts";
import { Link } from "react-router-dom";
import { classifyText, type ClassifyResult } from "@/api/classify";

const PostCard = ({ post }: { post: Post }) => {
  const { toggleLike, toggleSave, addComment, addStrike, isBlocked, currentUser } = useApp();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isScanningComment, setIsScanningComment] = useState(false);
  const lastTap = useRef(0);

  // Comment Warning State
  const [showCommentWarning, setShowCommentWarning] = useState(false);
  const [pendingCommentResult, setPendingCommentResult] = useState<ClassifyResult | null>(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!post.isLiked) toggleLike(post.id);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || isScanningComment || isBlocked) return;
    
    setIsScanningComment(true);
    try {
      const result = await classifyText(commentText);
      
      if (result.is_hateful) {
        setPendingCommentResult(result);
        setShowCommentWarning(true);
        addStrike();
      } else {
        addComment(post.id, commentText.trim(), "Not Hateful", result.confidence);
        setCommentText("");
      }
    } catch (err) {
      console.error("Comment classification error:", err);
      // Fallback
      addComment(post.id, commentText.trim());
      setCommentText("");
    } finally {
      setIsScanningComment(false);
    }
  };

  const handlePostCommentAnyway = () => {
    if (pendingCommentResult) {
      addComment(post.id, commentText.trim(), "Hateful", pendingCommentResult.confidence);
      setCommentText("");
      setShowCommentWarning(false);
    }
  };

  const formatLikes = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.002 }}
      className={`bg-card rounded-xl shadow-card overflow-hidden mb-4 border transition-all duration-300 ${
        post.aiLabel === 'Hateful' ? 'border-destructive/30 bg-destructive/[0.02] shadow-destructive/5' : 'border-transparent hover:shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.username}`} className="flex items-center gap-3 group">
          <div className={`${post.isVerified ? 'story-ring' : ''} p-[1.5px] transition-transform group-hover:scale-105`}>
            <img src={post.avatar} alt={post.username} className="w-9 h-9 rounded-full object-cover border-2 border-card" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold hover:text-primary transition-colors">{post.username}</span>
              {post.isVerified && <BadgeCheck className="h-4 w-4 text-primary fill-primary stroke-primary-foreground" />}
            </div>
            {post.location && <span className="text-[11px] text-muted-foreground">{post.location}</span>}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {post.aiLabel === 'Hateful' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider border border-destructive/20 animate-pulse shadow-sm shadow-destructive/10">
              <ShieldAlert className="h-3 w-3" />
              <span>Hate Speech detected ({post.aiConfidence}%)</span>
            </div>
          ) : post.aiLabel === 'Not Hateful' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider border border-success/30 shadow-sm shadow-success/10">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Safe Verified</span>
            </div>
          ) : post.aiSafe && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase border border-success/10">
              <Shield className="h-3 w-3" />
              <span>Safe</span>
            </div>
          )}
          {post.isAiGenerated && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase border border-amber-500/20">
              <AlertTriangle className="h-3 w-3" />
              <span>AI Generated</span>
            </div>
          )}
          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative cursor-pointer group overflow-hidden" onClick={handleDoubleTap}>
        <img src={post.image} alt={post.caption} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="h-24 w-24 text-white fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hateful Overlay */}
        {post.aiLabel === 'Hateful' && (
          <div className="absolute inset-0 bg-destructive/10 pointer-events-none mix-blend-overlay" />
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={() => toggleLike(post.id)}
            >
              <Heart className={`h-6 w-6 transition-all ${post.isLiked ? "fill-destructive text-destructive scale-110" : "text-foreground hover:scale-110"}`} />
            </motion.button>
            <button onClick={() => setShowComments(!showComments)} className="hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6 text-foreground" />
            </button>
            <button className="hover:scale-110 transition-transform">
              <Send className="h-6 w-6 text-foreground" />
            </button>
          </div>
          <motion.button whileTap={{ scale: 1.2 }} onClick={() => toggleSave(post.id)} className="hover:scale-110 transition-transform">
            <Bookmark className={`h-6 w-6 transition-colors ${post.isSaved ? "fill-foreground text-foreground" : "text-foreground"}`} />
          </motion.button>
        </div>

        <span className="text-sm font-semibold">{formatLikes(post.likes)} likes</span>

        <p className="text-sm mt-1 mb-2">
          <span className="font-semibold mr-2">{post.username}</span>
          <span className={`${post.aiLabel === 'Hateful' ? 'text-destructive font-medium underline decoration-destructive/30' : 'text-foreground/80'}`}>
            {post.caption}
          </span>
        </p>

        {post.comments.length > 0 && !showComments && (
          <button onClick={() => setShowComments(true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1">
            View all {post.comments.length} comments
          </button>
        )}

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-3 pb-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 group">
                    <img src={c.avatar} alt={c.username} className="w-7 h-7 rounded-full object-cover mt-0.5 border border-border" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold mr-2">{c.username}</span>
                        <span className={`${c.aiLabel === 'Hateful' ? 'text-destructive font-medium bg-destructive/5 px-1 rounded' : 'text-foreground/90'}`}>
                          {c.text}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground uppercase">{c.timestamp}</span>
                        {c.aiLabel === 'Hateful' && (
                          <span className="text-[9px] font-black text-destructive uppercase tracking-tighter bg-destructive/10 px-1.5 py-0.5 rounded leading-none">
                            Hate Flagged
                          </span>
                        )}
                        {c.aiLabel === 'Not Hateful' && (
                          <span className="text-[9px] font-bold text-success uppercase tracking-tighter bg-success/10 px-1.5 py-0.5 rounded leading-none">
                            Safe
                          </span>
                        )}
                      </div>
                    </div>
                    <Heart className="h-3 w-3 text-muted-foreground group-hover:text-destructive transition-colors cursor-pointer" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-[10px] text-muted-foreground uppercase mt-2 block tracking-tight font-medium">Prahari Shield Protected · {post.timestamp}</span>

        {/* Add comment */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border group relative">
          <input
            type="text"
            value={commentText}
            disabled={isScanningComment || isBlocked}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
            placeholder={isBlocked ? "Your account is restricted" : "Add a comment..."}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          {commentText && !isScanningComment && (
            <button 
              onClick={handleCommentSubmit} 
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Post
            </button>
          )}
          {isScanningComment && (
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}

          {/* Comment Warning Portal (Absolute to local container) */}
          <AnimatePresence>
            {showCommentWarning && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-4 bg-card border-2 border-destructive/30 rounded-xl p-4 shadow-2xl z-20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Comment Flagged</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Our AI has detected harmful language. Account Strike issued ({currentUser.strikes}/3).
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => setShowCommentWarning(false)}
                        className="text-[11px] font-bold bg-foreground text-background px-3 py-1.5 rounded-lg"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handlePostCommentAnyway}
                        className="text-[11px] font-bold border border-destructive/30 text-destructive px-3 py-1.5 rounded-lg hover:bg-destructive/5"
                      >
                        Post Anyway
                      </button>
                      <button 
                        onClick={() => { setShowCommentWarning(false); setCommentText(""); }}
                        className="text-[11px] font-medium text-muted-foreground ml-auto p-1.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;

