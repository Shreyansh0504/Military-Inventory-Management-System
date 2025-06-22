import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreateAsset = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
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
        "https://military-inventory-management-syste.vercel.app/api/v1/asset/create-asset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            price: Number.parseFloat(formData.price),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Asset created successfully!" });
        setFormData({ name: "", type: "", price: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create asset",
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
        <h2>Create New Asset</h2>
        <p>Add a new asset to the system</p>
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
          <label htmlFor="type">Asset Type</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter asset type"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-input"
            placeholder="Enter asset price"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Create Asset"}
        </button>
      </form>
    </div>
  );
};

export default CreateAsset;
