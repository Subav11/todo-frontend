import { useEffect, useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { setUser } = useContext(AppContext);
  const Navigate = useNavigate();

  useEffect(() => {
    setUser({});
    Navigate("/");
  }, [setUser, Navigate]);
    return null;
}
