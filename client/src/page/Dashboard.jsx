import React, { useEffect, useState, useRef } from "react";
import { EuiPageTemplate, EuiText, EuiButton, EuiCard } from "@elastic/eui";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import "../sass/dashboard.scss";

import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Setting from "./Setting";

import { useDispatch, useSelector } from "react-redux";
import { setAdmin, setDashboard, setSetting } from "../redux/dashboardSlice";

import { fetchItems } from "../redux/ItemSlice";
import { getAllUser } from "../redux/fetchDataSlice";
import { setLoading } from "../redux/ItemSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchref = useRef(false);
  const status = useSelector((state) => state.dashboard);
  const [isAdmin, setIsAdmin] = useState(false);
  const { items } = useSelector((state) => state.item);
  const [filteredItems, setFilteredItems] = useState([]);
  const [load, setLoad] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);


  const token = Cookies.get("token");
  const user = jwt_decode(token);


  const checkAdmin = () => {
  

    if (user.roles == "Admin") {
      setIsAdmin(true);
      return;
    }
    setIsAdmin(false);
  };
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    checkAdmin();
  }, [isAdmin]);

  //fetch items info
  const getItems = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(fetchItems());

      dispatch(setLoading(false));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getItems();
    dispatch(setDashboard());
  }, []);

  // fetch user info
  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(getAllUser());
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fetchref.current === false) {
      fetchUser();
    }

    return () => (fetchref.current = true);
  }, []);

  const customButtons = [
    isAdmin && status.admin && (
      <EuiButton
        onClick={() => navigate("/createItem")}
        color="primary"
        size="m"
        fill
      >
        Create Item
      </EuiButton>
    ),
    isAdmin && status.admin && (
      <EuiButton
        onClick={() => navigate("/itemRequests")}
        color="primary"
        size="m"
        fill
      >
        Request page
      </EuiButton>
    ),
  ];

  useEffect(() => {
    setLoad(false);
  }, []);
  return (
    <EuiPageTemplate restrictWidth={"75%"} grow={true}>
      <EuiPageTemplate.Header
        breadcrumbs={
          isAdmin
            ? [
                {
                  text: "Profile",
                  onClick: () => {
                    navigate(`/profile/${user.userId}`);
                  },
                },
                {
                  text: "Settings",
                  onClick: () => {
                    dispatch(setSetting());
                  },
                },
                {
                  text: "Admin Page",
                  onClick: () => {
                    dispatch(setAdmin());
                  },
                },

                {
                  text: "Dashboard",
                  onClick: () => {
                    dispatch(setDashboard());
                  },
                },
              ]
            : [
                {
                  text: "Profile",
                  onClick: () => {
                    navigate(`/profile/${user.userId}`);
                  },
                },
                {
                  text: "Settings",
                  onClick: () => {
                    dispatch(setSetting());
                  },
                },
                {
                  text: "Dashboard",
                  onClick: () => {
                    dispatch(setDashboard());
                  },
                },
              ]
        }
        rightSideItems={customButtons}
        bottomBorder="extended"
      />
      <>
        <EuiPageTemplate.Section grow={true}>
          {status.admin && (
            <>
              <AdminDashboard />
            </>
          )}

          {status.dashboard && (
            <>
              <UserDashboard
                setFilteredItems={setFilteredItems}
                filteredItems={filteredItems}
                setLoad={setLoad}
                load={load}
                setSearchField={setSearchField}
                searchField={searchField}
                initialLoad={initialLoad}
                setInitialLoad={setInitialLoad}
              />
            </>
          )}
          {status.setting && (
            <>
              <Setting />
            </>
          )}
        </EuiPageTemplate.Section>
      </>
      <EuiPageTemplate.BottomBar
        position="static"
        paddingSize="xl"
        style={{ background: "#2b2d40" }}
      >
        <EuiText
          style={{ fontWeight: "700" }}
          className="footer-text"
          textAlign="center"
        >
          &copy; DESIGNED BY SUBHAM SHRESTHA
        </EuiText>
      </EuiPageTemplate.BottomBar>
    </EuiPageTemplate>
  );
}
export default Dashboard;
