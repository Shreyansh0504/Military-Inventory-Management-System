import { useState } from "react";
import "./Forms.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const CreditToBase = ({ token }) => {
  const [formData, setFormData] = useState({
    base_name: "",
    amount: "",
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
        "http://localhost:8080/api/v1/expense/credit-expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            amount: Number.parseFloat(formData.amount),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `₹${formData.amount} credited successfully! New balance: ₹${data.updated_balance}`,
        });
        setFormData({ base_name: "", amount: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to credit amount",
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
        <h2>Credit to Base</h2>
        <p>Add funds to a base account</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <label htmlFor="base_name">Base Name</label>
          <input
            type="text"
            id="base_name"
            name="base_name"
            value={formData.base_name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter base name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-input"
            placeholder="Enter amount to credit"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Credit Amount"}
        </button>
      </form>
    </div>
  );
};

export default CreditToBase;
