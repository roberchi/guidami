import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "@mantine/core/styles.css";
import "./styles/global.scss";
import { App } from "./app/App";
import { store } from "./state/store";

const theme = createTheme({
  primaryColor: "forest",
  colors: {
    forest: [
      "#edf7f1",
      "#d7eadf",
      "#afd3bf",
      "#84ba9d",
      "#61a380",
      "#4b956f",
      "#3f8d68",
      "#327a58",
      "#286d4e",
      "#195d40"
    ]
  },
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: "500" },
  defaultRadius: "md"
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <App />
          <Analytics />
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
