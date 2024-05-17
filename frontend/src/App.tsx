import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
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
import MyPage from "./pages/MyPage";
import ViewPage from "./pages/ViewPage";
import LikePage from "./pages/LikePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// pas bien compris la diff element vs compenent, tu peux m'expliquer?

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
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/signout" element={<SignOutPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile/:username" Component={UserProfile} />
              <Route path="/profile/me" Component={MyPage} />
              <Route path="/view" element={<ViewPage />} />
              <Route path="/like" element={<LikePage />} />
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
