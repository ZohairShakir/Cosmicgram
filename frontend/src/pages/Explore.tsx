import { useState } from "react";
import { motion } from "framer-motion";
import { explorePosts } from "@/data/mockPosts";
import { Search, Shield, TrendingUp } from "lucide-react";

const Explore = () => {
  const [query, setQuery] = useState("");

  const tags = ["#Cosmicgram", "#AIforGood", "#NoHate", "#DigitalSafety", "#Kindness", "#TechForGood"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Cosmicgram..."
          className="w-full bg-secondary rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        />
      </div>

      {/* Trending Tags */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {tags.map((tag) => (
          <button
            key={tag}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* AI Safety Banner */}
      <div className="gradient-ai rounded-xl p-4 mb-6 text-primary-foreground flex items-center gap-3">
        <Shield className="h-8 w-8 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">Explore Safely</h3>
          <p className="text-sm opacity-90">All content on this page is AI-verified for safety. Harmful content is automatically filtered.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {explorePosts.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${
              idx % 5 === 0 ? "row-span-2 col-span-1" : ""
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover aspect-square"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex items-center gap-1 text-primary-foreground text-sm font-semibold">
                <Shield className="h-4 w-4" /> AI Verified
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
