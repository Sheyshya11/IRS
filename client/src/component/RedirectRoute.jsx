import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Outlet } from "react-router-dom";

const RedirectRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const isUserLoggedIn = () => {
    const token = Cookies.get("token");

    if (token && token !== "undefined") {
      setIsLoggedIn(true);
      return navigate("/dash");
    }
    setIsLoggedIn(false);
  };

  useEffect(() => {
    isUserLoggedIn();
  }, [isLoggedIn]);

  return <>{!isLoggedIn ? <Outlet /> : null}</>;
};

export default RedirectRoute;
