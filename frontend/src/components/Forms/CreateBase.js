import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreateBase = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
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
        "https://military-inventory-management-syste.vercel.app/api/v1/base/create-base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Base created successfully!" });
        setFormData({ name: "", location: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create base",
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
        <h2>Create New Base</h2>
        <p>Add a new base to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <label htmlFor="name">Base Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter base name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter base location"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Create Base"}
        </button>
      </form>
    </div>
  );
};

export default CreateBase;
