import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import { router } from "./routes";
import GlobalContext from "./hooks/GlobalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <GlobalContext>
        <RouterProvider router={router} />
      </GlobalContext>
    </HelmetProvider>
  </React.StrictMode>
);
