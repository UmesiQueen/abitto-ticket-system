import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import { router } from "./routes";
import GlobalContext from "./hooks/GlobalContext";
import GlobalLayout from "./layout";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <GlobalContext>
        <GlobalLayout>
          <RouterProvider router={router} />
        </GlobalLayout>
      </GlobalContext>
    </HelmetProvider>
  </React.StrictMode>
);
