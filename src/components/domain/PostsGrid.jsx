import PostCard from "./PostCard";

const PostsGrid = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div
      className="grid w-full p-2 h-full grid-cols-2 grid-rows-2 gap-2 md:grid-cols-3 md:p-4"
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsGrid;
