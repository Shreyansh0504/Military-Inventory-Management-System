import { useEffect, useState } from "react";
import "./Views.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const BaseDetails = ({ token, user }) => {
  const [baseData, setBaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchBaseDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://military-inventory-management-syste.vercel.app/api/v1/base/get-base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ base_id: user._doc.base_id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setBaseData(data.base);
      } else {
        setError(data.message || "Failed to fetch base details");
        setBaseData(null);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setBaseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseDetails();
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Base Details</h2>
        <p>View detailed information about a base</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {baseData && (
        <div className="details-card">
          <div className="card-header">
            <h3>{baseData.name}</h3>
            <span className="location-badge">{baseData.location}</span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Account Balance</span>
              <span className="detail-value balance">
                ₹{baseData.amount_in_account}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {new Date(baseData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">
                {new Date(baseData.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {baseData.assets && baseData.assets.length > 0 && (
            <div className="assets-section">
              <h4>Assets Inventory</h4>
              <div className="assets-grid">
                {baseData.assets.map((asset, index) => (
                  <div key={index} className="asset-card">
                    <div className="asset-info">
                      <span className="asset-name">
                        Asset ID: {asset.asset}
                      </span>
                      <span className="asset-quantity">
                        Qty: {asset.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {baseData.assignedAssets && baseData.assignedAssets.length > 0 && (
            <div className="assets-section">
              <h4>Assigned Assets</h4>
              <div className="assets-grid">
                {baseData.assignedAssets.map((asset, index) => (
                  <div key={index} className="asset-card assigned">
                    <div className="asset-info">
                      <span className="asset-name">
                        Asset ID: {asset.asset}
                      </span>
                      <span className="asset-quantity">
                        Qty: {asset.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseDetails;
