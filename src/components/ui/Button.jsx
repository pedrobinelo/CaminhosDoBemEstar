export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  // Classes base para o botão
  const baseStyle =
    "inter px-4 py-2 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer max-h-10";

  let variantStyle = "";
  switch (variant) {
    case "secondary":
      variantStyle =
        "text-gray-800 bg-gray-300 border-gray-300 hover:bg-gray-200 focus:ring-indigo-500";
      break;
    case "danger":
      variantStyle =
        "text-white bg-red-600 border-transparent hover:bg-red-700 focus:ring-red-500";
      break;
    case "primary":
    default:
      variantStyle =
        "text-white bg-indigo-600 border-transparent hover:bg-indigo-700 focus:ring-indigo-500";
      break;
    case "info":
      variantStyle =
        "text-white bg-blue-600 border-transparent hover:bg-blue-700 focus:ring-blue-500";
      break;
  }

  const combinedClassName = `${baseStyle} ${variantStyle} ${className}`;

  return (
    <button
      className={combinedClassName}
      {...props} 
    >
      {children}
    </button>
  );
}
