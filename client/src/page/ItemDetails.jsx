import React, { useState, useEffect, useRef } from "react";
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
  EuiTitle,
  EuiIcon,
  EuiStat,
  EuiPanel,
  EuiSwitch,
  EuiTextColor,
  EuiSplitPanel,
  EuiCode,
  EuiLoadingSpinner,
} from "@elastic/eui";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { fetchALlItems, getCount, getItembyName } from "../redux/ItemSlice";
import { setLoading } from "../redux/ItemSlice";
import "../sass/loading.scss";

const ItemDetails = () => {
  const { id } = useParams();
  const [isLoading, setLoadings] = useState(true);
  const [requestedItems, setRequestedItems] = useState([]);
  const [visitCount, setVisitCount] = useState(0);

  const onToggleChange = (e) => {
    setLoadings(e.target.checked);
  };
  const { itemsDetail, loading } = useSelector((state) => state.item);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [decodedUser, setDecodedUser] = useState({});
  const [available, setAvailable] = useState();
  const { state } = useLocation();
  const fetchref = useRef(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const token = Cookies.get("token");
  const user = jwt_decode(token);
  const item = itemsDetail.filter((item) => item.name == id);

  const customButtons = [
    <EuiButton
      onClick={() => navigate("/dash")}
      color="transparent"
      fill
      iconType="home"
    >
      <EuiText style={{ fontWeight: "700", fontFamily: "Roboto" }}>
        Home
      </EuiText>
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
      dispatch(setLoading(true))
      await dispatch(fetchALlItems());
      dispatch(setLoading(false))
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

  const getItemByName = async () => {
    try {
      const response = await dispatch(getItembyName(id));
      setRequestedItems(response.payload);
      if (!response.payload) {
        navigate("/*");
      }
    } catch (error) {}
  };

  const getVisitCount = async () => {
    try {
      const response = await dispatch(getCount(id));
      setVisitCount(response.payload.count);
    } catch (error) {}
  };

  const pendingRequest = requestedItems.filter((item) => {
    return item.Status == false;
  });

  const grantedRequest = requestedItems.filter((item) => {
    return item.Status == true;
  });

  useEffect(() => {
    if (fetchref.current === false) {
      getUserDetail();
      getItems();
      getItemByName();
      getVisitCount();
    }

    return () => (fetchref.current = true);
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [isAdmin]);

  useEffect(() => {
    setAvailable(state?.available);
  }, []);

  const handleRequest = () => {
    navigate(`/requestPage/${item[0]?.name}`, {
      state: { item, decodedUser, available },
    });
  };
  const pageTitleProps = {
    style: { fontFamily: "Roboto", fontSize: "32px" },
  };

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        alignItems="center"
        rightSideItems={customButtons}
        bottomBorder="extended" //if sidebar exists, bottomborder should be true
      >
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiIcon type="pageSelect" size="xl" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiTitle size="l" {...pageTitleProps}>
              <h1>Item Details</h1>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Header>
      <EuiPageTemplate.Section grow={true}>
       {loading ?  <EuiEmptyPrompt
          className="loading"
          icon={<EuiLoadingSpinner size="xxl" />}
          title={<h2>Loading...</h2>}
        /> : (
        <>
          <EuiEmptyPrompt
            icon={
              <EuiImage
                size="fullWidth"
                src={item[0]?.image?.url}
                alt="Image1"
              />
            }
            title={<h2>Get your preferred item.</h2>}
            layout="horizontal"
            color="plain"
            body={
              <>
                <p>
                  {item[0]?.name} is a high-quality, versatile, and reliable
                  designed to cater to your specific needs. Whether you're a
                  professional or a hobbyist, this product is engineered to
                  deliver exceptional performance and exceed your expectations.
                </p>
                <p>{item[0]?.description}</p>
              </>
            }
            actions={[
              <EuiButton
                disabled={state?.available > 0 ? false : true}
                onClick={handleRequest}
                fill
                color="primary"
              >
                Request
              </EuiButton>,
              isAdmin && (
                <EuiButton fill color="primary">
                  Edit
                </EuiButton>
              ),
            ]}
          />
          <EuiSpacer />
          <EuiHorizontalRule />
          <EuiSpacer />
          <div>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiPanel hasBorder={true}>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiStat
                        title={pendingRequest.length}
                        textAlign="left"
                        isLoading={isLoading}
                        titleColor="accent"
                        description={
                          <EuiTextColor color="accent">
                            <span>
                              <EuiIcon type="clock" color="accent" />{" "}
                              {!isLoading && pendingRequest.length > 0
                                ? (pendingRequest.length /
                                    requestedItems.length) *
                                  100
                                : 0}
                              %
                            </span>
                          </EuiTextColor>
                        }
                      >
                        Pending Requests
                      </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiStat
                        title={grantedRequest.length}
                        textAlign="right"
                        isLoading={isLoading}
                        titleColor="success"
                        description={
                          <EuiTextColor color="success">
                            <span>
                              <EuiIcon type="check" color="success" />
                              {!isLoading && grantedRequest.length > 0
                                ? (grantedRequest.length /
                                    requestedItems.length) *
                                  100
                                : 0}
                              %
                            </span>
                          </EuiTextColor>
                        }
                      >
                        Granted
                      </EuiStat>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPanel>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiPanel hasBorder={true}>
                  <EuiFlexGroup alignItems="center">
                    <EuiFlexItem>
                      <EuiStat
                        title={requestedItems.length}
                        textAlign="left"
                        isLoading={isLoading}
                        description={
                          <EuiTextColor color="success">
                            <span>
                              <EuiIcon type="tokenTokenCount" color="success" />
                            </span>
                          </EuiTextColor>
                        }
                      >
                        Total Requests
                      </EuiStat>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiStat
                        title={visitCount}
                        textAlign="right"
                        isLoading={isLoading}
                        titleColor="success"
                        description={
                          <EuiTextColor color="success">
                            <span>
                              <EuiIcon type="faceHappy" color="success" />
                            </span>
                          </EuiTextColor>
                        }
                      >
                        Visit count
                      </EuiStat>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPanel>
              </EuiFlexItem>
              {/* <EuiFlexItem>
                  <EuiPanel hasBorder={true}>
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <EuiStat
                          title="1,554"
                          textAlign="left"
                          isLoading={isLoading}
                          titleColor="danger"
                          description="Good news"
                        >
                          <EuiTextColor color="accent">
                            <span>
                              <EuiIcon type="error" color="danger" /> 66,55%
                            </span>
                          </EuiTextColor>
                        </EuiStat>
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiStat
                          title="8,888"
                          description="Great news"
                          textAlign="left"
                          isLoading={isLoading}
                        >
                          <EuiTextColor color="success">
                            <span>
                              <EuiIcon type="sortUp" /> 27,83%
                            </span>
                          </EuiTextColor>
                        </EuiStat>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>
                </EuiFlexItem> */}
            </EuiFlexGroup>
            <EuiSpacer />
            <EuiSpacer />
            <EuiSwitch
              label="Show as loading"
              checked={isLoading}
              onChange={onToggleChange}
            />
          </div>
          <EuiSpacer />
          <EuiSpacer />
          <EuiFlexGroup gutterSize="l">
            <EuiFlexItem>
              <EuiPanel
                grow={true}
                color="subdued"
                style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)" }}
              >
                <EuiFlexGroup alignItems="center" direction="column">
                  <EuiFlexItem>
                    <EuiImage size="s" src="/stock.png" />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiText
                      color="subdued"
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                      }}
                    >
                      Stock : {state?.count}
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPanel
                grow={true}
                color="subdued"
                style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)" }}
              >
                <EuiFlexGroup alignItems="center" direction="column">
                  <EuiFlexItem>
                    <EuiImage size="s" src="/approvedRequest.png" />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiText
                      color="subdued"
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                      }}
                    >
                      Available : {state?.available}
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
        )}
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default ItemDetails;
name;
