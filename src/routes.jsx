import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App";
import Home from "./pages";
import Booking from "./pages/booking";
import PageNotFound from "./pages/pageNotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);
