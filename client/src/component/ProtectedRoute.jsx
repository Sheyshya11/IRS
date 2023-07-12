import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkUserToken = () => {
    const token = Cookies.get("token");
    if (!token || token === "undefined") {
      setIsLoggedIn(false);
      return navigate("/");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return (<>{isLoggedIn ? <Outlet /> : null}</>)
};

export default ProtectedRoute;
