import { jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";
import { APP_NAME, APP_VARIANT_LABEL } from "./config/app.js";
document.title = `${APP_NAME} — ${APP_VARIANT_LABEL}`;
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsx(App, {}) }) }) })
);
