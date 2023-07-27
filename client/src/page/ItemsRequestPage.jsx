import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestedItems } from "../redux/ItemSlice";
import {
  EuiTable,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableBody,
  EuiTableRow,
  EuiTableRowCell,
  EuiButton,
  EuiSpacer,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiEmptyPrompt,
  EuiPageTemplate,
  EuiSelect,
  EuiComboBox,
  EuiImage,
  EuiBadge,
  EuiCard,
  EuiLoadingSpinner,
} from "@elastic/eui";
import Loading from "../component/Loading";
import AssignSSID from "../component/AssignSSID";
import { useNavigate, Link } from "react-router-dom";
import { approveItemRequest } from "../redux/ItemSlice";
import "../sass/ItemRequestPage.scss";
import "../sass/loading.scss";

const ItemsRequestPage = () => {
  const { requestedItems, allItems } = useSelector((state) => state.item);
  const [assign, setAssign] = useState(false);
  const [ssidAssign, setSSIDAssign] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [approveItems, setApproveItems] = useState(false);
  const [reqUnit, setReqUnit] = useState();

  const [listOfItemsAssigned, setListOfItemsAssigned] = useState([]);
  const [approve, setApprove] = useState(false);
  const [userId, setUserId] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRequestedItems = async () => {
    setLoading(true);
    await dispatch(getRequestedItems());
    setLoading(false);
  };
  useEffect(() => {
    fetchRequestedItems();
    setSelectedItems([]);
  }, [approve]);

  const refineEmail = (email) => {
    console.log(email);
    var firstChar = email.charAt(0).toUpperCase();
    var remainingChars = email.slice(1).toLowerCase();

    return firstChar + remainingChars;
  };

  useEffect(() => {
    setListOfItemsAssigned(selectedItems);
  }, [selectedItems]);

  const requestItemArray = requestedItems
    .map((obj1) => {
      const matchingObj = allItems.find((obj2) => obj2.name === obj1.itemName);
      if (matchingObj) {
        return { ...obj1, ssid: matchingObj.ssid };
      }
      return obj1;
    })
    .filter((item) => {
      return item.Status == false;
    });

  const handleAssign = (ssids, id, name, itemName, email, requnit, userId) => {
    if (listOfItemsAssigned[0]?.email == email || selectedItems.length == 0) {
      setAssign(true);
      setSSIDAssign(ssids);
      setID(id);
      setDeviceName(itemName);
      setName(name);
      setEmail(email);
      setReqUnit(requnit);
      setUserId(userId);
    } else {
      alert("Diff user");
    }
  };
  console.log(selectedItems);

  //approve request
  const handleSubmit = async () => {
    const listofitems = listOfItemsAssigned.map((itm) => {
      return {
        name: itm.deviceName,
        serialNumbers: itm.devices,
        id: itm.id,
      };
    });

    const SerialNumbers = listofitems.map((device) => {
      return device.serialNumbers;
    });

    const listofSN = [].concat(...SerialNumbers);

    try {
      const item = {
        name: listOfItemsAssigned[0].name,
        devices: listofitems,
        listofSN,
        email: listOfItemsAssigned[0].email,
        userId: listOfItemsAssigned[0].userId,
      };
      console.log(item);

      const response = await dispatch(approveItemRequest(item));
      setApproveItems(false);
      setApprove(true);

      console.log(response);
    } catch (error) {}
  };

  const customButtons = [
    <EuiButton fill onClick={() => navigate("/dash")}>
      Dashboard
    </EuiButton>,

    listOfItemsAssigned?.length > 0 && (
      <EuiButton onClick={() => setApproveItems(true)} color="primary" fill>
        Submit
      </EuiButton>
    ),
  ];

  return (
    <>
      {loading && (
             <Loading msg="Loading..."/>
      )}
      <EuiPageTemplate restrictWidth={"95%"} grow={true}>
        <EuiPageTemplate.Header
          breadcrumbs={[
            {
              text: "Approved Requests",
              onClick: () => {
                navigate("/RequestHistory/");
              },
            },
            {
              text: "Pending Requests",
              onClick: () => {},
            },
          ]}
          rightSideItems={customButtons}
          bottomBorder="extended"
        />
        <EuiPageTemplate.Section grow={true}>
          <EuiTable>
            <EuiTableHeader align="center">
              <EuiTableHeaderCell align="center">S.N</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">
                Requester Email
              </EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Item Name</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Image</EuiTableHeaderCell>
              {/* <EuiTableHeaderCell align="center">Available SSID</EuiTableHeaderCell> */}
              <EuiTableHeaderCell align="center">
                Required Unit
              </EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Purpose</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Stock</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">
                Granted Unit
              </EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Action</EuiTableHeaderCell>
            </EuiTableHeader>
            <EuiTableBody>
              {requestItemArray.map((item, index) => (
                <>
                  <EuiTableRow
                    key={item?._id}
                    style={{ background: item.selected ? "#eafcea" : "" }}
                  >
                    <EuiTableRowCell align="center">
                      {index + 1}
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{refineEmail(item?.userId?.email)}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.itemName}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <EuiImage style={{}} src={item?.image.url} />
                    </EuiTableRowCell>

                    <EuiTableRowCell align="center">
                      <b>{item?.RequiredUnit}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.Purpose}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.ssid?.length}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.GrantedUnit}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <>
                        <EuiButton
                          onClick={() =>
                            handleAssign(
                              item?.ssid,
                              item?._id,
                              item?.userId?.username,
                              item?.itemName,
                              item?.userId?.email,
                              item?.RequiredUnit,
                              item?.userId?._id
                            )
                          }
                          color="primary"
                          fill
                          size="s"
                        >
                          Assign
                        </EuiButton>
                      </>
                    </EuiTableRowCell>
                  </EuiTableRow>
                </>
              ))}
            </EuiTableBody>
          </EuiTable>
          <EuiSpacer />
          {approveItems && (
            <div className="approveItem">
              <EuiEmptyPrompt
                layout="horizontal"
                color="plain"
                title={<h2>Approve Assigned Items</h2>}
                body={<p>Email will be sent with the assigned items.</p>}
                actions={
                  <>
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <EuiButton onClick={handleSubmit} color="warning" fill>
                          Approve
                        </EuiButton>
                      </EuiFlexItem>
                      <EuiFlexItem onClick={() => setApproveItems(false)}>
                        <EuiButton>Cancel</EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </>
                }
              />
            </div>
          )}
          {assign && (
            <AssignSSID
              ssids={ssidAssign}
              setAssign={setAssign}
              requestId={id}
              name={name}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              deviceName={deviceName}
              email={email}
              reqUnit={reqUnit}
              userId={userId}
            />
          )}
        </EuiPageTemplate.Section>
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
    </>
  );
};

export default ItemsRequestPage;
