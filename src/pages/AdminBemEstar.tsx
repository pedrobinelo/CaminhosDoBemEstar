import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import DesktopHeader from "../components/DesktopHeader";
import MobileFloatingIsland from "../components/MobileFloatingIsland";

// Constantes adaptadas para o Bem-Estar
const DEFAULT_TEMA = ["Organização", "Relaxamento", "Respiração", "Movimento"];
const DEFAULT_FOCO = ["Ansiedade", "Estresse", "Sono", "Foco e Produtividade"];
const DEFAULT_TEMPO = ["< 5 min", "5-15 min", "15-30 min", "+ 30 min"];

// Puxa imagens da pasta do Bem-Estar
// @ts-ignore
const imagensContext = require.context("../assets/bem-estar", false, /\.(png|jpe?g|webp|gif)$/);
const IMAGENS_DISPONIVEIS: string[] = imagensContext.keys().map((k: string) => k.replace("./", ""));

// Nova interface baseada no seu banco de dados
type FormState = {
  titulo: string;
  descricao: string;
  passos: string;
  tema: string;
  foco: string;
  tempo: string;
  imagem: string;
};

const initialForm: FormState = {
  titulo: "",
  descricao: "",
  passos: "",
  tema: "",
  foco: "",
  tempo: "",
  imagem: "",
};

type Aba = "adicionar" | "listar" | "editar" | "categorias";

