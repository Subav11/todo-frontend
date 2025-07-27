import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";

export default function Header() {
  const { user } = useContext(AppContext);
  return (
    <div>
      <h1>TodoMate</h1>
      <div>
        {user?.token ? (
          <>
            {" "}
            <Link to="/dashboard">DashBoard</Link>{" "}
            <Link to="/logout">Logout</Link>{" "}
          </>
        ) : (
          <Link to="/"></Link>
        )}
      </div>
    </div>
  );
}
