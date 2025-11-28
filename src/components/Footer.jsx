import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="p-3 md:p-5">
      <div className="flex justify-around">
        <nav className="inter flex flex-col no-underline justify-evenly gap-1 md:flex-row md:items-center md:justify-center md:gap-3 md:text-[1.125rem] lg:text-[1.05rem]">
          <Link
            className="transition-transform duration-300 hover:scale-110 hover:font-semibold text-white text-start hover:border-b-4 hover:border-white"
            to="/"
            title="Ir para o início"
          >
            Início
          </Link>
          <Link
            className="transition-transform duration-300 hover:scale-110 hover:font-semibold text-white text-start hover:border-b-4 hover:border-white"
            to="/sobre"
            title="Saiba mais!"
          >
            Sobre nós
          </Link>
        </nav>
        <div className="flex flex-col justify-center items-center gap-2 border-2 border-white rounded-md w-1/2 p-2 md:justify-evenly md:flex-row md:text-[1.125rem] lg:w-1/3 ">
          <p className="inter font-semibold">Conecte-se conosco!</p>
          <div className="flex gap-3 md:w-1/3">
            <a
              className="flex items-center justify-end"
              href="https://www.instagram.com/fala_dor_ufms?igsh=dTExYmI2djZxcG00"
              target="_blank"
            >
              <FaInstagram size={35} color="#F58529" className="transition-transform duration-300 hover:scale-110" alt="Instagram do Grupo 6 do PET Saúde Digital" title="Siga-nos no Instagram!"/>
            </a>
            <a
              className="flex items-center justify-start"
              href="https://whatsapp.com/channel/0029Vb7adIb72WTtJYBC2h0R"
              target="_blank"
            >
              <FaWhatsapp size={35} color="#25D366" className="transition-transform duration-300 hover:scale-110" alt="Canal do WhatsApp do Grupo 6 do PET Saúde Digital" title="Acompanhe-nos no WhatsApp!"/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
