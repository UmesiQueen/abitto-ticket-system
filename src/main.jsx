import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { router } from "./routes";
import BookingContext from "./context/BookingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BookingContext>
      <RouterProvider router={router} />
    </BookingContext>
  </React.StrictMode>
);
