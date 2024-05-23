import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Page404 from "./pages/Page404";
import ChatPage from "./pages/ChatPage";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UserProvider } from "./context/UserContext";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import SignOutPage from "./pages/SignOutPage";
import LoadingPage from "./pages/LoadingPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfile from "./pages/UserProfilPage";
import ViewPage from "./pages/ViewPage";
import LikePage from "./pages/LikePage";
import FirstConnectionPage from "./pages/FirstConnectionPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import ResearchPage from "./pages/ResearchPage";
import MyPage from "./pages/MyPage";
import WelcomePage from "./pages/WelcomePage";

function App(): JSX.Element {
  // boilerplate for a route
  return (
    <UserProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/firstco" element={<FirstConnectionPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MyPage />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/signout" element={<SignOutPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/profile/me" element={<MyPage />} />
              <Route path="/view" element={<ViewPage />} />
              <Route path="/like" element={<LikePage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
