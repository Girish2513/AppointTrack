// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import NotFound from "../pages/NotFound";
// import PrivateRoute from "./PrivateRoute";

// export default function AppRoutes() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  // Check authentication safely
  const isAuthenticated = localStorage.getItem("access") !== null;

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if logged in */}
        <Route path="/" element={isAuthenticated ? <Navigate replace to="/dashboard" /> : <Login />} />

        {/* Protect Dashboard */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate replace to="/" />} />

        {/* Catch all other routes (Optional) */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
