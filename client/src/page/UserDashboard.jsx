import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiButton,
  EuiHorizontalRule,
  EuiCard,
  EuiFieldSearch,
  EuiBadge,
  EuiEmptyPrompt,
  EuiSpacer,
  EuiLoadingSpinner,
  EuiNotificationBadge,
  EuiCallOut,
  EuiLink,
} from "@elastic/eui";
import "../sass/userDashboard.scss";

const UserDashboard = ({ setFilteredItems, filteredItems }) => {
  const { items, loading, itemCount } = useSelector((state) => state.item);
  const [searchField, setSearchField] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchField(searchValue);

    const filteredItems = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const searchValueLower = searchValue.toLowerCase();
      return itemName.includes(searchValueLower);
    });

    setFilteredItems(filteredItems);
  };

  useEffect(() => {
    if (searchField == "") {
      setFilteredItems(items);
    }
  }, [searchField]);

  const handleNavigate = (id) => {
    navigate(`/itemDetails/${id}`);
  };
  const refineUsername = (username) => {
    var firstChar = username.charAt(0).toUpperCase();
    var remainingChars = username.slice(1).toLowerCase();

    return firstChar + remainingChars;
  };

  return (
    <EuiFlexGroup wrap>
      <EuiFlexItem>
        <EuiFieldSearch
          isClearable={false}
          onChange={handleSearchChange}
          placeholder="Search for items"
          value={searchField}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiText textAlign="right" size="m">
          Total Number of Items: ({items?.length})
        </EuiText>
      </EuiFlexItem>

      <EuiHorizontalRule margin="s" />

      {loading ? (
        <EuiEmptyPrompt
          className="loading"
          icon={<EuiLoadingSpinner size="xxl" />}
          title={<h2>Loading...</h2>}
        />
      ) : (
        filteredItems.map((item, index) => (
          <EuiFlexItem grow={false} style={{ minWidth: 300 }} key={item._id}>
            <EuiCard
              className="cardContainer"
              textAlign="left"
              image={
                <div>
                  <Link to={`/itemDetails/${item?.name}`}>
                    <img
                      className="imageCard"
                      src={item?.image.url}
                      alt="Nature"
                    />
                  </Link>
                </div>
              }
              title={
                <>
                  <Link
                    to={`/itemDetails/${item?._id}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <EuiText size="l" className="itemName">
                      {" "}
                      {`${refineUsername(item?.name)}`}
                    </EuiText>
                  </Link>
                </>
              }
              description={
                <>
                  <EuiSpacer />
                  <EuiCallOut color="subdued" className="descriptionCallout">
                    <p className="descriptionContent">
                      {item?.description.length > 35
                        ? `${item?.description.substring(0, 35)}...`
                        : item?.description}
                    </p>
                  </EuiCallOut>
                </>
              }
              onClick={() => handleNavigate(item?.name)}
              footer={
                <>
                  <EuiBadge
                    style={{ fontSize: "16px" }}
                    color="success"
                  >{`Available`}</EuiBadge>
                  <EuiBadge
                    style={{ fontSize: "16px" }}
                    color="danger"
                  >{`Stock: ${itemCount[item?.name]}`}</EuiBadge>
                </>
              }
            />
          </EuiFlexItem>
        ))
      )}
    </EuiFlexGroup>
  );
};

export default UserDashboard;

//   <EuiFlexGroup
//     style={{ height: "30vh" }}
//     alignItems="center"
//     justifyContent="center"
//   >
//     <EuiFlexItem grow={false}>
//       <EuiFlexGroup>
//         <EuiFlexItem>
//           <EuiEmptyPrompt
//             iconType="managementApp"
//             title={<h2>No items </h2>}
//             body={<></>}
//             actions={
//               <EuiButton onClick={navigateHome} color="primary" fill>
//                 Go to Home
//               </EuiButton>
//             }
//           />
//         </EuiFlexItem>
//       </EuiFlexGroup>
//     </EuiFlexItem>
//   </EuiFlexGroup>
// )
