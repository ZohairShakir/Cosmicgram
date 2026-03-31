import { useRef } from "react";
import { motion } from "framer-motion";
import { mockStories } from "@/data/mockStories";
import { currentUser } from "@/data/mockUsers";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import StoryViewer from "./StoryViewer";

const StoryBar = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewingStory, setViewingStory] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative bg-card rounded-xl shadow-card p-4 mb-4">
        <div className="relative group">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-1">
            {/* Your Story */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="relative">
                <img src={currentUser.avatar} alt="Your story" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-card">
                  <Plus className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Your story</span>
            </div>

            {/* Other Stories */}
            {mockStories.map((story, idx) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                onClick={() => setViewingStory(idx)}
              >
                <div className={story.isViewed ? "p-[2px] rounded-full border-2 border-muted" : "story-ring"}>
                  <div className="story-ring-inner">
                    <img src={story.avatar} alt={story.username} className="w-14 h-14 rounded-full object-cover" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate w-16 text-center">{story.username.split("_")[0]}</span>
              </motion.div>
            ))}
          </div>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewingStory !== null && (
        <StoryViewer
          stories={mockStories}
          initialIndex={viewingStory}
          onClose={() => setViewingStory(null)}
        />
      )}
    </>
  );
};

export default StoryBar;
