import { useNavigate } from "react-router-dom";

function ModalBlock({ text, imgSrc, imgAlt, onClick, href }) {
  // Inicializa o hook de navegação 
  const navigate = useNavigate();

  // Função que será executada ao clicar no bloco
  const handleClick = () => {
    if (href) {
      navigate(href); 
    } 
    else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex justify-between gap-2 no-underline sm:text-[0.85rem] md:text-[1rem] m-[10px] p-[10px] border border-white modal-block-bg transition-transform duration-300 hover:scale-105 min-h-[70px]"
    onClick={handleClick}
    // Acessibilidade
    role={href || onClick ? "button" : undefined}
    tabIndex={href || onClick ? 0 : undefined}
    >
      <p className="inter m-0 text-start">{text}</p>
      <div className="flex flex-col justify-center items-center">
        <img src={import.meta.env.BASE_URL + imgSrc} alt={imgAlt} width="30px" height="30px" />
      </div>
    </div>
  );
}

export default ModalBlock;
