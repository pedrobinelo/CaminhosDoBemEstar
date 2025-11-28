import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// Imports do Firebase para o caso de o usuário recarregar a página
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-init.js";

// Componentes
import RecipeImageAndTitle from "./RecipeImageAndTitle.jsx";
import UnorderedList from "../ui/UnorderedList.jsx";
import OrderedList from "../ui/OrderedList.jsx";
import Button from "../ui/Button.jsx";
import ReactPlayer from "react-player";
import LoaderFullScreen from "../ui/LoaderFullScreen.jsx";
import { CgBowl } from "react-icons/cg";
import { IoTimeOutline } from "react-icons/io5";
import { MdFoodBank } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { BiFoodMenu } from "react-icons/bi";
import { MdError } from "react-icons/md";

import { mealLabels, benefitsLabels, timeLabels } from "../../constants/labels.js";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tenta obter a receita do state da navegação. Se não tiver, irá buscar no firebase
  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  // Se o objeto 'recipe' veio do state, não precisa carregar (loading=false).
  const [loading, setLoading] = useState(!location.state?.recipe);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verifica se a receita está na memória 
    if (recipe) {
      setLoading(false);
      document.title = recipe.title || "Detalhes da Receita";
      return;
    }

    // Se não tiver receita no state da navegação, irá buscar no Firebase.
    // Serve para o caso do usuário buscar a receita pelo link direto
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        // Busca no Firebase usando o ID da URL
        const docRef = doc(db, "receitas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe(docSnap.data());
          document.title = docSnap.data().title || "Detalhes da Receita";
        } else {
          setError("Nenhuma receita encontrada com este ID.");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes da receita:", err);
        setError("Não foi possível carregar os detalhes da receita.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, recipe]);

  if (loading) {
    return (
      <LoaderFullScreen />
    );
  }

  // Se houver erro ou não conseguir carregar o objeto
  if (error || !recipe) {
    return (
      <div className="flex flex-col gap-3 min-w-screen min-h-screen justify-center items-center p-4 text-center text-red-600">
        <MdError size={30} />
        <p className="text-xl font-semibold">{error || "Não foi possível exibir a receita."}</p>
        <Button onClick={() => navigate("/alimentacao")} variant="secondary">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="inter flex flex-col gap-4 min-w-screen min-h-screen">
        <RecipeImageAndTitle
          src={recipe.imageURL}
          alt={recipe.title}
          title={recipe.title}
        />
        <div>
          <Button
            variant="info"
            onClick={() => navigate(-1)}
            title="Voltar para a lista de receitas"
          >
            Voltar
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4 md:w-1/2 mx-auto">
          {recipe.videoURL && (
            <div className="flex justify-center items-center mx-4 rounded-md lg:w-[60%]">
              <ReactPlayer src={recipe.videoURL} controls width="100%" />
            </div>
          )}

          {/* Outras informações da receita */}
          <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between sm:text-sm">
              <p className="flex gap-1 justify-center items-center">
                <CgBowl size={24} />
                <b>Porções:</b> <span>{recipe.portions}</span>
              </p>
              <p className="flex gap-1 justify-center items-center">
                <IoTimeOutline size={24} />
                <b>Preparo: </b>
                <span>
                  {timeLabels[recipe.timeClassification] ||
                    recipe.timeClassification}
                </span>
                -
                <span>
                  <b>{recipe.time}</b> minutos
                </span>
              </p>
            </div>
            <p className="text-justify p-2 border-2 rounded-md bg-black bg-opacity-30 text-white">
              {recipe.reason}
            </p>
            <div className="flex justify-between mb-4">
              {recipe.meal && (
                <div>
                  <h3 className="text-lg text-left font-bold mb-2">
                    Serve para:
                  </h3>
                  <UnorderedList
                    items={Object.entries(recipe.meal)
                      .filter(([, value]) => value)
                      .map(([key]) => key)}
                    labels={mealLabels}
                    icon={MdFoodBank}
                  />
                </div>
              )}
              {recipe.benefits && (
                <div>
                  <h3 className="text-lg text-left font-bold mb-2">
                    Benefícios:
                  </h3>
                  <UnorderedList
                    items={Object.entries(recipe.benefits)
                      .filter(([, value]) => value)
                      .map(([key]) => key)}
                    labels={benefitsLabels}
                    icon={GiHealthNormal}
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-1">
                <BiFoodMenu size={24}/>
                Ingredientes
              </h3>
              <UnorderedList items={recipe.ingredients} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Modo de Preparo</h3>
              <OrderedList items={recipe.method} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeDetails;
