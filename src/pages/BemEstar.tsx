import React, { useState, useEffect } from "react";
import MobileFloatingIsland from "../components/MobileFloatingIsland";
import DesktopHeader from "../components/DesktopHeader";

// 1. Importamos a ligação ao banco de dados e as ferramentas de busca
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface AtividadeBemEstar {
  id: string;
  titulo: string;
  descricao: string;
  passos: string[];
  imagem?: string;
}

export default function BemEstar() {
  // A memória temporária do ecrã
  const [atividades, setAtividades] = useState<AtividadeBemEstar[]>([]);
  const [carregando, setCarregando] = useState(true);

  //Vai ao Firebase procurar os dados assim que o ecrã abre
  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        // Aponta para a coleção (pasta) "atividades_bem_estar" no Firebase
        const atividadesCollection = collection(db, 'atividades_bem_estar');
        const atividadesSnapshot = await getDocs(atividadesCollection);
        
        // Converte os documentos do Firebase para a nossa Interface
        const atividadesList = atividadesSnapshot.docs.map(doc => ({
          id: doc.id,
          titulo: doc.data().titulo,
          descricao: doc.data().descricao,
          passos: doc.data().passos || [],
          imagem: doc.data().imagem || "",
        })) as AtividadeBemEstar[];

        setAtividades(atividadesList);
      } catch (error) {
        console.error("Erro ao buscar atividades de bem-estar:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchAtividades();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="bem-estar" />

      <MobileFloatingIsland activeTab="bem-estar" />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-center text-5xl font-bold text-purple-500 mb-10 md:text-6xl">
          Bem-Estar
        </h1>
        
        <div className="h-0.5 w-full bg-purple-400 mb-8" />

        {/* Filtros - Mantidos da tua interface original */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <select className="appearance-none bg-[#e2e2e2] text-[#8A4FFF] font-semibold py-2 pl-6 pr-10 rounded-full outline-none cursor-pointer">
              <option>Tema</option>
            </select>
            <svg className="w-4 h-4 text-[#8A4FFF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#e2e2e2] text-[#8A4FFF] font-semibold py-2 pl-6 pr-10 rounded-full outline-none cursor-pointer">
              <option>Tempo</option>
            </select>
            <svg className="w-4 h-4 text-[#8A4FFF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#e2e2e2] text-[#8A4FFF] font-semibold py-2 pl-6 pr-10 rounded-full outline-none cursor-pointer">
              <option>Foco</option>
            </select>
            <svg className="w-4 h-4 text-[#8A4FFF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Renderização da lista a partir da Base de Dados */}
        <div className="flex flex-col gap-6 w-full">
          {carregando ? (
            <p className="text-center text-gray-500 font-medium">A carregar atividades...</p>
          ) : atividades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <span className="text-6xl mb-4">🧘‍♂️</span>
              <p className="text-xl font-medium text-gray-500">Nenhuma atividade no banco de dados.</p>
            </div>
          ) : (
            atividades.map((atividade) => (
              <div key={atividade.id} className="bg-[#d1d5db] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto transition-transform duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer w-full">
                
                
              {/* Imagem ou Ícone Base */}
                <div className="w-40 h-28 rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {atividade.imagem ? (
                    <img 
                      src={atividade.imagem} 
                      alt={atividade.titulo} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-black">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  )}
                </div>
                
                {/* Informação Injetada Dinamicamente */}
                <div className="flex-1 text-black text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">{atividade.titulo}</h2>
                  <p className="mb-3 font-medium text-base">{atividade.descricao}</p>
                  {/* Renderizando a lista de passos dinamicamente */}
                  {atividade.passos && atividade.passos.length > 0 && (
                    <ul className="list-disc list-inside text-sm font-medium space-y-1 text-left">
                      {atividade.passos.map((passo, index) => (
                        <li key={index}>{passo}</li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}