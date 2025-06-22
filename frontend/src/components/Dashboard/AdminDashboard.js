import { useEffect, useState } from "react";
import CreateAsset from "../Forms/CreateAsset";
import CreateBase from "../Forms/CreateBase";
import CreditToBase from "../Forms/CreditToBase";
import axios from "axios";

const AdminDashboard = ({ user, token, activeSection, setActiveSection }) => {
  const [stats, setStats] = useState({
    totalBases: 0,
    totalAssets: 0,
    totalUsers: 0
  });

  const getAllStats = async () => {
    try {
      const resBase = await axios.get(
        "http://localhost:8080/api/v1/base/get-all-base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resAsset = await axios.get(
        "http://localhost:8080/api/v1/asset/get-all-asset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resUsers = await axios.get(
        "http://localhost:8080/api/v1/user/get-all-users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats({
        ...stats,
        totalBases: resBase.data.bases.length,
        totalAssets: resAsset.data.assets.length,
        totalUsers: resUsers.data.users.length
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStats();
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "create-asset", label: "Create Asset", icon: "📦" },
    { id: "create-base", label: "Create Base", icon: "🏢" },
    { id: "credit-base", label: "Credit to Base", icon: "💰" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "create-asset":
        return <CreateAsset token={token} />;
      case "create-base":
        return <CreateBase token={token} />;
      case "credit-base":
        return <CreditToBase token={token} />;
      default:
        return (
          <div className="overview-content">
            <h2>Admin Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>Total Bases</h3>
                  <p className="stat-number">{stats.totalBases}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>Total Assets</h3>
                  <p className="stat-number">{stats.totalAssets}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👮‍♂️</div>
                <div className="stat-info">
                  <h3>Total Strength</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="role-dashboard">
      <nav className="dashboard-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
