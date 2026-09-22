import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider
      theme={{
        primaryColor: "green",
        colors: {
          green: [
            "#eef7f0",
            "#dff3e6",
            "#c6e8d0",
            "#aadcb8",
            "#8acf9f",
            "#6dc286",
            "#4fb56c",
            "#27834D",
            "#1f6a3d",
            "#173f2a",
          ],
        },
      }}
    >
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
