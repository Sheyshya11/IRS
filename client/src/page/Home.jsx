import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Cookie from "js-cookie";
import jwt_decode from "jwt-decode";
import Footer from "../component/Footer";
import CountUp from "react-countup";

import "../sass/home.scss";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiImage,
  EuiSpacer,
  EuiButton,
} from "@elastic/eui";
import { setReset } from "../redux/dashboardSlice";
import { fetchALlItems } from "../redux/ItemSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  const token = Cookie.get("token");
  const user = jwt_decode(token);

  const checkPass = () => {
    if (!user?.passwordExists) {
      navigate("/createPassword");
    }
  };

  const getItems = async () => {
    try {
      const response = await dispatch(fetchALlItems());
      setItems(response.payload);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    checkPass();
  }, []);

  const navigateDashboard = () => {
    dispatch(setReset());
    navigate("/dash");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      {
        <EuiFlexGroup
          className="home-container"
          direction="column"
          gutterSize={0}
        >
          <EuiFlexItem>
            <EuiImage
              src="banner.png"
              size="fullWidth"
              className="banner-img"
              alt="Banner image"
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton onClick={navigateDashboard} className="dashboard" color>
              Go to Dashboard
            </EuiButton>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceAround" gutterSize={0}>
            <EuiFlexItem grow={false}>
              <EuiImage width={123} height={123} src="4.png" alt="image1" />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiImage src="2.png" alt="image2" />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiImage src="3.png" alt="image3" />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceAround" gutterSize={0}>
            <EuiFlexItem grow={false}>
              <EuiText className="home-text">No of Inventory items</EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText className="home-text">No of Inventory items</EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText className="home-text">No of Inventory items</EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="spaceAround" gutterSize={0}>
            <EuiFlexItem grow={false}>
              <div className="home-number">
                <CountUp start={0} end={items.length} />
              </div>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <div className="home-number">
                <CountUp start={0} end={items.length} />
              </div>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <div className="home-number">
                <CountUp start={0} end={items.length} />
              </div>
              {/* <EuiText className="home-number">{items.length}</EuiText> */}
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiSpacer />
          <Footer />
        </EuiFlexGroup>
      }
    </>
  );
};

export default Home;
