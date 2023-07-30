import React, { useState } from "react";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "../component/Loading";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiButton,
  EuiIcon,
  EuiLink,
} from "@elastic/eui";
import "../sass/header.scss";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const capitalize = (username) => {
    return username.toUpperCase();
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      await dispatch(logout());
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <EuiFlexGroup
      className="container-header"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      {isLoading && <Loading msg="Loading..." />}
      <EuiFlexGroup gutterSize={0} justifyContent="spaceBetween">
        <EuiFlexItem>
          {/* <EuiText className="title">INVENTORY REQUISTION SYSTEM</EuiText> */}
          <EuiLink
            className="title"
            href="https://requisition.vercel.app/"
            onClick={() => {}}
          >
            INVENTORY REQUISTION SYSTEM
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem style={{ padding: "0 10px", color: "white" }} grow={false}>
          <EuiIcon size="l" type="user" />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText className="title">{` WELCOME ${capitalize(user)}`}</EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <EuiButton onClick={handleLogout} className="logout" size="m">
          LOGOUT
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Header;
