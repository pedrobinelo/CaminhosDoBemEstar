import { useState, useEffect } from "react";

import "../assets/css/home.css";

// Importar componentes
import BigText from "../components/ui/BigText";
import ModalBlock from "../components/ui/ModalBlock";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  // O que é Fibromialgia?
  const modalContent = {
    title: "O que é Fibromialgia?",
    content:
      "É uma síndrome caracterizada por dor crônica generalizada, fadiga, alterações do sono e da memória.<br>Atinge principalmente mulheres e impacta muito a qualidade de vida.",
  };

  useEffect(() => {
    document.title = "Caminhos do bem-estar";
  }, []);

  return (
    <>
      <BigText>
        Bem-vindo(a) ao seu espaço de cuidado e renovação! Viver com
        fibromialgia é um desafio, mas é possível encontrar alívio e alegria.
        Sua jornada para uma vida mais leve começa agora 😀.
      </BigText>
      <div className="grid grid-cols-2 sm:w-[80%] md:w-[65%] lg:w-[45%] mx-auto mt-4">
        <ModalBlock
          text="O que é fibromialgia?"
          imgSrc="/assets/img/interrogacao.png"
          imgAlt="O que é fibromialgia?"
          onClick={() => setModalOpen(true)}
        />
        <ModalBlock
          text="Exercícios"
          imgSrc="/assets/img/exercicio.png"
          imgAlt="Exercícios"
          onClick={() => toast("Página em construção. Aguarde!")}
        />
        <ModalBlock
          text="Alimentação"
          imgSrc="/assets/img/comida-saudavel.png"
          imgAlt="Alimentação"
          href="/alimentacao"
        />
        <ModalBlock
          text="Bem-estar"
          imgSrc="/assets/img/bem-estar.png"
          imgAlt="Bem-estar"
          onClick={() => toast("Página em construção. Aguarde!")}
        />
      </div>
      <Modal
        open={modalOpen}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default Home;
