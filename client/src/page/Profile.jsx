import React, { useEffect, useState } from "react";
import { useRef } from "react";

import {
  EuiButton,
  EuiInMemoryTable,
  EuiPageTemplate,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
} from "@elastic/eui";

import Loading from "../component/Loading";
import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../axios/jwtInterceptor";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requestedData, setRequestedData] = useState([]);
  const tableRef = useRef(null);
  const [pagination, setPagination] = useState({ pageIndex: 0 });

  const { id } = useParams();

  const fetchRequestedItems = async () => {
    setLoading(true);
    const response = await axiosInstance.get(
      `requestItems/requestedItemByQuery/?id=${id}`
    );
    setRequestedData(response.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchRequestedItems();
  }, []);
  console.log(requestedData);

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
  function compareAndRenderDate(createdAt, updatedAt) {
    const createdAtDate = new Date(createdAt);
    const updatedAtDate = new Date(updatedAt);

    if (createdAtDate.getTime() === updatedAtDate.getTime()) {
      return <span style={{ color: "gray" }}>Pending...</span>;
    } else {
      const formattedDate = formatDateWithAMPM(updatedAtDate);
      return formattedDate;
    }
  }

  const columns = [
    {
      field: "itemName",
      name: "Item Name",
      sortable: true,
      truncateText: true,
      render: (itemName) => (
        <span>
          <EuiIcon
            type="starFilled"
            size="m"
            style={{ verticalAlign: "text-top" }}
          />{" "}
          {itemName}
        </span>
      ),
    },
    {
      field: "RequiredUnit",
      name: "Requested Unit",

      sortable: true,
      truncateText: true,
    },
    {
      field: "GrantedUnit",
      name: "Received Unit",

      sortable: true,
      truncateText: true,
    },

    // {
    //   field: "image.url",
    //   name: "Image",
    //   sortable: true,
    //   truncateText: true,
    //   render: (url) => (
    //     <EuiImage
    //       size="l"
    //       alt="Image"
    //       url={url}
    //       style={{ maxWidth: "180px" }}
    //     />
    //   ),
    // },
    {
      field: "createdAt",
      name: "Requested Time",
      sortable: true,
      truncateText: true,
      render: (createdAt) => {
        const formattedDate = formatDateWithAMPM(createdAt);
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "updatedAt",
      name: "Delivered Time",
      sortable: true,
      truncateText: true,
      render: (updatedAt, createdAt) => {
        const renderedDate = compareAndRenderDate(
          createdAt.createdAt,
          updatedAt
        );
        return <span>{renderedDate}</span>;
      },
    },
  ];

  const search = {
    box: {
      incremental: true,
    },
  };

  const onTableChange = ({ page: { index } }) => {
    setPagination({ pageIndex: index });
  };

  return (
    <>
      <EuiPageTemplate restrictWidth={"75%"} grow="true">
        <EuiPageTemplate.Header
          style={{ fontFamily: "Roboto" }}
          pageTitle="Request History"
          rightSideItems={[
            <EuiButton onClick={() => navigate("/dash")} size="m" fill>
              Dashboard
            </EuiButton>,
          ]}
        />
        <EuiPageTemplate.Section grow="true">
          <EuiInMemoryTable
            tableCaption="Demo of EuiInMemoryTable with selection"
            ref={tableRef}
            items={requestedData}
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

export default Profile;
