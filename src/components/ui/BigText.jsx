const textColors = {
  light: "#fff",
  dark: "#000",
  secondary: "oklch(86.9% 0.022 252.894)"
};

function BigText({ children, textVariant = "light" }) {
  return (
    <div className="flex justify-center items-center w-full text-center">
      <h3
        className="inter font-medium m-0 lg:text-[1.25rem] w-3/4 text-justify md:w-[65%] md:text-[1.25rem] lg:w-1/2 cursor-default"
        style={{ color: textColors[textVariant] || textColors.light }}
      >
        {children}
      </h3>
    </div>
  );
}

export default BigText;
