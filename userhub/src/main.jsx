import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import AppLayout   from "./components/layout/AppLayout";
import Dashboard   from "./pages/Dashboard";
import UsersPage   from "./pages/UsersPage";
import AddUser     from "./pages/AddUser";
import EditUser    from "./pages/EditUser";
import UserDetail  from "./pages/UserDetail";
import NotFound    from "./pages/NotFound";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index        element={<Dashboard />}  />
              <Route path="users" element={<UsersPage />}  />
              <Route path="add"   element={<AddUser />}    />
              <Route path="edit/:id"  element={<EditUser />}   />
              <Route path="user/:id"  element={<UserDetail />} />
              <Route path="*"     element={<NotFound />}   />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);
