import { useApp } from "@/context/AppContext";
import PostCard from "@/components/PostCard";
import StoryBar from "@/components/StoryBar";

const Home = () => {
  const { posts } = useApp();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[470px]">
        <StoryBar />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
