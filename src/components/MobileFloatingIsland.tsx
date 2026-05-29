import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

type TabKey = "inicio" | "exercicios" | "alimentacao" | "bem-estar" | "sobre";

type MobileFloatingIslandProps = {
  activeTab: TabKey;
};

const menuItems: Array<{ key: TabKey; label: string; to: string }> = [
  { key: "inicio", label: "Inicio", to: "/" },
  { key: "exercicios", label: "Exercicios", to: "/exercicios" },
  { key: "alimentacao", label: "Alimentacao", to: "/alimentacao" },
  { key: "bem-estar", label: "Bem-Estar", to: "/bem-estar" },
  { key: "sobre", label: "Sobre nós", to: "/sobre" },
];

export default function MobileFloatingIsland({ activeTab }: MobileFloatingIslandProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed left-1/2 top-4 z-50 w-[90%] -translate-x-1/2 md:hidden">
      <div
        className={`overflow-hidden rounded-[30px] bg-purple-500 shadow-2xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-80 p-6" : "max-h-16 p-2"
        } flex flex-col items-center`}
      >
        {isMenuOpen && (
          <nav className="mb-6 flex w-full flex-col items-center gap-4">
            {menuItems.map((item) => {
              const isActive = item.key === activeTab;

              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={
                    isActive
                      ? "w-full border-b border-purple-300 pb-2 text-center text-xl font-bold text-white"
                      : "text-lg text-purple-100"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-12 w-full items-center justify-between px-4"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <img src={logo} alt="Logo" className="h-8 w-8 brightness-0 invert" />
          <span className="font-bold uppercase tracking-widest text-white">
            {isMenuOpen ? "Fechar" : "Menu"}
          </span>
          <div className="text-xl text-white">{isMenuOpen ? "X" : "="}</div>
        </button>
      </div>
    </div>
  );
}
