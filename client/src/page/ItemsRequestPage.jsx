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
} from "@elastic/eui";
import Loading from "../component/Loading";
import AssignSSID from "../component/AssignSSID";
import { useNavigate, Link } from "react-router-dom";

const ItemsRequestPage = () => {
  const { requestedItems, allItems } = useSelector((state) => state.item);
  const [assign, setAssign] = useState(false);
  const [ssidAssign, setSSIDAssign] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRequestedItems = async () => {
    setLoading(true);
    await dispatch(getRequestedItems());
    setLoading(false);
  };
  useEffect(() => {
    fetchRequestedItems();
  }, []);

  const refineEmail = (email) => {
    var firstChar = email.charAt(0).toUpperCase();
    var remainingChars = email.slice(1).toLowerCase();

    return firstChar + remainingChars;
  };

  const requestItemArray = requestedItems
    .map((obj1) => {
      const matchingObj = allItems.find(
        (obj2) => obj2.name === obj1.itemId.name
      );
      if (matchingObj) {
        return { ...obj1, ssid: matchingObj.ssid };
      }
      return obj1;
    })
    .filter((item) => {
      return item.Status == null;
    });

  const handleAssign = (ssids, id) => {
    setAssign(true);
    setSSIDAssign(ssids);
    setID(id);
  };
  const handleNavigate = (id) => {
    navigate(`/itemDetails/${id}`);
  };

  return (
    <>
      {loading && <Loading msg="Fetching data..." />}
      <EuiPageTemplate restrictWidth={"95%"} grow={true}>
        <EuiPageTemplate.Section grow={true}>
          <EuiTable>
            <EuiTableHeader align="center">
              <EuiTableHeaderCell align="center">S.N</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Requester Email</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Item Name</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Image</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Available SSID</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Required Unit</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Stock</EuiTableHeaderCell>
              <EuiTableHeaderCell align="center">Action</EuiTableHeaderCell>
            </EuiTableHeader>
            <EuiTableBody>
              {requestItemArray.map((item, index) => (
                <>
                  <EuiTableRow key={item?._id}>
                    <EuiTableRowCell align="center">{index + 1}</EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{refineEmail(item?.userId?.email)}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>
                      
                        <Link
                          to={`/itemDetails/${item?.itemId?.name}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {item?.itemId?.name}
                        </Link>
                      </b>
                    </EuiTableRowCell> 
                    <EuiTableRowCell align="center">
                      <Link to={`/itemDetails/${item?.itemId?.name}`}>
                        <EuiImage style={{}} src={item?.itemId?.image.url} />
                      </Link>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>
                        <EuiSelect
                          options={item?.ssid?.map((element) => {
                            return { text: element, value: element };
                          })}
                        />
                      </b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.RequiredUnit}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <b>{item?.ssid?.length}</b>
                    </EuiTableRowCell>
                    <EuiTableRowCell align="center">
                      <>
                        <EuiButton
                          onClick={() => handleAssign(item?.ssid, item?._id)}
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
          {assign && (
            <AssignSSID
              ssids={ssidAssign}
              setAssign={setAssign}
              requestId={id}
            />
          )}
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
    </>
  );
};

export default ItemsRequestPage;
