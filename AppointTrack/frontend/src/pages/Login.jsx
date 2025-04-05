

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      navigate("/dashboard"); // Only navigate if the token exists
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const data = await response.json();

      // Check if token is available
      if (data.access && data.refresh) {
        // Store the tokens in localStorage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // Redirect to the dashboard after successful login
        setTimeout(() => navigate("/dashboard"), 500); // Delay navigation to ensure page is ready
      } else {
        throw new Error("Failed to retrieve tokens");
      }
    } catch (err) {
      setError(err.message); // Display error message
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };

  // Redirect to the register page
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-metallic">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Logging in..." : "Login"} {/* Show loading text */}
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <button
              onClick={handleRegister}
              className="text-blue-500 hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
