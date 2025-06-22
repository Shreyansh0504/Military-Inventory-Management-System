import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreatePurchase = ({ token, user }) => {
  const [formData, setFormData] = useState({
    name: "",
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
        "https://military-inventory-management-syste.vercel.app/api/v1/purchase/create-purchase",
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
        setMessage({ type: "success", text: "Asset purchased successfully!" });
        setFormData({ name: "", quantity: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to purchase asset",
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
        <h2>Create Purchase</h2>
        <p>Purchase assets for your base</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <label htmlFor="name">Asset Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
            placeholder="Enter quantity to purchase"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Purchase Asset"}
        </button>
      </form>
    </div>
  );
};

export default CreatePurchase;
