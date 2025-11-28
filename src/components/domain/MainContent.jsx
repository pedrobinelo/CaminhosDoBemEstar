function MainContent({ children }) {
  return (
    <div className="inter flex flex-col justify-center items-center gap-3 p-4 w-[90%] md:w-[80%] mx-auto lg:flex-row lg:w-[70%] lg:gap-5 lg:h-[400px]">
      {children}
    </div>
  );
}

export default MainContent;