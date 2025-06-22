import { useEffect, useState } from "react";
import "./Views.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const TransferHistory = ({ token, user }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sortBy, setSortBy]=useState(false)

  const fetchTransfers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/transfer/get-transfer",
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
        setTransfers(data.transfers || []);
      } else {
        setError(data.message || "Failed to fetch transfers");
        setTransfers([]);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Transfer History</h2>
        <p>View all asset transfers for a base</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {transfers.length > 0 && (
        <div className="history-container">
          <div className="titleWithButton">
            <h3>Transfer Records</h3>
            <div className="sortContainer">
              <span>Sort By Date</span>
              <span className="sortBtn" onClick={()=>{
                setSortBy(!sortBy);
                setTransfers([...transfers].reverse());
              }}>{sortBy?"Old to New": "New to Old"}</span>
            </div>
          </div>
          <div className="history-grid">
            {transfers.map((transfer, index) => (
              <div key={index} className="history-card">
                <div className="card-header">
                  <span className="transfer-id">Transfer #{index + 1}</span>
                  <span className="transfer-date">
                    {new Date(transfer.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="transfer-details">
                  <div className="transfer-route">
                    <span className="from-base">
                      From: {transfer.from_base_id}
                    </span>
                    <span className="arrow">→</span>
                    <span className="to-base">To: {transfer.to_base_id}</span>
                  </div>
                  <div className="asset-info">
                    <span className="asset-id">Asset: {transfer.asset_id}</span>
                    <span className="quantity">Qty: {transfer.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transfers.length === 0 && !loading && !error && user._doc.id && (
        <div className="no-data">
          <p>No transfer records found for this base.</p>
        </div>
      )}
    </div>
  );
};

export default TransferHistory;
