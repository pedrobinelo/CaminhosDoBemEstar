import { useEffect, useState, useMemo } from "react";

// Importar componentes
import PagePresentation from "../components/domain/PagePresentation";
import MainContent from "../components/domain/MainContent";
import PostsContainer from "../components/domain/PostsContainer";
import Dropdown from "../components/ui/Dropdown";
import Button from "../components/ui/Button";
import { ClipLoader } from "react-spinners";
import { MdError } from "react-icons/md";
import Carousel from "../components/domain/Carousel";
import PostsGrid from "../components/domain/PostsGrid";

// Firebase
import { db } from "../firebase/firebase-init";
import { collection, query, where, getDocs } from "firebase/firestore";

import {
  opcoesConteudos,
  opcoesRefeicoes,
  opcoesObjetivos,
  opcoesTempoPreparo,
} from "../constants/filters-options";

function savePostsAndFilters(posts, filtros) {
  sessionStorage.setItem("posts", JSON.stringify(posts));
  sessionStorage.setItem("filtros", JSON.stringify(filtros));
}

function loadPostsAndFilters() {
  const postsJson = sessionStorage.getItem("posts");
  const filtrosJson = sessionStorage.getItem("filtros");

  return {
    posts: postsJson ? JSON.parse(postsJson) : null,
    filtros: filtrosJson ? JSON.parse(filtrosJson) : null,
  };
}

/**
 * Esta função monta uma cláusula where de acordo com o tipo do campo no Firebase.
 * @param {string|null} filtro - O valor do filtro a ser aplicado.
 * @param {string} nomeFirebase - O nome do campo no Firestore.
 * @param {'map'|'string'} tipoDadoFirebase - O tipo do campo no Firestore.
 */
function getWhereClause(filtro, nomeFirebase, tipoDadoFirebase) {
  if (!filtro) return null;
  if (tipoDadoFirebase === "map") {
    return where(`${nomeFirebase}.${filtro}`, "==", true);
  }
  if (tipoDadoFirebase === "string") {
    return where(nomeFirebase, "==", filtro);
  }
  return null;
}

/**
 * Divide um array em vários subarrays de tamanho definido.
 * @param {Array} array - O array a ser dividido.
 * @param {number} size - O tamanho de cada subarray.
 * @returns {Array[]} Um array de subarrays.
 */
