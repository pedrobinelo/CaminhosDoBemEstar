import { Routes, Route } from "react-router-dom";

// Páginas
import Home from "../pages/Home";
import Sobre from "../pages/Sobre";
import Alimentacao from "../pages/Alimentacao";
import RecipeDetails from "./domain/RecipeDetails";
// TODO: Inserir rotas para as outras páginas quando forem criadas
// import Exercicios from "./pages/Exercicios";
// import BemEstar from "./pages/BemEstar";

// Componentes
import Layout from "../components/Layout";

function Router() {
  return (
    <>
      <Routes>
        {/* Página de detalhes SEM layout */}
        <Route path="/alimentacao/receita/:id" element={<RecipeDetails />} />

        {/* Rotas COM layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/alimentacao" element={<Alimentacao />} />
        </Route>
      </Routes>
    </>
  );
}
export default Router;
