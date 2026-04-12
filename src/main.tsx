import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const SPA_REDIRECT_KEY = "jinro.spaRedirect";

const normalizeSpaPath = (path: string) => {
  const [pathWithSearch, hashPart = ""] = path.split("#");
  const [pathnamePart, searchPart = ""] = pathWithSearch.split("?");

  const normalizedPathname =
    pathnamePart && pathnamePart !== "/" ? pathnamePart.replace(/\/+$/, "") || "/" : "/";

  const search = searchPart ? `?${searchPart}` : "";
  const hash = hashPart ? `#${hashPart}` : "";

  return `${normalizedPathname}${search}${hash}`;
};

const restoreSpaRedirect = () => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedCurrentPath = normalizeSpaPath(
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  );

  if (
    normalizedCurrentPath !==
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  ) {
    window.history.replaceState(null, "", normalizedCurrentPath);
  }

  const storedPath = window.sessionStorage.getItem(SPA_REDIRECT_KEY);

  if (!storedPath || window.location.pathname !== "/") {
    return;
  }

  window.sessionStorage.removeItem(SPA_REDIRECT_KEY);

  const normalizedStoredPath = normalizeSpaPath(storedPath);

  if (normalizedStoredPath !== "/") {
    window.history.replaceState(null, "", normalizedStoredPath);
  }
};

restoreSpaRedirect();

createRoot(document.getElementById("root")!).render(<App />);
