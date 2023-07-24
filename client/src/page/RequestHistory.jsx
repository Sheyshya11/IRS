import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/jwtInterceptor";
import {
  EuiInMemoryTable,
  EuiButton,
  EuiPageTemplate,
  EuiBadge,
  EuiText,
} from "@elastic/eui";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const RequestHistory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [ret, setReturn] = useState(false);

  const approvedItems = items.filter((i) => {
    return i.userIds && !i.ReturnStatus;
  });

  console.log(approvedItems);

  useEffect(() => {
    const getApprovedRequests = async () => {
      setLoading(true);
      const response = await axiosInstance.get("items", {
        withCredentials: true,
      });
      setLoading(false);
      setItems(response.data);
      setReturn(false);
    };
    getApprovedRequests();
  }, [ret]);

  function formatDateWithAMPM(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Display time in 12-hour format with AM/PM
    };
    return date.toLocaleString(undefined, options);
  }

  const columns = [
    {
      field: "name",
      name: "Item Name",
      sortable: true,
      truncateText: true,
    },
    {
      field: "ssid",
      name: "Serial Number",
      sortable: true,
      truncateText: true,
    },
    {
      field: "userIds",
      name: "Current Holder ",
      sortable: true,
      truncateText: true,
      render: (userIds) => {
        return userIds?.length ? (
          <EuiText size="s" color="success">
            {userIds}
          </EuiText>
        ) : (
          <EuiText size="s" color="warning">
            Noone
          </EuiText>
        );
      },
    },

    {
      field: "updatedAt",
      name: "Delivered Time",
      sortable: true,
      truncateText: true,
      render: (updatedAt) => {
        const formattedDate = formatDateWithAMPM(updatedAt);
        return <span>{formattedDate}</span>;
      },
    },

    {
      name: "Action",
      sortable: true,
      truncateText: true,
      render: (item) => {
        return (
          <>
            <EuiButton
              onClick={() => handleReturn(item._id)}
              fill
              size="s"
              style={{ background: "#7024ec" }}
            >
              Return
            </EuiButton>
          </>
        );
      },
    },
  ];

  const renderToolsLeft = () => {
    if (selection.length === 0) {
      return;
    }

    const onClick = () => {
      deleteUsersByIds(...selection.map((user) => user.id));
      setSelection([]);
    };

    return (
      <EuiButton color="danger" iconType="trash" onClick={onClick}>
        Delete {selection.length} Users
      </EuiButton>
    );
  };

  const search = {
    toolsLeft: renderToolsLeft(),
    // toolsRight: renderToolsRight(),
    box: {
      incremental: true,
    },
  };

  const onTableChange = ({ page: { index } }) => {
    setPagination({ pageIndex: index });
  };

  const handleReturn = async (itemId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "requestItems/returnItem",
        { itemId },
        { withCredentials: true }
      );
      setLoading(false);
      setReturn(true);
      console.log(response);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <EuiPageTemplate restrictWidth={"75%"} grow={true}>
        <EuiPageTemplate.Header
          pageTitle="Approved Request History"
          style={{ fontFamily: "Roboto" }}
          rightSideItems={[
            <EuiButton fill onClick={() => navigate(-1)}>
              Go back
            </EuiButton>,
          ]}
        />
        <EuiPageTemplate.Section grow="true">
          <EuiInMemoryTable
            tableCaption="Demo of EuiInMemoryTable with selection"
            ref={tableRef}
            items={approvedItems}
            itemId="id"
            loading={loading}
            columns={columns}
            search={search}
            sorting={true}
            isSelectable={true}
            pagination={{
              ...pagination,
              pageSizeOptions: [10, 20, 0],
            }}
            onTableChange={onTableChange}
          />
        </EuiPageTemplate.Section>
      </EuiPageTemplate>
    </>
  );
};

export default RequestHistory;
