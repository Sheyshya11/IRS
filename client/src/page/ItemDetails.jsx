import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiImage,
  EuiPageTemplate,
  EuiSpacer,
  EuiText,
  EuiEmptyPrompt,
  EuiLoadingLogo,
} from "@elastic/eui";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";

import { fetchALlItems } from "../redux/ItemSlice";
import { setLoading } from "../redux/ItemSlice";
import "../sass/loading.scss";

const ItemDetails = () => {
  const { id } = useParams();
  const { items, loading } = useSelector((state) => state.item);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [decodedUser, setDecodedUser] = useState({});

  const [isAdmin, setIsAdmin] = useState(false);
  const token = Cookies.get("token");
  const user = jwt_decode(token);
  const item = items.filter((item) => item.name == id);
console.log(id)
  const customButtons = [
    <EuiButton onClick={() => navigate(-2)} color="transparent" size="m" fill>
      Home
    </EuiButton>,
   
  ];


  const checkAdmin = () => {
    if (user.roles == "Admin") {
      setIsAdmin(true);
      return;
    }
    setIsAdmin(false);
  };


  //fetch items info
  const getItems = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(fetchALlItems());
      dispatch(setLoading(false));
    } catch (error) {
      console.log({ error });
    }
  };

  const getUserDetail = () => {
    try {
      setDecodedUser(user);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getUserDetail();
    getItems();
  }, []);


  useEffect(() => {
    checkAdmin();
  }, [isAdmin]);

  const handleRequest = () => { 
    navigate(`/requestPage/${item[0]?._id}`, { state: { item, decodedUser } });
  };

  return (
    <EuiPageTemplate>
        <EuiPageTemplate.Header
        iconType="listAdd"
        pageTitle="Item Details"
        rightSideItems={customButtons}
        bottomBorder="extended" //if sidebar exists, bottomborder should be true
      ></EuiPageTemplate.Header>
      <EuiPageTemplate.Section grow={true}>
        {loading ? (
          <EuiEmptyPrompt
            className="loading"
            icon={<EuiLoadingLogo logo="logoKibana" size="xl" />}
            title={<h2>Loading...</h2>}
          />
        ) : (
          <>
            <EuiFlexGroup gutterSize={false}>
              <EuiFlexItem>
                <EuiImage alt="sad" src={item[0]?.image.url} />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiFlexGroup direction="column">
                  {isAdmin && (
                    <EuiFlexItem grow={false}>
                      <EuiButton fill color="primary">
                        Edit
                      </EuiButton>
                    </EuiFlexItem>
                  )}
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={handleRequest} fill color="primary">
                      Request
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer />
            <EuiHorizontalRule />
            <EuiFlexGroup alignItems="center">
              <EuiFlexItem>
                <EuiText textAlign="center" style={{ fontSize: "24px" }}>
                  NAME: {item[0]?.name}
                </EuiText>
              </EuiFlexItem>
          
              <EuiFlexItem>
                <EuiText
                  textAlign="center"
                  style={{ fontSize: "24px", whiteSpace: "pre-line" }}
                >
                  Description: {item[0]?.description}
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        )}
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default ItemDetails;
