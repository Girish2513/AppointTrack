

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register"; // Make sure Register page is imported
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  // Check authentication safely
  const isAuthenticated = localStorage.getItem("access") !== null;

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if logged in */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate replace to="/dashboard" /> : <Login />}
        />
        
        {/* Protect Dashboard route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate replace to="/" />}
        />

        {/* Register page */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate replace to="/dashboard" /> : <Register />}
        />

        {/* Catch all other routes (Optional) */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

