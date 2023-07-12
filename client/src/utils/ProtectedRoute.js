import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Cookies from "js-cookie";

const ProtectedRoute = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
    const userToken = Cookies.get('token')
    
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
    }
    setIsLoggedIn(true);
  };
  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return (
    <React.Fragment>
     { isLoggedIn ? props.children : null}
    </React.Fragment>
  );
};

export default ProtectedRoute;
