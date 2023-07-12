import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate()
  const checkAdmin = () => {
    const token = Cookies.get("token");
    const user = jwt_decode(token);
    if (user.roles == "Admin") {
      setIsAdmin(true);
      return
    }
    setIsAdmin(false);
     navigate("/unauthorized");
  };

  useEffect(() => {
    checkAdmin();
  }, [isAdmin]);

  return <>{isAdmin ? <Outlet /> : null}</>;
};

export default AdminRoute;
