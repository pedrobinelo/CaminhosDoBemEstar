function PostsContainer({ children }) {
  return (
    <div className="flex flex-col gap-2 p-2 border-2 rounded-md justify-center items-center w-[90%] md:w-[70%]">
      <div className="flex flex-col justify-center items-center min-h-[300px] w-full">
        {children}
      </div>
    </div>
  );
}

export default PostsContainer;
