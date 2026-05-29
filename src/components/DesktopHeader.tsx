import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

type HeaderTabKey = "inicio" | "exercicios" | "alimentacao" | "bem-estar" | "sobre";

type DesktopHeaderProps = {
  activeTab: HeaderTabKey;
};

const navItems: Array<{ key: HeaderTabKey; label: string; to: string }> = [
  { key: "inicio", label: "Início", to: "/" },
  { key: "exercicios", label: "Exercícios", to: "/exercicios" },
  { key: "alimentacao", label: "Alimentação", to: "/alimentacao" },
  { key: "bem-estar", label: "Bem-Estar", to: "/bem-estar" },
  { key: "sobre", label: "Sobre nós", to: "/sobre" },
];

export default function DesktopHeader({ activeTab }: DesktopHeaderProps) {
  return (
    <header className="relative hidden md:block">
      <div className="relative bg-gray-50 py-4 lg:py-6">
        <div className="absolute left-6 top-1/2 flex -translate-y-1/2 items-center md:left-8 lg:left-10">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 w-12 cursor-pointer" />
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-2 md:px-4 lg:px-6">
          <nav className="flex flex-wrap justify-center gap-3 text-lg font-semibold text-purple-500 md:gap-6 md:text-xl lg:gap-12 lg:text-2xl">
            {navItems.map((item) => {
              const isActive = item.key === activeTab;

              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={
                    isActive
                      ? "text-yellow-500 underline underline-offset-4"
                      : "transition-all hover:text-yellow-500"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="h-2 w-full bg-yellow-500 shadow-md" />
    </header>
  );
}