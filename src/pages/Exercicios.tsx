import React, { useMemo, useState } from "react";
import MobileFloatingIsland from "../components/MobileFloatingIsland";
import DesktopHeader from "../components/DesktopHeader";

import video1 from "../assets/videos/alongamento-90-90.mp4";
import video2 from "../assets/videos/alongamento-antebraco-pulso.mp4";
import video3 from "../assets/videos/alongamento-cervical.mp4";
import video4 from "../assets/videos/mobilidade-punho.mp4";
import video5 from "../assets/videos/alongamento-triceps.mp4";
import video6 from "../assets/videos/alongamento-lateral-coluna.mp4";
import video7 from "../assets/videos/alongamento-axial.mp4";
import video8 from "../assets/videos/alongamento-coxa.mp4";
import video9 from "../assets/videos/alongamento-isquiotibiais.mp4";
import video10 from "../assets/videos/alongamento-gluteos-quadril.mp4";
import video11 from "../assets/videos/alongamento-lombar.mp4";

type Difficulty = "Fácil" | "Médio" | "Difícil";

type Exercise = {
  name: string;
  difficulty: Difficulty;
  video: string;
};

export default function Exercicios() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("Todos");

  const exercises: Exercise[] = [
    {
      name: "Alongamento 90/90 de quadril",
      difficulty: "Médio",
      video: video1,
    },
    {
      name: "Alongamento de antebraço e pulso",
      difficulty: "Fácil",
      video: video2,
    },
    {
      name: "Alongamento para alívio cervical",
      difficulty: "Fácil",
      video: video3,
    },
    {
      name: "Mobilidade de punho",
      difficulty: "Fácil",
      video: video4,
    },
    {
      name: "Alongamento de tríceps",
      difficulty: "Fácil",
      video: video5,
    },
    {
      name: "Alongamento lateral da coluna",
      difficulty: "Médio",
      video: video6,
    },
    {
      name: "Alongamento axial",
      difficulty: "Médio",
      video: video7,
    },
    {
      name: "Alongamento de coxa",
      difficulty: "Médio",
      video: video8,
    },
    {
      name: "Alongamento de isquiotibiais",
      difficulty: "Médio",
      video: video9,
    },
    {
      name: "Alongamento de glúteos e quadril",
      difficulty: "Médio",
      video: video10,
    },
    {
      name: "Alongamento para a lombar (Prece Maometana)",
      difficulty: "Fácil",
      video: video11,
    },
  ];

  const filteredExercises = useMemo(() => {
    if (selectedDifficulty === "Todos") {
      return exercises;
    }

    return exercises.filter(
      (exercise) => exercise.difficulty === selectedDifficulty
    );
  }, [selectedDifficulty]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-24 font-sans md:pt-0">
      <DesktopHeader activeTab="exercicios" />

      <MobileFloatingIsland activeTab="exercicios" />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-center text-5xl font-bold text-purple-500 mb-10 md:text-6xl">
          Exercícios
        </h1>

        <div className="h-0.5 w-full bg-purple-400 mb-8" />

        <div className="flex justify-center mb-10">
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value)
              }
              className="appearance-none bg-[#e2e2e2] text-[#8A4FFF] font-semibold py-3 pl-6 pr-12 rounded-full outline-none cursor-pointer"
            >
              <option>Todos</option>
              <option>Fácil</option>
              <option>Médio</option>
              <option>Difícil</option>
            </select>

            <svg
              className="w-4 h-4 text-[#8A4FFF] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {filteredExercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-[#d1d5db] rounded-3xl p-5 shadow-md transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="overflow-hidden rounded-2xl shadow-sm mb-4 bg-white">
                <video
                  controls
                  className="w-full h-64 object-cover"
                >
                  <source
                    src={exercise.video}
                    type="video/mp4"
                  />
                  Seu navegador não suporta vídeo.
                </video>
              </div>

              <h2 className="text-xl font-bold text-[#8A4FFF] mb-2">
                {exercise.name}
              </h2>

              <span className="inline-block bg-white px-4 py-2 rounded-full text-sm font-semibold text-[#8A4FFF]">
                Dificuldade: {exercise.difficulty}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}