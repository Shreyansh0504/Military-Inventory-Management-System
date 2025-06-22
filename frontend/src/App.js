import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import LoadingSpinner from "./components/UI/LoadingSpinner";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentView("login");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && token) {
    return <Dashboard user={user} token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="app-title">Asset Management System</h1>
          <div className="auth-tabs">
            <button
              className={`tab-btn ${currentView === "login" ? "active" : ""}`}
              onClick={() => setCurrentView("login")}
            >
              Login
            </button>
            <button
              className={`tab-btn ${
                currentView === "register" ? "active" : ""
              }`}
              onClick={() => setCurrentView("register")}
            >
              Register
            </button>
          </div>
        </div>

        <div className="auth-content">
          {currentView === "login" ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegisterSuccess={() => setCurrentView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
