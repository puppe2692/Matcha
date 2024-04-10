import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import Page404 from "./pages/Page404";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import ChatPage from "./pages/ChatPage";
import { WebSocketProvider } from "./context/WebSocketContext";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";

function App(): JSX.Element {
  // boilerplate for a route
  return (
    <WebSocketProvider>
      <NavBar />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/signin" Component={SigninPage} />
        <Route path="/signup" Component={SignupPage} />
        <Route path="/page1" Component={Page1} />
        <Route path="/page2" Component={Page2} />
        <Route path="/chat" Component={ChatPage} />
        <Route path="*" Component={Page404} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
