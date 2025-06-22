import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreateTransfer = ({ token, user }) => {
  const [formData, setFormData] = useState({
    to_base_id: "",
    asset_name: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/transfer/create-transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            quantity: Number.parseInt(formData.quantity),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Asset transferred successfully!",
        });
        setFormData({ to_base_id: "", asset_name: "", quantity: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to transfer asset",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Create Transfer</h2>
        <p>Transfer assets between bases</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <label htmlFor="to_base_id">To Base ID</label>
          <input
            type="text"
            id="to_base_id"
            name="to_base_id"
            value={formData.to_base_id}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter destination base ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="asset_name">Asset Name</label>
          <input
            type="text"
            id="asset_name"
            name="asset_name"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter asset name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="form-input"
            placeholder="Enter quantity to transfer"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Transfer Asset"}
        </button>
      </form>
    </div>
  );
};

export default CreateTransfer;
