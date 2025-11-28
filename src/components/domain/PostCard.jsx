import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  
  if (!post || !post.imageURL || !post.title || !post.id) {
    return null;
  }

  const handleClick = () => {
    navigate(`/alimentacao/receita/${post.id}`, { state: { recipe: post } });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-md shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div
        className="w-full h-full bg-cover bg-center relative z-[1]"
        style={{ backgroundImage: `url(${post.imageURL})` }}
      >
        {/* Overlay preto com opacidade */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-[2]" />
      </div>
      {/* Título sobreposto (position: absolute) */}
      <p
        className="absolute bottom-4 left-4 right-4 text-white text-lg sm:text-[0.75rem] font-bold m-0 p-0 z-[3] line-clamp-3 overflow-hidden text-ellipsis leading-tight"
        title={post.title}
      >
        {post.title}
      </p>
    </div>
  );
};

export default PostCard;
