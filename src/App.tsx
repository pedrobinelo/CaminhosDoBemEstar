import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exercicios from "./pages/Exercicios";
import Alimentacao from "./pages/Alimentacao";
import BemEstar from "./pages/BemEstar";
import Sobre from "./pages/Sobre";

export default function App() {
  return (
    <Router basename="/CaminhosDoBemEstar">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/alimentacao" element={<Alimentacao />} />
        <Route path="/bem-estar" element={<BemEstar />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </Router>
  );
}