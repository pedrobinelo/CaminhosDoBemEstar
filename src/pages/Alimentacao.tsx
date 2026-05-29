import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import MobileFloatingIsland from "../components/MobileFloatingIsland";
import DesktopHeader from "../components/DesktopHeader";
import ReceitaCard, { Receita } from "../components/ReceitaCard";

const DEFAULT_REFEICAO = ["Café da manhã", "Lanche", "Almoço", "Jantar"];
const DEFAULT_OBJETIVO = ["Perda de peso", "Ganho de massa", "Saúde geral", "Vegetariano", "Vegano"];
const DEFAULT_TEMPO = ["< 15 min", "15-30 min", "30-60 min", "+ 60 min"];

function carregarCat(key: string, defaults: string[]): string[] {
  try { 
    return JSON.parse(localStorage.getItem(key) || "null") ?? defaults; 
  } catch { 
    return defaults; 
  }
}

type Filtros = {
  busca: string;
  refeicao: string;
  objetivo: string;
  tempo: string;
};

type FiltroKey = "refeicao" | "objetivo" | "tempo" | null;

function FiltroDropdown({
  id,
  label,
  options,
  value,
  onChange,
  aberto,
  onToggle,
}: {
  id: FiltroKey;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  aberto: boolean;
  onToggle: (id: FiltroKey) => void;
}) {
  const ativo = value !== "Todos";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(aberto ? null : id)}
        className={`flex items-center justify-between gap-3 rounded-full px-6 py-2.5 text-base font-medium transition-all w-44 ${
          ativo
            ? "bg-purple-500 text-white shadow-md"
            : "bg-gray-300 text-purple-600 hover:bg-gray-400"
        }`}
      >
        <span className="truncate">{ativo ? value : label}</span>
        <span className="text-xs flex-shrink-0">{aberto ? "▲" : "▼"}</span>
      </button>

      {aberto && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 w-52 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          {options.map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => { onChange(op); onToggle(null); }}
              className={`w-full px-5 py-2.5 text-left text-sm hover:bg-purple-50 transition-colors ${
                value === op ? "font-bold text-purple-600 bg-purple-50" : "text-gray-700"
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Alimentacao() {
  // CORREÇÃO: Os hooks useState foram movidos para dentro do componente principal
  const [refeicaoOpts] = useState<string[]>(() => ["Todos", ...carregarCat("cat_refeicao", DEFAULT_REFEICAO)]);
  const [objetivoOpts] = useState<string[]>(() => ["Todos", ...carregarCat("cat_objetivo", DEFAULT_OBJETIVO)]);
  const [tempoOpts] = useState<string[]>(() => ["Todos", ...carregarCat("cat_tempo", DEFAULT_TEMPO)]);

  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<Filtros>({
    busca: "",
    refeicao: "Todos",
    objetivo: "Todos",
    tempo: "Todos",
  });
  const [dropdownAberto, setDropdownAberto] = useState<FiltroKey>(null);
  const filtrosRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (filtrosRef.current && !filtrosRef.current.contains(e.target as Node)) {
        setDropdownAberto(null);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  useEffect(() => {
    async function fetchReceitas() {
      setCarregando(true);
      setErroConexao(null);
      try {
        const snapshot = await getDocs(collection(db, "receitas"));
        const dados: Receita[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              titulo: data.titulo ?? "",
              ingredientes: data.ingredientes ?? [],
              imagem: data.imagem ?? "",
              refeicao: data.refeicao ?? "",
              objetivo: data.objetivo ?? "",
              tempo: data.tempo ?? "",
            } as Receita;
          })
          .filter((r) => r.titulo && !r.imagem.startsWith("data:"));
        setReceitas(dados);
      } catch (err: any) {
        setErroConexao(err.message);
      } finally {
        setCarregando(false);
      }
    }
    fetchReceitas();
  }, []);

  const receitasFiltradas = receitas.filter((r) => {
    const buscaOk =
      filtros.busca === "" ||
      r.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      r.ingredientes.some((i) => i.toLowerCase().includes(filtros.busca.toLowerCase()));
    const refeicaoOk = filtros.refeicao === "Todos" || r.refeicao === filtros.refeicao;
    const objetivoOk = filtros.objetivo === "Todos" || r.objetivo === filtros.objetivo;
    const tempoOk = filtros.tempo === "Todos" || r.tempo === filtros.tempo;
    return buscaOk && refeicaoOk && objetivoOk && tempoOk;
  });

  function limparFiltros() {
    setFiltros({ busca: "", refeicao: "Todos", objetivo: "Todos", tempo: "Todos" });
    setDropdownAberto(null);
  }

  const temFiltroAtivo =
    filtros.busca !== "" ||
    filtros.refeicao !== "Todos" ||
    filtros.objetivo !== "Todos" ||
    filtros.tempo !== "Todos";

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="alimentacao" />
      <MobileFloatingIsland activeTab="alimentacao" />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-center text-5xl font-bold text-purple-500 mb-10 md:text-6xl">
          Alimentação
        </h1>

        <div className="h-0.5 w-full bg-purple-400 mb-8" />

        {erroConexao && (
          <div className="mb-6 rounded-2xl bg-red-100 px-5 py-4 text-red-700 text-center">
            ❌ Erro ao carregar receitas: {erroConexao}
          </div>
        )}

        {/* Busca */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={filtros.busca}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busca: e.target.value }))}
            placeholder="Buscar receitas ou ingredientes..."
            className="w-full max-w-md rounded-full border border-gray-300 px-6 py-3 text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Filtros */}
        <div ref={filtrosRef} className="flex flex-col items-center gap-3 mb-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-10">
          <FiltroDropdown
            id="refeicao"
            label="Refeição"
            options={refeicaoOpts}
            value={filtros.refeicao}
            onChange={(v) => setFiltros((prev) => ({ ...prev, refeicao: v }))}
            aberto={dropdownAberto === "refeicao"}
            onToggle={setDropdownAberto}
          />
          <FiltroDropdown
            id="objetivo"
            label="Objetivo"
            options={objetivoOpts}
            value={filtros.objetivo}
            onChange={(v) => setFiltros((prev) => ({ ...prev, objetivo: v }))}
            aberto={dropdownAberto === "objetivo"}
            onToggle={setDropdownAberto}
          />
          <FiltroDropdown
            id="tempo"
            label="Tempo"
            options={tempoOpts}
            value={filtros.tempo}
            onChange={(v) => setFiltros((prev) => ({ ...prev, tempo: v }))}
            aberto={dropdownAberto === "tempo"}
            onToggle={setDropdownAberto}
          />
          {temFiltroAtivo && (
            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-full bg-red-100 px-6 py-2.5 text-base font-medium text-red-500 hover:bg-red-200 transition-all"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {!carregando && (
          <p className="text-center text-gray-400 text-sm mb-8">
            {receitasFiltradas.length === 0
              ? "Nenhuma receita encontrada"
              : `${receitasFiltradas.length} receita${receitasFiltradas.length > 1 ? "s" : ""} encontrada${receitasFiltradas.length > 1 ? "s" : ""}`}
          </p>
        )}

        <div className="flex flex-col gap-8">
          {carregando ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-64 w-full rounded-3xl bg-gray-200 animate-pulse" />
            ))
          ) : receitasFiltradas.length > 0 ? (
            receitasFiltradas.map((receita) => (
              <ReceitaCard key={receita.id} receita={receita} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-6xl mb-4">🥗</span>
              <p className="text-xl font-medium">Nenhuma receita encontrada</p>
              <p className="text-sm mt-1">
                {receitas.length === 0 ? "Adicione receitas pelo painel admin" : "Tente ajustar os filtros"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}