export default function AdminBemEstar() {
  const [aba, setAba] = useState<Aba>("adicionar");
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [atividades, setAtividades] = useState<any[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [deletando, setDeletando] = useState<string | null>(null);
  const [editando, setEditando] = useState<any | null>(null);

  // Estados dos Filtros
  const [temaOpts, setTemaOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_tema") || "null") ?? DEFAULT_TEMA; } catch { return DEFAULT_TEMA; }
  });
  const [focoOpts, setFocoOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_foco") || "null") ?? DEFAULT_FOCO; } catch { return DEFAULT_FOCO; }
  });
  const [tempoOpts, setTempoOpts] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cat_tempo_bem_estar") || "null") ?? DEFAULT_TEMPO; } catch { return DEFAULT_TEMPO; }
  });

  const [novoTema, setNovoTema] = useState("");
  const [novoFoco, setNovoFoco] = useState("");
  const [novoTempo, setNovoTempo] = useState("");

  function salvarCat(key: string, valores: string[]) {
    localStorage.setItem(key, JSON.stringify(valores));
  }

  function adicionarOpcao(valor: string, setter: any, inputSetter: any, key: string) {
    const v = valor.trim();
    if (!v) return;
    setter((prev: string[]) => {
      const nova = [...prev, v];
      salvarCat(key, nova);
      return nova;
    });
    inputSetter("");
  }

  function removerOpcao(valor: string, setter: any, key: string) {
    setter((prev: string[]) => {
      const nova = prev.filter((p) => p !== valor);
      salvarCat(key, nova);
      return nova;
    });
  }

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      tema: prev.tema || temaOpts[0] || "",
      foco: prev.foco || focoOpts[0] || "",
      tempo: prev.tempo || tempoOpts[0] || "",
    }));
  }, [temaOpts, focoOpts, tempoOpts]);

  // Função adaptada para buscar a coleção certa
  async function carregarAtividades() {
    setCarregandoLista(true);
    try {
      const snapshot = await getDocs(collection(db, "atividades_bem_estar"));
      const dados = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAtividades(dados);
    } catch (err: any) {
      console.error(err);
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    if (aba === "listar") carregarAtividades();
  }, [aba]);

  async function handleDeletar(id: string) {
    if (!window.confirm("Tem certeza que quer excluir esta atividade?")) return;
    setDeletando(id);
    try {
      await deleteDoc(doc(db, "atividades_bem_estar", id));
      setAtividades((prev) => prev.filter((r) => r.id !== id));
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
      await updateDoc(doc(db, "atividades_bem_estar", editando.id), {
        titulo: editando.titulo,
        descricao: editando.descricao,
        passos: Array.isArray(editando.passos)
          ? editando.passos.map((i: string) => i.trimEnd()).filter(Boolean)
          : (editando.passos as string).split("\n").map((i) => i.trimEnd()).filter(Boolean),
        tema: editando.tema,
        foco: editando.foco,
        tempo: editando.tempo,
        imagem: editando.imagem,
      });
      setSucesso(true);
      await carregarAtividades();
      setTimeout(() => { setAba("listar"); setEditando(null); setSucesso(false); }, 1000);
    } catch (err: any) {
      setErro("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSucesso(false);
    setErro(null);
    try {
      await addDoc(collection(db, "atividades_bem_estar"), {
        titulo: form.titulo,
        descricao: form.descricao,
        passos: form.passos.split("\n").map((i) => i.trimEnd()).filter(Boolean),
        tema: form.tema,
        foco: form.foco,
        tempo: form.tempo,
        imagem: form.imagem,
        criadoEm: new Date(),
      });
      setSucesso(true);
      setForm({ ...initialForm, tema: temaOpts[0] || "", foco: focoOpts[0] || "", tempo: tempoOpts[0] || "" });
    } catch (err: any) {
      setErro("Erro ao salvar atividade: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const abaBtnClass = (a: Aba) =>
    `px-5 py-2 rounded-full font-semibold text-sm transition-all ${
      aba === a ? "bg-blue-500 text-white" : "bg-gray-200 text-blue-600 hover:bg-gray-300"
    }`;

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="bem-estar" />
      <MobileFloatingIsland activeTab="bem-estar" />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-center text-4xl font-bold text-blue-500 mb-2 md:text-5xl">
          Admin — Bem-Estar
        </h1>
        <p className="text-center text-gray-500 mb-6">Gerencie as atividades do site</p>
        <div className="h-0.5 w-full bg-blue-400 mb-6" />

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className={abaBtnClass("adicionar")} onClick={() => setAba("adicionar")}>➕ Adicionar</button>
          <button className={abaBtnClass("listar")} onClick={() => setAba("listar")}>📋 Atividades</button>
          <button className={abaBtnClass("editar")} onClick={() => setAba("editar")}>✏️ Editar</button>
          <button className={abaBtnClass("categorias")} onClick={() => setAba("categorias")}>🏷️ Categorias</button>
        </div>

        {aba === "adicionar" && (
          <>
            <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-700">
              <strong>📁 Como adicionar imagens:</strong> coloque o arquivo em{" "}
              <code className="bg-blue-100 px-1 rounded">src/assets/bem-estar/</code> e selecione abaixo.
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Ex: Respiração 4-7-8"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Breve *</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange} required rows={2}
                  placeholder={"Uma breve introdução sobre a atividade..."}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Passos da Atividade * <span className="text-gray-400 font-normal">(um por linha)</span>
                </label>
                <textarea name="passos" value={form.passos} onChange={handleChange} required rows={4}
                  placeholder={"Inspire por 4 segundos\nSegure por 7 segundos\nExpire por 8 segundos"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tema</label>
                  <select name="tema" value={form.tema} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                    {temaOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Foco</label>
                  <select name="foco" value={form.foco} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                    {focoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tempo</label>
                  <select name="tempo" value={form.tempo} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                    {tempoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem</label>
                {IMAGENS_DISPONIVEIS.length === 0 ? (
                  <p className="text-sm text-gray-400">Nenhuma imagem encontrada em assets/bem-estar/</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {IMAGENS_DISPONIVEIS.map((img) => (
                      <button key={img} type="button" onClick={() => setForm((prev) => ({ ...prev, imagem: img }))}
                        className={`rounded-full px-3 py-1 text-sm border transition-all ${form.imagem === img ? "bg-blue-500 text-white border-blue-500" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}>
                        {img}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {sucesso && <div className="rounded-xl bg-green-100 px-4 py-3 text-green-700 font-medium">✅ Atividade adicionada com sucesso!</div>}
              {erro && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700 font-medium">❌ {erro}</div>}

              <button type="submit" disabled={loading}
                className="rounded-full bg-blue-500 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-blue-600 disabled:opacity-60">
                {loading ? "Salvando..." : "Adicionar Atividade"}
              </button>
            </form>
          </>
        )}

        {aba === "listar" && (
          <div className="flex flex-col gap-4">
            {carregandoLista ? (
              [1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />)
            ) : atividades.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Nenhuma atividade cadastrada ainda.</p>
            ) : (
              atividades.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-lg truncate">{a.titulo}</p>
                    <p className="text-sm text-gray-400">{a.tema} · {a.foco} · {a.tempo}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditando(a); setAba("editar"); }}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-200 transition-all">
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleDeletar(a.id!)} disabled={deletando === a.id}
                      className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-200 transition-all disabled:opacity-50">
                      {deletando === a.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {aba === "editar" && (
          <>
            {!editando ? (
              <p className="text-center text-gray-400 py-10">Selecione uma atividade na aba <strong>Atividades</strong> para editar.</p>
            ) : (
              <form onSubmit={handleSalvarEdicao} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                  <input type="text" value={editando.titulo} required
                    onChange={(e) => setEditando((p: any) => p && ({ ...p, titulo: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Breve *</label>
                  <textarea rows={2} required value={editando.descricao}
                    onChange={(e) => setEditando((p: any) => p && ({ ...p, descricao: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Passos da Atividade * <span className="text-gray-400 font-normal">(um por linha)</span>
                  </label>
                  <textarea rows={4} required
                    value={Array.isArray(editando.passos) ? editando.passos.join("\n") : editando.passos}
                    onChange={(e) => setEditando((p: any) => p && ({ ...p, passos: e.target.value.split("\n") }))}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tema</label>
                    <select value={editando.tema} onChange={(e) => setEditando((p: any) => p && ({ ...p, tema: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      {temaOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Foco</label>
                    <select value={editando.foco} onChange={(e) => setEditando((p: any) => p && ({ ...p, foco: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      {focoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tempo</label>
                    <select value={editando.tempo} onChange={(e) => setEditando((p: any) => p && ({ ...p, tempo: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      {tempoOpts.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem</label>
                  {IMAGENS_DISPONIVEIS.length === 0 ? (
                    <p className="text-sm text-gray-400">Nenhuma imagem encontrada em assets/bem-estar/</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {IMAGENS_DISPONIVEIS.map((img) => (
                        <button key={img} type="button" onClick={() => setEditando((p: any) => p && ({ ...p, imagem: img }))}
                          className={`rounded-full px-3 py-1 text-sm border transition-all ${editando.imagem === img ? "bg-blue-500 text-white border-blue-500" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"}`}>
                          {img}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {sucesso && <div className="rounded-xl bg-green-100 px-4 py-3 text-green-700 font-medium">✅ Atividade atualizada! Voltando...</div>}
                {erro && <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700 font-medium">❌ {erro}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setAba("listar"); setEditando(null); }}
                    className="flex-1 rounded-full bg-gray-200 px-8 py-4 text-lg font-bold text-gray-600 hover:bg-gray-300 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 rounded-full bg-blue-500 px-8 py-4 text-lg font-bold text-white hover:bg-blue-600 transition-all disabled:opacity-60">
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {aba === "categorias" && (
          <div className="flex flex-col gap-8">
            {[
              { label: "🧩 Tema", opts: temaOpts, setter: setTemaOpts, input: novoTema, inputSetter: setNovoTema, key: "cat_tema" },
              { label: "🎯 Foco", opts: focoOpts, setter: setFocoOpts, input: novoFoco, inputSetter: setNovoFoco, key: "cat_foco" },
              { label: "⏱️ Tempo", opts: tempoOpts, setter: setTempoOpts, input: novoTempo, inputSetter: setNovoTempo, key: "cat_tempo_bem_estar" },
            ].map(({ label, opts, setter, input, inputSetter, key }) => (
              <div key={key} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-700 text-lg mb-3">{label}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {opts.map((op) => (
                    <div key={op} className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {op}
                      <button onClick={() => removerOpcao(op, setter, key)} className="ml-1 text-blue-400 hover:text-red-500 font-bold">×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => inputSetter(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarOpcao(input, setter, inputSetter, key))}
                    placeholder="Nova categoria..."
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  <button type="button" onClick={() => adicionarOpcao(input, setter, inputSetter, key)}
                    className="rounded-xl bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition-all">
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