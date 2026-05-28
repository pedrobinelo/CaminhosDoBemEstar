import React, { useState } from "react";

export type Receita = {
  id?: string;
  titulo: string;
  ingredientes: string[];
  imagem: string;
  refeicao: string;
  objetivo: string;
  tempo: string;
};

type ReceitaCardProps = {
  receita: Receita;
};

function getImagemSrc(nomeArquivo: string): string {
  if (!nomeArquivo) return "";
  try {
    return require(`../assets/receitas/${nomeArquivo}`);
  } catch {
    return "";
  }
}

export default function ReceitaCard({ receita }: ReceitaCardProps) {
  const src = getImagemSrc(receita.imagem);
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-gray-300 p-6 md:p-8 transition-transform hover:scale-[1.01]">
      {/* Imagem */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white rounded-2xl p-2 h-64 md:h-64 flex-shrink-0">
        {src ? (
          <img
            src={src}
            alt={receita.titulo}
            className="h-full w-full object-contain rounded-xl"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-5xl">
            🥗
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col justify-center mt-6 md:mt-0 md:ml-10 text-black flex-1">
        <h2 className="text-3xl font-bold mb-3">{receita.titulo}</h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full bg-purple-200 px-3 py-1 text-sm font-medium text-purple-700">
            🍽️ {receita.refeicao}
          </span>
          <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-yellow-700">
            🎯 {receita.objetivo}
          </span>
          <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-medium text-green-700">
            ⏱️ {receita.tempo}
          </span>
        </div>

        {/* Ingredientes */}
        <ul
          className="space-y-1 text-xl overflow-hidden transition-all duration-300"
          style={{ maxHeight: expandido ? "1000px" : "6.5rem" }}
        >
          {receita.ingredientes.map((ing, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-sm">•</span> {ing}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setExpandido((p) => !p)}
          className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors self-start"
        >
          {expandido ? "Ler menos ▲" : "Ler mais ▼"}
        </button>
      </div>
    </div>
  );
}
