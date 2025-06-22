import { useState } from "react";
import "./Auth.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    base_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = ["base commander", "logistics officer", "soldier"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://military-ims-backend.vercel.app/api/v1/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select your role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role[0].toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

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

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
