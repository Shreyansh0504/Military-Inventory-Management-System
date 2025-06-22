import { useState } from "react";
import "./Dashboard.css";
import AdminDashboard from "./AdminDashboard";
import BaseCommanderDashboard from "./BaseCommanderDashboard";
import LogisticsOfficerDashboard from "./LogisticsOfficerDashboard";

const Dashboard = ({ user, token, onLogout }) => {
  const [activeSection, setActiveSection] = useState("overview");
  const getRoleDisplayName = (role) => {
    return role
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderDashboardContent = () => {
    switch (user._doc.role.toLowerCase()) {
      case "admin":
        return (
          <AdminDashboard
            user={user}
            token={token}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        );
      case "base commander":
        return (
          <BaseCommanderDashboard
            user={user}
            token={token}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        );
      case "logistics officer":
        return (
          <LogisticsOfficerDashboard
            user={user}
            token={token}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        );
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Asset Management System</h1>
            <div className="user-info">
              <span className="user-name">
                {user._doc.name[0].toUpperCase() + user._doc.name.slice(1)}
              </span>
              <span className="user-role">
                {getRoleDisplayName(user._doc.role)}
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">{renderDashboardContent()}</main>
    </div>
  );
};

export default Dashboard;
