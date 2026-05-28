import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exercicios from "./pages/Exercicios";
import Alimentacao from "./pages/Alimentacao";
import BemEstar from "./pages/BemEstar";
import Sobre from "./pages/Sobre";
import AdminReceitas from "./pages/AdminReceitas";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/alimentacao" element={<Alimentacao />} />
        <Route path="/bem-estar" element={<BemEstar />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/admin/receitas" element={<AdminReceitas />} />
      </Routes>
    </Router>
  );
}