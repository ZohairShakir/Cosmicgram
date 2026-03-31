import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Story } from "@/data/mockStories";

interface Props {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer = ({ stories, initialIndex, onClose }: Props) => {
  const [current, setCurrent] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[current];

  const goNext = useCallback(() => {
    if (current < stories.length - 1) {
      setCurrent((c) => c + 1);
      setProgress(0);
    } else onClose();
  }, [current, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setProgress(0);
    }
  }, [current]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { goNext(); return 0; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current, goNext]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center"
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10">
        <X className="h-8 w-8 text-primary-foreground" />
      </button>

      <button onClick={goPrev} className="absolute left-4 z-10 bg-card/20 rounded-full p-2">
        <ChevronLeft className="h-6 w-6 text-primary-foreground" />
      </button>

      <div className="relative w-full max-w-[420px] h-[90vh] max-h-[780px] rounded-xl overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-2 left-2 right-2 z-10 flex gap-1">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-[3px] bg-primary-foreground/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full transition-all duration-100"
                style={{ width: idx < current ? "100%" : idx === current ? `${progress}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-6 left-3 z-10 flex items-center gap-2">
          <img src={story.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-primary-foreground/50" />
          <span className="text-sm font-semibold text-primary-foreground">{story.username}</span>
          <span className="text-xs text-primary-foreground/70">{story.timestamp}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.img
            key={story.id}
            src={story.image}
            alt=""
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      <button onClick={goNext} className="absolute right-4 z-10 bg-card/20 rounded-full p-2">
        <ChevronRight className="h-6 w-6 text-primary-foreground" />
      </button>
    </motion.div>
  );
};

export default StoryViewer;
