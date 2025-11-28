import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";

// Componentes
import Router from "./components/Router";
import { Toaster } from "react-hot-toast";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter basename="/CaminhosDoBemEstar">
      <Toaster position="top-right" reverseOrder={false} />
      <Router />
    </BrowserRouter>
  </StrictMode>
);
