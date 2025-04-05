
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for the login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Define the route for the register page */}
        <Route path="/register" element={<Register />} />
        
        {/* Define the route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Optionally, you can add a redirect or a default route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
