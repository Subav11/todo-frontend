import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import "../styles/header.css"

export default function Header() {
  const { user } = useContext(AppContext);
  return (
      <nav className="nav">
        <h1 className="nav-title">TodoMate</h1>
        {user?.token ? (
          <div className="nav-items">
            <Link to="/dashboard">DashBoard</Link>
            <Link to="/logout">Logout</Link>
          </div>
        ) : (
          <Link to="/"></Link>
        )}
      </nav>
  );
}
