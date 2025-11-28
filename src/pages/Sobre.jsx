import { useEffect } from "react";

// Importar componentes
import BigText from "../components/ui/BigText";
import Image from "../components/ui/Image";

function Sobre() {
  useEffect(() => {
    document.title = "Sobre nós";
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="inter font-bold text-xl">O QUE É O PET SAÚDE DIGITAL?</h2>
        <BigText textVariant="secondary">
          É um programa nacional que visa a transformação digital do SUS,
          integrando ensino, saúde e comunidade através de tecnologias, pesquisa
          e inovação.
        </BigText>
        <h2 className="inter font-bold text-xl">Grupo 6 | PET Saúde Digital</h2>
        <BigText textVariant="secondary">
          Nosso grupo explora como a telessaúde pode fortalecer o acompanhamento
          de condições crônicas, com ênfase na fibromialgia, ampliando o acesso,
          o monitoramento e a reabilitação.
        </BigText>
        <div className="grid grid-cols-3 items-center w-[80%] md:w-[60%] lg:w-[40%] p-4 border-2 rounded-md mt-2 md:mt-4">
          <Image
            src="assets/img/pet_saude_logo.png"
            alt="Logo do PET Saúde"
            className="rounded-md"
          />
          <Image src="assets/img/g6-pet.png" alt="Logo do Grupo 6" />
          <Image src="assets/img/ufms_logo_azul.png" alt="Logo da UFMS" />
        </div>
      </div>
    </>
  );
}

export default Sobre;
