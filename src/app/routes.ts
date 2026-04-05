import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/chat",
    Component: ChatPage,
  },
]);
