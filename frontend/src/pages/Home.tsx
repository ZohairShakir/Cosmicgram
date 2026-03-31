import { useApp } from "@/context/AppContext";
import PostCard from "@/components/PostCard";
import StoryBar from "@/components/StoryBar";
import RightSidebar from "@/components/RightSidebar";

const Home = () => {
  const { posts } = useApp();

  return (
    <div className="flex justify-center gap-8">
      <div className="w-full max-w-[470px]">
        <StoryBar />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
