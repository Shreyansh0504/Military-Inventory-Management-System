import BaseDetails from "../Views/BaseDetails";
import TransferHistory from "../Views/TransferHistory";
import PurchaseHistory from "../Views/PurchaseHistory";
import { useEffect, useState } from "react";
import axios from "axios";

const BaseCommanderDashboard = ({
  user,
  token,
  activeSection,
  setActiveSection,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "base-details", label: "Base Details", icon: "🏢" },
    { id: "transfers", label: "Transfer History", icon: "🔄" },
    { id: "purchases", label: "Purchase History", icon: "🛒" },
  ];

  const [stats, setStats] = useState({
    currentBalance: 0,
    assetsInStock: 0,
    totalAssignments: 0,
    totalTransfers: 0,
  });

  const getAllStats = async () => {
    try {
      const resBase = await axios.post(
        "https://military-inventory-management-syste.vercel.app/api/v1/base/get-base",
        { base_id: user._doc.base_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resTransfers = await axios.post(
        "https://military-inventory-management-syste.vercel.app/api/v1/transfer/get-transfer",
        { base_id: user._doc.base_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resAssignments = await axios.post(
        "https://military-inventory-management-syste.vercel.app/api/v1/assign/get-assignments",
        { base_id: user._doc.base_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalQuantity = resBase.data.base.assets.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setStats({
        ...stats,
        currentBalance: resBase.data.base.amount_in_account,
        assetsInStock: totalQuantity,
        totalAssignments: resAssignments.data.assignments.length,
        totalTransfers: resTransfers.data.transfers.length,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllStats();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "base-details":
        return <BaseDetails token={token} user={user} />;
      case "transfers":
        return <TransferHistory token={token} user={user} />;
      case "purchases":
        return <PurchaseHistory token={token} user={user} />;
      default:
        return (
          <div className="overview-content">
            <h2>Base Commander Overview</h2>
            <div className="welcome-message">
              <p>
                <b>
                  Welcome,{" "}
                  {user._doc.name[0].toUpperCase() + user._doc.name.slice(1)}!
                </b>{" "}
                Use the navigation to access base information and history.
              </p>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Current Balance</h3>
                    <p className="stat-number" style={{ color: "green" }}>
                      ₹. {stats.currentBalance}
                    </p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>Assets in Stock</h3>
                    <p className="stat-number">{stats.assetsInStock}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👮‍♂️</div>
                  <div className="stat-info">
                    <h3>Total Assignments</h3>
                    <p className="stat-number">{stats.totalAssignments}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔁</div>
                  <div className="stat-info">
                    <h3>Total Transfers</h3>
                    <p className="stat-number">{stats.totalTransfers}</p>
                  </div>
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
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.id === "overview") {
                    window.location.reload();
                  }
                }}
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

export default BaseCommanderDashboard;