function chunkArray(array, size) {
  if (!array.length) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function Alimentacao() {
  const [postsPerSlide, setPostsPerSlide] = useState(4);
  const [mostrarConteudos, setMostrarConteudos] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);
  const [refeicaoSelecionada, setRefeicaoSelecionada] = useState(null);
  const [objetivoSelecionado, setObjetivoSelecionado] = useState(null);
  const [tempoPreparoSelecionado, setTempoPreparoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  // Ao carregar a página, tenta restaurar dados da memória local (pesquisa e filtros aplicados pelo usuário)
  useEffect(() => {
    const { posts: storedPosts, filtros: storedFilters } =
      loadPostsAndFilters();

    if (storedPosts && storedFilters) {
      setPosts(storedPosts);
      setMostrarConteudos(true);
      // Restaurar filtros
      setConteudoSelecionado(storedFilters.conteudoSelecionado);
      setRefeicaoSelecionada(storedFilters.refeicaoSelecionada);
      setObjetivoSelecionado(storedFilters.objetivoSelecionado);
      setTempoPreparoSelecionado(storedFilters.tempoPreparoSelecionado);
    }
  }, []);

  // Limpa os posts se mudar o tipo de conteúdo
  useEffect(() => {
    clearPosts();
  }, [conteudoSelecionado]);

  function clearPosts() {
    // Não limpa os posts se tiver conteúdo salvo no local storage
    const { posts: storedPosts, filtros: storedFilters } =
      loadPostsAndFilters();
    if (storedPosts && storedFilters) return;

    setMostrarConteudos(false);
    setPosts([]);
    setError("");
  }

  // Ajusta o grid de posts a depender do dispositivo
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setPostsPerSlide(6);
      } else {
        setPostsPerSlide(4);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const postSlides = useMemo(() => {
    return chunkArray(posts || [], postsPerSlide);
  }, [posts, postsPerSlide]);

  /**
   * Busca posts de acordo com os filtros aplicados pelo usuário
   */
  async function handleFetchFilteredPosts() {
    setMostrarConteudos(true);
    setLoading(true);
    setError("");
    // Lê os filtros
    const refeicao = refeicaoSelecionada?.value || null;
    const objetivo = objetivoSelecionado?.value || null;
    const tempoPreparo = tempoPreparoSelecionado?.value || null;

    let q = collection(db, "receitas");
    let constraints = [];

    if (refeicao) constraints.push(getWhereClause(refeicao, "meal", "map"));

    if (objetivo) constraints.push(getWhereClause(objetivo, "benefits", "map"));

    if (tempoPreparo)
      constraints.push(
        getWhereClause(tempoPreparo, "timeClassification", "string")
      );

    const finalQuery = constraints.length ? query(q, ...constraints) : q;

    try {
      const snapshot = await getDocs(finalQuery);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(posts);
      const currentFilters = {
        conteudoSelecionado,
        refeicaoSelecionada,
        objetivoSelecionado,
        tempoPreparoSelecionado,
      };
      // Salvar a pesquisa do usuário no LocalStorage
      savePostsAndFilters(posts, currentFilters);
      if (posts.length === 0) {
        setError("Nenhum resultado encontrado para os filtros selecionados.");
      }
    } catch (error) {
      console.log("Erro ao buscar posts: ", error);
      setError("Erro ao buscar posts filtrados.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Busca todos os posts, levando em conta apenas o conteúdo selecionado
   */
  async function handleFetchAllPosts() {
    setMostrarConteudos(true);
    setLoading(true);
    setError("");
    const conteudo = conteudoSelecionado?.value || null;

    let query;
    if (conteudo === "receita") {
      query = collection(db, "receitas");
    } else if (conteudo === "dica-nutricional") {
      // TODO: Ajustar quando houver conteúdo de dicas nutricionais no Firebase
      setPosts([]);
      setError("Ainda não há existe conteúdo de dicas nutricionais.");
      setLoading(false);
      return;
    }

    try {
      const snapshot = await getDocs(query);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(posts);
      const currentFilters = { conteudoSelecionado };
      // Salvar a pesquisa do usuário no LocalStorage
      savePostsAndFilters(posts, currentFilters);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      setError("Não foi possível carregar os posts.");
    } finally {
      setLoading(false);
    }
  }

  // Função para limpar filtros
  function handleLimparFiltros() {
    setPosts([]);
    setMostrarConteudos(false);
    setConteudoSelecionado(null);
    setRefeicaoSelecionada(null);
    setObjetivoSelecionado(null);
    setTempoPreparoSelecionado(null);
  }

  // Verifica se todos os filtros estão limpos
  const filtrosLimpos =
    !refeicaoSelecionada && !objetivoSelecionado && !tempoPreparoSelecionado;

  // Muda o título da página
  useEffect(() => {
    document.title = "Alimentação";
  }, []);

  return (
    <>
      <PagePresentation title={document.title} />
      <MainContent>
        <div className="flex flex-col w-[80%] justify-evenly lg:w-[80%] gap-2 p-2 md:w-1/2">
          <div className="flex flex-col justify-center items-center gap-3">
            <Dropdown
              options={opcoesConteudos}
              placeholderText="Conteúdos"
              variant="primary"
              textColor="light"
              value={conteudoSelecionado}
              onChange={setConteudoSelecionado}
            />
            <Button
              variant="info"
              onClick={handleFetchAllPosts}
              title={
                conteudoSelecionado?.value === "receita"
                  ? "Todas as receitas"
                  : conteudoSelecionado?.value === "dica-nutricional"
                  ? "Mostrar dicas"
                  : "Mostrar conteúdos"
              }
              disabled={!conteudoSelecionado}
            >
              {conteudoSelecionado?.value === "receita"
                ? "Mostrar receitas"
                : conteudoSelecionado?.value === "dica-nutricional"
                ? "Mostrar dicas"
                : "Mostrar conteúdos"}
            </Button>
            {conteudoSelecionado?.value === "receita" && (
              <>
                <h2 className="font-medium">Filtre receitas por:</h2>
                <Dropdown
                  options={opcoesRefeicoes}
                  placeholderText="Refeição"
                  value={refeicaoSelecionada}
                  onChange={setRefeicaoSelecionada}
                />
                <Dropdown
                  options={opcoesObjetivos}
                  placeholderText="Objetivos"
                  value={objetivoSelecionado}
                  onChange={setObjetivoSelecionado}
                />
                <Dropdown
                  options={opcoesTempoPreparo}
                  placeholderText="Tempo de Preparo"
                  value={tempoPreparoSelecionado}
                  onChange={setTempoPreparoSelecionado}
                />
                <div className="w-full flex justify-around mt-2">
                  <Button
                    variant="danger"
                    onClick={handleLimparFiltros}
                    disabled={filtrosLimpos}
                    title="Limpar filtros"
                  >
                    Limpar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleFetchFilteredPosts}
                    title="Aplicar filtros"
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <PostsContainer>
          {/* Mensagem de erro ou nenhum resultado */}
          {error ? (
            <p className="text-red-600 font-medium text-[1rem] border-none p-2 rounded-md w-full flex justify-evenly items-center text-justify gap-2 md:w-[90%]">
              <MdError size={30} />
              {error}
            </p>
          ) : !mostrarConteudos ? (
            <p className="text-white text-[1rem] border-none p-2 rounded-md w-full text-center">
              Selecione um conteúdo!
            </p>
          ) : null}
          {loading && (
            <div className="flex justify-center items-center w-full">
              <ClipLoader color="#fff" size={40} />
            </div>
          )}
          {/* Grid de posts */}
          {posts.length > 0 && !loading && (
            <div className="flex h-full justify-center items-center">
              <Carousel
                items={postSlides.map((postsChunk, index) => (
                  <PostsGrid key={index} posts={postsChunk} />
                ))}
              />
            </div>
          )}
        </PostsContainer>
      </MainContent>
    </>
  );
}

export default Alimentacao;
