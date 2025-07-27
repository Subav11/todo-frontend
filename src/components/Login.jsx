import axios from "axios";
import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../App";

export default function Login() {
  const formRef = useRef(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();
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
      const url = `${API_URL}/api/users/login`;
      const result = await axios.post(url, loginData);
      setUser(result.data);
      setMessage("Login successful! Redirecting...");
      Navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };
  return (
    <div>
      <h2>Login to TodoMate</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <p>
          <input
            type="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
        </p>
        <p>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </p>
      </form>
      <hr />
      <Link to="/register">Create an Account</Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
