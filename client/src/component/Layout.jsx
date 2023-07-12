import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";



import { Outlet } from "react-router-dom";
const Layout = () => {
  const [username, setUserName] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const name = jwt_decode(token);
    setUserName(name.username);
  }, []);




  return (
    <>
      <Header user={username} />
      <Outlet />
    </>
  );
};

export default Layout;
