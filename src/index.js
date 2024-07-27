import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
//incorporamos estilos via global
//import "./styles/global.css";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
