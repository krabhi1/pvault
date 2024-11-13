import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Root from "./routes/root";
import ErrorPage from "./error-page";
import AllProvider from "./AllProvider";
import Signin from "./routes/signin";
import Signup from "./routes/signup";
import ChangePassword from "./routes/change-password";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <AllProvider>
              <Outlet />
            </AllProvider>
          }
        >
          <Route index element={<Root />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
