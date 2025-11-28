function PagePresentation({ title }) {
  return (
    <div className="w-[70%] md:w-[35%] lg:w-1/4 relative flex justify-center text-xl gap-1 rounded-md p-2 overflow-hidden">
      {/* Fundo escuro com opacidade */}
      <div className="absolute inset-0 bg-black opacity-40 rounded-md pointer-events-none" />
      {/* Conteúdo acima do fundo */}
      <div className="relative flex gap-1 justify-center items-center">
        <p className="font-semibold">Você está em:</p>
        <span>{title}</span>
      </div>
    </div>
  );
}

export default PagePresentation;
