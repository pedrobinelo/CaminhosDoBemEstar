function RecipeImageAndTitle({ src, alt, title, className = '' }) {
  const baseClasses = "w-full h-full object-cover md:blur-sm";
  const finalClasses = `${baseClasses} ${className}`;

  return (
    <div className="relative w-full h-[160px] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={finalClasses}
      />
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-[1]" />
      {/* Título por cima */}
      {title && (
        <h2 className="absolute bottom-4 left-4 right-4 text-white text-xl font-semibold z-[2]">
          {title}
        </h2>
      )}
    </div>
  );
}

export default RecipeImageAndTitle;