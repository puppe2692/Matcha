import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import Page404 from "./pages/Page404";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import ChatPage from "./pages/ChatPage";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UserProvider } from "./context/UserContext";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import SignOutPage from "./pages/SignOutPage";
import LoadingPage from "./pages/LoadingPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfile from "./pages/UserProfilPage";

function App(): JSX.Element {
  // boilerplate for a route
  return (
    <UserProvider>
      <WebSocketProvider>
        <NavBar />
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/loading" Component={LoadingPage} />
          <Route path="/signin" Component={SigninPage} />
          <Route path="/signup" Component={SignupPage} />
          <Route path="/signout" Component={SignOutPage} />
          <Route path="/settings" Component={SettingsPage} />
          <Route path="/page1" Component={Page1} />
          <Route path="/page2" Component={Page2} />
          <Route path="/chat" Component={ChatPage} />
          <Route path="/profile/:username" Component={UserProfile} />
          <Route path="*" Component={Page404} />
        </Routes>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
