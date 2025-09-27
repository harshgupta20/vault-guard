import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import ErrorPage from "./pages/ErrorPage";
import Navbar from "./components/Navbar";
import FriendSecrets from "./pages/FriendSecrets";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="pt-20 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends-secret"
              element={
                <ProtectedRoute>
                  <FriendSecrets />
                </ProtectedRoute>
              }
            />
            <Route path="/team" element={<Team />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default App;
