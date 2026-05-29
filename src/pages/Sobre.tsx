import React from "react";
import MobileFloatingIsland from "../components/MobileFloatingIsland";
import DesktopHeader from "../components/DesktopHeader";

import tuannyPhoto from "../assets/integrantes/tuanny.jpeg";

type TeamMember = {
  name: string;
  role: string;
  image?: string;
};

export default function Sobre() {
  const members: TeamMember[] = [
    {
      name: "Tuanny",
      role: "Estudante de Engenharia de Software",
      image: tuannyPhoto,
    },
    {
      name: "Integrante 02",
      role: "Função do integrante",
    },
    {
      name: "Integrante 03",
      role: "Função do integrante",
    },
    {
      name: "Integrante 04",
      role: "Função do integrante",
    },
    {
      name: "Integrante 05",
      role: "Função do integrante",
    },
    {
      name: "Integrante 06",
      role: "Função do integrante",
    },
    {
      name: "Integrante 07",
      role: "Função do integrante",
    },
    {
      name: "Integrante 08",
      role: "Função do integrante",
    },
    {
      name: "Integrante 09",
      role: "Função do integrante",
    },
    {
      name: "Integrante 10",
      role: "Função do integrante",
    },
    {
      name: "Integrante 11",
      role: "Função do integrante",
    },
    {
      name: "Integrante 12",
      role: "Função do integrante",
    },
    {
      name: "Integrante 13",
      role: "Função do integrante",
    },
    {
      name: "Integrante 14",
      role: "Função do integrante",
    },
    {
      name: "Integrante 15",
      role: "Função do integrante",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="sobre" />

      <MobileFloatingIsland activeTab="sobre" />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-center text-5xl font-bold text-purple-500 mb-10 md:text-6xl">
          Sobre Nós
        </h1>

        <div className="h-0.5 w-full bg-purple-400 mb-8" />

        <div className="bg-white rounded-3xl p-8 shadow-md mb-10">
          <h2 className="text-3xl font-bold text-purple-500 mb-4">
            Sobre o Projeto
          </h2>

          <p className="text-gray-700 text-lg leading-8">
            O FalaDor é um projeto
            desenvolvido com o propósito de promover
            qualidade de vida, bem-estar e acesso à
            informação para pessoas que convivem com
            dores crônicas e fibromialgia.
          </p>

          <p className="text-gray-700 text-lg leading-8 mt-4">
            Nossa proposta é disponibilizar conteúdos
            educativos, orientações sobre alimentação,
            exercícios físicos e práticas de bem-estar
            de forma acessível, acolhedora e intuitiva.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-purple-500 mb-8 text-center">
            Nossa Equipe
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {members.map((member, index) => (
              <div
                key={index}
                className="bg-[#d1d5db] rounded-3xl p-5 text-center transition-transform duration-300 hover:scale-[1.03]"
              >
                <div className="w-28 h-28 rounded-full bg-white mx-auto mb-4 overflow-hidden flex items-center justify-center shadow-sm">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm4.5 13.5a8.25 8.25 0 10-16.5 0"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="font-bold text-[#8A4FFF] text-lg">
                  {member.name}
                </h3>

                <p className="text-gray-700 text-sm mt-2">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}