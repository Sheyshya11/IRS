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

const UserDashboard = ({ setFilteredItems, filteredItems, setLoad, load }) => {
  const { items, loading, itemCount, itemTaken } = useSelector(
    (state) => state.item
  );
  const [searchField, setSearchField] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setFilteredItems([]);
    setSearchField(searchValue);
  };

  useEffect(() => {
    const settime = setTimeout(() => {
      setLoad(false);
      const filteredItems = items.filter((item) => {
        const itemName = item.name.toLowerCase().trim();
        const searchValueLower = searchField.toLowerCase().trim();
        return itemName.includes(searchValueLower);
      });

      setFilteredItems(filteredItems);
    }, 500);

    return () => {
      if (initialLoad) {
        setInitialLoad(false);
      } else {
        setLoad(true);
      }
      clearTimeout(settime);
    };
  }, [searchField]);

  const handleNavigate = (id, available, count) => {
    navigate(`/itemDetails/${id}`, { state: { available, count } });
  };
  const capitalizeItemNameFirstChar = (username) => {
    var firstChar = username.charAt(0).toUpperCase();
    var remainingChars = username.slice(1);

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
      {load && (
        <EuiEmptyPrompt
          className="loading"
          icon={<EuiLoadingSpinner size="xl" />}
        />
      )}

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
                  <img
                    className="imageCard"
                    src={item?.image.url}
                    alt="Nature"
                  />
                </div>
              }
              title={
                <>
                  <EuiText size="l" className="itemName">
                    {`${capitalizeItemNameFirstChar(item?.name)}`}
                  </EuiText>
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
              onClick={() =>
                handleNavigate(
                  item?.name,

                  itemTaken[item?.name]
                    ? itemCount[item?.name] - itemTaken[item?.name]
                    : itemCount[item?.name],
                  itemCount[item?.name]
                )
              }
              footer={
                <>
                  <EuiBadge
                    style={{ fontSize: "16px" }}
                    color="success"
                  >{`Available: ${
                    itemTaken[item?.name]
                      ? itemCount[item?.name] - itemTaken[item?.name]
                      : itemCount[item?.name]
                  }`}</EuiBadge>
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
