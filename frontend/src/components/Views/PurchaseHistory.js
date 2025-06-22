import { useEffect, useState } from "react";
import "./Views.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const PurchaseHistory = ({ token, user }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(false);

  const fetchPurchases = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://military-ims-backend.vercel.app/api/v1/purchase/get-purchase",
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
        setPurchases(data.purchase || []);
      } else {
        setError(data.message || "Failed to fetch purchases");
        setPurchases([]);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Purchase History</h2>
        <p>View all asset purchases for a base</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {purchases.length > 0 && (
        <div className="history-container">
          <div className="titleWithButton">
            <h3>Purchase Records</h3>
            <div className="sortContainer">
              <span>Sort By Date</span>
              <span
                className="sortBtn"
                onClick={() => {
                  setSortBy(!sortBy);
                  setPurchases([...purchases].reverse());
                }}
              >
                {sortBy ? "Old to New" : "New to Old"}
              </span>
            </div>
          </div>
          <div className="history-grid">
            {purchases.map((purchase, index) => (
              <div key={index} className="history-card">
                <div className="card-header">
                  <span className="purchase-id">Purchase #{index + 1}</span>
                  <span className="purchase-date">
                    {new Date(purchase.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="purchase-details">
                  <div className="purchase-info">
                    <span className="asset-id">Asset: {purchase.asset_id}</span>
                    <span className="quantity">Qty: {purchase.quantity}</span>
                  </div>
                  <div className="cost-info">
                    <span className="cost">Cost: ₹{purchase.cost}</span>
                    <span className="base-id">Base: {purchase.base_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {purchases.length === 0 && !loading && !error && user._doc.base_id && (
        <div className="no-data">
          <p>No purchase records found for this base.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
