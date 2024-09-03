import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

const blackColor: MantineColorsTuple = [
  "#888888",
  "#696969",
  "#696969",
  "#606060",
  "#505050",
  "#404040",
  "#303030",
  "#202020",
  "#181818",
  "#101010",
];

const greenColor: MantineColorsTuple = [
  "#e5feee",
  "#d2f9e0",
  "#a8f1c0",
  "#7aea9f",
  "#53e383",
  "#3bdf70",
  "#2bdd66",
  "#1ac455",
  "#0caf49",
  "#00963c",
];

const theme = createTheme({
  colors: {
    blackColor,
    greenColor,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
