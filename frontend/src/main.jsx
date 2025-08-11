import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              padding: "12px",
              color: "#691c1c",
              fontSize: "16px",
            },
          }}
          containerStyle={{
            top: 70,
            left: 20,
            bottom: 20,
            right: 20,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
