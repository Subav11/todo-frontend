import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";

export default function Register() {
  const Navigate = useNavigate();
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const url = `${API_URL}/api/users/register`;
      await axios.post(url, registerData);
      setMessage("Registered successfully! Redirecting to login...");
      Navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };
  return (
    <div>
      <h2>Register to TodoMate</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <p>
          <input
            type="email"
            placeholder="Enter Email Address"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Enter Password"
            minLength={6}
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            required
          />
        </p>
        <p>
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </p>
      </form>
      <hr />
      <Link to="/">Already have an account? Login here...</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
