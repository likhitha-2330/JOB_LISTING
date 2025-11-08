import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Jobs from "./components/Jobs/JobList";
import JobDetail from "./pages/JobDetail";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/ProfileSimple";
import EditProfile from "./pages/EditProfile";
import ApplicationTracking from "./pages/ApplicationTracking";
import EmployerDashboard from "./pages/EmployerDashboard";
import AuthStatus from "./pages/AuthStatus";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/applications" element={<ApplicationTracking />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/auth-status" element={<AuthStatus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
