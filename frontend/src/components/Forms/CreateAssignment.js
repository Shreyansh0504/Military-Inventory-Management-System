import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreateAssignment = ({ token, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    assigned_to: "",
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
        "https://military-ims-backend.vercel.app/api/v1/assign/assign-asset",
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
        setMessage({ type: "success", text: "Asset assigned successfully!" });
        setFormData({ name: "", quantity: "", assigned_to: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to assign asset",
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
        <h2>Create Assignment</h2>
        <p>Assign assets to personnel</p>
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
            placeholder="Enter quantity to assign"
          />
        </div>

        <div className="form-group">
          <label htmlFor="assigned_to">Assigned To</label>
          <input
            type="text"
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter person name or ID"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Assign Asset"}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
