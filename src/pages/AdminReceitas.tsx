import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import DesktopHeader from "../components/DesktopHeader";
import MobileFloatingIsland from "../components/MobileFloatingIsland";
import { Receita } from "../components/ReceitaCard";

const DEFAULT_REFEICAO = ["Café da manhã", "Lanche", "Almoço", "Jantar"];
const DEFAULT_OBJETIVO = ["Perda de peso", "Ganho de massa", "Saúde geral", "Vegetariano", "Vegano"];
const DEFAULT_TEMPO = ["< 15 min", "15-30 min", "30-60 min", "+ 60 min"];

// @ts-ignore
const imagensContext = require.context("../assets/receitas", false, /\.(png|jpe?g|webp|gif)$/);
const IMAGENS_DISPONIVEIS: string[] = imagensContext.keys().map((k: string) => k.replace("./", ""));

type FormState = {
  titulo: string;
  ingredientes: string;
  refeicao: string;
  objetivo: string;
  tempo: string;
  imagem: string;
};

const initialForm: FormState = {
  titulo: "",
  ingredientes: "",
  refeicao: "",
  objetivo: "",
  tempo: "",
  imagem: "",
};

type Aba = "adicionar" | "listar" | "editar" | "categorias";

export default function AdminReceitas() {
  const [aba, setAba] = useState<Aba>("adicionar");
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [deletando, setDeletando] = useState<string | null>(null);
  const [editando, setEditando] = useState<Receita | null>(null);

  const [refeicaoOpts, setRefeicaoOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_refeicao") || "null") ?? DEFAULT_REFEICAO; } catch { return DEFAULT_REFEICAO; }
  });
  const [objetivoOpts, setObjetivoOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_objetivo") || "null") ?? DEFAULT_OBJETIVO; } catch { return DEFAULT_OBJETIVO; }
  });
  const [tempoOpts, setTempoOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_tempo") || "null") ?? DEFAULT_TEMPO; } catch { return DEFAULT_TEMPO; }
  });

  const [novaRefeicao, setNovaRefeicao] = useState("");
  const [novoObjetivo, setNovoObjetivo] = useState("");
  const [novoTempo, setNovoTempo] = useState("");

  function salvarCat(key: string, valores: string[]) {
    localStorage.setItem(key, JSON.stringify(valores));
  }

  function adicionarOpcao(
    valor: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>,
    key: string
  ) {
    const v = valor.trim();
    if (!v) return;
    setter((prev) => {
      const nova = [...prev, v];
      salvarCat(key, nova);
      return nova;
    });
    inputSetter("");
  }

  function removerOpcao(
    valor: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    key: string
  ) {
    setter((prev) => {
      const nova = prev.filter((p) => p !== valor);
      salvarCat(key, nova);
      return nova;
    });
  }

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      refeicao: prev.refeicao || refeicaoOpts[0] || "",
      objetivo: prev.objetivo || objetivoOpts[0] || "",
      tempo: prev.tempo || tempoOpts[0] || "",
    }));
  }, [refeicaoOpts, objetivoOpts, tempoOpts]);

  async function carregarReceitas() {
    setCarregandoLista(true);
    try {
      const snapshot = await getDocs(collection(db, "receitas"));
      const dados: Receita[] = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Receita, "id">) }))
        .filter((r) => r.titulo && !r.imagem?.startsWith("data:"));
      setReceitas(dados);
    } catch (err: any) {
      console.error(err);
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    if (aba === "listar") carregarReceitas();
  }, [aba]);

  async function handleDeletar(id: string) {
    if (!window.confirm("Tem certeza que quer excluir esta receita?")) return;
    setDeletando(id);
    try {
      await deleteDoc(doc(db, "receitas", id));
      setReceitas((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert("Erro ao excluir: " + err.message);
    } finally {
      setDeletando(null);
    }
  }

  async function handleSalvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editando?.id) return;
    setLoading(true);
    setErro(null);
    setSucesso(false);
    try {
      await updateDoc(doc(db, "receitas", editando.id), {
        titulo: editando.titulo,
        ingredientes: Array.isArray(editando.ingredientes)
          ? editando.ingredientes.map((i) => i.trimEnd()).filter(Boolean)
          : (editando.ingredientes as string).split("\n").map((i) => i.trimEnd()).filter(Boolean),
        refeicao: editando.refeicao,
        objetivo: editando.objetivo,
        tempo: editando.tempo,
        imagem: editando.imagem,
      });
      setSucesso(true);
      await carregarReceitas();
      setTimeout(() => { setAba("listar"); setEditando(null); setSucesso(false); }, 1000);
    } catch (err: any) {
      setErro("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSucesso(false);
    setErro(null);
    try {
      await addDoc(collection(db, "receitas"), {
        titulo: form.titulo,
        ingredientes: form.ingredientes.split("\n").map((i) => i.trimEnd()).filter(Boolean),
        refeicao: form.refeicao,
        objetivo: form.objetivo,
        tempo: form.tempo,
        imagem: form.imagem,
        criadoEm: new Date(),
      });
      setSucesso(true);
      setForm({ ...initialForm, refeicao: refeicaoOpts[0] || "", objetivo: objetivoOpts[0] || "", tempo: tempoOpts[0] || "" });
    } catch (err: any) {
      setErro("Erro ao salvar receita: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const abaBtnClass = (a: Aba) =>
    `px-5 py-2 rounded-full font-semibold text-sm transition-all ${
      aba === a ? "bg-purple-500 text-white" : "bg-gray-200 text-purple-600 hover:bg-gray-300"
    }`;

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="alimentacao" />
      <MobileFloatingIsland activeTab="alimentacao" />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-center text-4xl font-bold text-purple-500 mb-2 md:text-5xl">
          Admin — Receitas
        </h1>
        <p className="text-center text-gray-500 mb-6">Gerencie as receitas do site</p>
        <div className="h-0.5 w-full bg-purple-400 mb-6" />

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className={abaBtnClass("adicionar")} onClick={() => setAba("adicionar")}>➕ Adicionar</button>
          <button className={abaBtnClass("listar")} onClick={() => setAba("listar")}>📋 Receitas</button>
          <button className={abaBtnClass("editar")} onClick={() => setAba("editar")}>✏️ Editar</button>
          <button className={abaBtnClass("categorias")} onClick={() => setAba("categorias")}>🏷️ Categorias</button>
        </div>

        {/* ABA: ADICIONAR */}
        {aba === "adicionar" && (
          <>
            <div className="mb-6 rounded-2xl bg-purple-50 border border-purple-200 px-5 py-4 text-sm text-purple-700">
              <strong>📁 Como adicionar imagens:</strong> coloque o arquivo em{" "}
              <code className="bg-purple-100 px-1 rounded">src/assets/receitas/</code> e selecione abaixo.
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Ex: Salada Caesar"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Ingredientes * <span className="text-gray-400 font-normal">(um por linha)</span>
                </label>
                <textarea name="ingredientes" value={form.ingredientes} onChange={handleChange} required rows={5}
                  placeholder={"1 Pepino\n2 Tomates\n5 folhas de alface"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Refeição</label>
                  <select name="refeicao" value={form.refeicao} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                    {refeicaoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Objetivo</label>
                  <select name="objetivo" value={form.objetivo} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                    {objetivoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tempo</label>
                  <select name="tempo" value={form.tempo} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                    {tempoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem</label>
                {IMAGENS_DISPONIVEIS.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhuma imagem encontrada em assets/receitas/</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {IMAGENS_DISPONIVEIS.map((img) => (
                      <button key={img} type="button" onClick={() => setForm((prev) => ({ ...prev, imagem: img }))}
                        className={`rounded-full px-3 py-1 text-sm border transition-all ${form.imagem === img ? "bg-purple-500 text-white border-purple-500" : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"}`}>
                        {img}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {sucesso && <div className="rounded-xl bg-green-100 px-4 py-3 text-green-700 font-medium">✅ Receita adicionada com sucesso!</div>}
              {erro && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700 font-medium">❌ {erro}</div>}

              <button type="submit" disabled={loading}
                className="rounded-full bg-purple-500 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-purple-600 disabled:opacity-60">
                {loading ? "Salvando..." : "Adicionar Receita"}
              </button>
            </form>
          </>
        )}

        {/* ABA: LISTAR / EXCLUIR */}
        {aba === "listar" && (
          <div className="flex flex-col gap-4">
            {carregandoLista ? (
              [1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />)
            ) : receitas.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Nenhuma receita cadastrada ainda.</p>
            ) : (
              receitas.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-lg truncate">{r.titulo}</p>
                    <p className="text-sm text-gray-400">{r.refeicao} · {r.objetivo} · {r.tempo}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditando(r); setAba("editar"); }}
                      className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-500 hover:bg-purple-200 transition-all">
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleDeletar(r.id!)} disabled={deletando === r.id}
                      className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-200 transition-all disabled:opacity-50">
                      {deletando === r.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA: EDITAR */}
        {aba === "editar" && (
          <>
            {!editando ? (
              <p className="text-center text-gray-400 py-10">Selecione uma receita na aba <strong>Receitas</strong> para editar.</p>
            ) : (
              <form onSubmit={handleSalvarEdicao} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                  <input type="text" value={editando.titulo} required
                    onChange={(e) => setEditando((p) => p && ({ ...p, titulo: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ingredientes * <span className="text-gray-400 font-normal">(um por linha)</span>
                  </label>
                  <textarea rows={5} required
                    value={Array.isArray(editando.ingredientes) ? editando.ingredientes.join("\n") : editando.ingredientes}
                    onChange={(e) => setEditando((p) => p && ({ ...p, ingredientes: e.target.value.split("\n") }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Refeição</label>
                    <select value={editando.refeicao} onChange={(e) => setEditando((p) => p && ({ ...p, refeicao: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                      {refeicaoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Objetivo</label>
                    <select value={editando.objetivo} onChange={(e) => setEditando((p) => p && ({ ...p, objetivo: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                      {objetivoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tempo</label>
                    <select value={editando.tempo} onChange={(e) => setEditando((p) => p && ({ ...p, tempo: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200">
                      {tempoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem</label>
                  {IMAGENS_DISPONIVEIS.length === 0 ? (
                    <p className="text-sm text-gray-400">Nenhuma imagem encontrada em assets/receitas/</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {IMAGENS_DISPONIVEIS.map((img) => (
                        <button key={img} type="button" onClick={() => setEditando((p) => p && ({ ...p, imagem: img }))}
                          className={`rounded-full px-3 py-1 text-sm border transition-all ${editando.imagem === img ? "bg-purple-500 text-white border-purple-500" : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50"}`}>
                          {img}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {sucesso && <div className="rounded-xl bg-green-100 px-4 py-3 text-green-700 font-medium">✅ Receita atualizada! Voltando...</div>}
                {erro && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700 font-medium">❌ {erro}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setAba("listar"); setEditando(null); }}
                    className="flex-1 rounded-full bg-gray-200 px-8 py-4 text-lg font-bold text-gray-600 hover:bg-gray-300 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 rounded-full bg-purple-500 px-8 py-4 text-lg font-bold text-white hover:bg-purple-600 transition-all disabled:opacity-60">
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ABA: CATEGORIAS */}
        {aba === "categorias" && (
          <div className="flex flex-col gap-8">
            {[
              { label: "🍽️ Refeição", opts: refeicaoOpts, setter: setRefeicaoOpts, input: novaRefeicao, inputSetter: setNovaRefeicao, key: "cat_refeicao" },
              { label: "🎯 Objetivo", opts: objetivoOpts, setter: setObjetivoOpts, input: novoObjetivo, inputSetter: setNovoObjetivo, key: "cat_objetivo" },
              { label: "⏱️ Tempo", opts: tempoOpts, setter: setTempoOpts, input: novoTempo, inputSetter: setNovoTempo, key: "cat_tempo" },
            ].map(({ label, opts, setter, input, inputSetter, key }) => (
              <div key={key} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-700 text-lg mb-3">{label}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {opts.map((op) => (
                    <div key={op} className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                      {op}
                      <button onClick={() => removerOpcao(op, setter as any, key)} className="ml-1 text-purple-400 hover:text-red-500 font-bold">×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => inputSetter(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarOpcao(input, setter as any, inputSetter, key))}
                    placeholder="Nova categoria..."
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-base focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  <button type="button" onClick={() => adicionarOpcao(input, setter as any, inputSetter, key)}
                    className="rounded-xl bg-purple-500 px-4 py-2 text-white font-semibold hover:bg-purple-600 transition-all">
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
