import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-center items-center gap-4 p-5">
      <h1 className="m-0 transition-transform duration-300 hover:scale-105 text-[1.5rem]">
        <Link className="pacifico text-inherit no-underline" to="/" title="Ir para o início">
          Caminhos do Bem-Estar
        </Link>
      </h1>

      <div className="flex justify-center items-center">
        <Link to="/" title="Ir para o início">
          <img
            className="w-10 lg:w-12 transition-transform duration-300 hover:scale-110"
            src="/assets/img/lotus.png"
            alt="Logo do Caminhos do Bem-Estar"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
