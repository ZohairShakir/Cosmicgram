import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, MapPin, X, Shield, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { classifyText, type ClassifyResult } from "@/api/classify";

const CreatePost = () => {
  const { addPost, addStrike, currentUser, isBlocked } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [aiChecked, setAiChecked] = useState(false);
  const [posting, setPosting] = useState(false);
  
  // Warning Modal State
  const [showWarning, setShowWarning] = useState(false);
  const [pendingResult, setPendingResult] = useState<ClassifyResult | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setAiChecked(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!preview || posting || isBlocked) return;
    
    setPosting(true);
    
    try {
      // Step 1: AI Scan the caption AND the image (OCR)
      const result = await classifyText(caption, preview);
      
      if (result.is_hateful) {
        // Step 2: If hateful, show warning and add strike
        setPendingResult(result);
        setShowWarning(true);
        addStrike();
        setPosting(false);
      } else {
        // Step 3: If safe, just post
        completePosting(result);
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setPosting(false);
    }
  };

  const completePosting = (result: ClassifyResult) => {
    addPost({
      image: preview!,
      caption,
      location: location || undefined,
      timestamp: "Just now",
      aiSafe: !result.is_hateful,
      aiLabel: result.label as any,
      aiConfidence: result.confidence,
      isAiGenerated: result.is_ai_generated,
    });
    navigate("/");
  };

  const handlePostAnyway = () => {
    if (pendingResult) {
      completePosting(pendingResult);
      setShowWarning(false);
    }
  };

  if (isBlocked) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center bg-card rounded-xl shadow-card border border-destructive/20">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-destructive">Account Restricted</h2>
        <p className="text-muted-foreground mt-4">
          Your account has been blocked after receiving 3 strikes for violating our community safety standards regarding hate speech.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-secondary rounded-lg font-semibold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Create Post</h2>
          <button
            onClick={handlePost}
            disabled={!preview || posting}
            className="px-4 py-1.5 gradient-primary text-primary-foreground text-sm font-semibold rounded-lg disabled:opacity-50 transition-opacity"
          >
            {posting ? "Scanning Image & Text..." : "Share"}
          </button>
        </div>

        {/* User Info & Strikes */}
        <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between bg-secondary/10">
          <span className="text-xs font-medium text-muted-foreground">Safety Status</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 w-6 rounded-full ${
                  (currentUser.strikes || 0) >= s ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-muted"
                }`} 
              />
            ))}
            <span className="text-[10px] font-bold ml-1 text-muted-foreground">{currentUser.strikes || 0}/3 STRIKES</span>
          </div>
        </div>

        {/* Upload Area */}
        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center h-80 cursor-pointer hover:bg-secondary/30 transition-colors"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            </motion.div>
            <p className="text-lg font-semibold">Drag photos here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to select</p>
            <button className="mt-4 px-6 py-2 gradient-primary text-primary-foreground rounded-lg text-sm font-semibold">
              Select from computer
            </button>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <button
              onClick={() => { setPreview(null); setAiChecked(false); }}
              className="absolute top-3 right-3 bg-foreground/60 rounded-full p-1 hover:bg-foreground/80 transition-colors"
            >
              <X className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {preview && (
          <div className="p-4 space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center gap-2 py-3 border-t border-border">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-3 py-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>This post will be scanned by our AI for offensive content, hate speech, and targeted harassment.</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 transition-colors ${posting ? "text-muted-foreground animate-pulse" : "text-amber-500"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">AI Source Recognition</span>
                </div>
                <span className="text-[9px] text-muted-foreground italic">
                  {posting ? "Analyzing Image..." : "Prahari Passive Scan Active"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border-2 border-destructive/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Harmful Content Detected</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Our Prahari Shield has flagged your {pendingResult?.is_visual_unsafe ? "image content" : "text"} as potentially containing <span className="text-destructive font-semibold">Harmful Content ({pendingResult?.confidence}%)</span>.
                </p>
                {pendingResult?.image_text && (
                  <div className="mt-2 p-2 bg-destructive/5 rounded text-[10px] italic border border-destructive/10">
                    "Text in image: {pendingResult.image_text}"
                  </div>
                )}
                {pendingResult?.visual_flags && pendingResult.visual_flags.length > 0 && (
                  <div className="mt-2 space-y-1 w-full">
                    {pendingResult.visual_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10px] text-destructive bg-destructive/5 px-2 py-1 rounded border border-destructive/10">
                        <ShieldAlert className="h-3 w-3" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-secondary/30 rounded-lg w-full text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Strike Issued</p>
                  <p className="text-xs">This account now has <span className="text-destructive font-bold">{currentUser.strikes + 1}</span> of 3 strikes. Reaching 3 strikes will result in a permanent block.</p>
                </div>

                <div className="flex flex-col w-full gap-2 mt-6">
                  <button 
                    onClick={() => setShowWarning(false)}
                    className="w-full py-2 bg-foreground text-background rounded-lg font-bold hover:opacity-90"
                  >
                    Edit Caption
                  </button>
                  <button 
                    onClick={handlePostAnyway}
                    className="w-full py-2 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/10"
                  >
                    Post Anyway (Apply Red Label)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePost;

