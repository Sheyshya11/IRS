import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiLoadingSpinner,
  EuiPageTemplate,
} from "@elastic/eui";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BulkEditModal from "../component/BulkEditModal";
import ConfirmModal from "../component/ConfirmModal";
import EditModal from "../component/EditModal";
import { notify } from "../utils/Toastmessage";
import { ToastContainer } from "react-toastify";
import {
  clearItems,
  deleteSSID,
  deleteinBulk,
  getItemListByName,
} from "../redux/ItemSlice";

const ItemEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.item.items);
  const [isloading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const [pagination, setPagination] = useState({ pageIndex: 0 });
  const [editBulkForm, setEditBulkForm] = useState({
    name: "",
    description: "",
    supplier: "",
    image: "",
    orginalName: "",
  });
  const [selection, setSelection] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditBulkModal, setEditBulkModal] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [form, setForm] = useState({
    ssid: "",
  });

  //read
  const fetchItemsByName = async () => {
    try {
      setLoading(true);
      await dispatch(getItemListByName(state.name));
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (isModified) {
      fetchItemsByName();
    }
  }, [isModified]);

  useEffect(() => {
    dispatch(clearItems());
    fetchItemsByName();
  }, []);

  //edit
  const handleEdit = (id) => {
    setIsModified(false);
    const item = items.filter((i) => i._id == id);
    setForm({
      ssid: item[0].ssid,
    });

    setShowModal(true);
  };

  //delete
  const handleDelete = async (ssid) => {
    try {
      setLoading(true);
      const response = await dispatch(deleteSSID(ssid)).unwrap();
      setLoading(false);
      if (response) {
        setIsModified(true);
      }
    } catch (error) {
      setLoading(false);
      notify(error);
    }
  };

  const handleEditInBulk = () => {
    setEditBulkForm({
      name: items[0]?.name,
      description: items[0]?.description,
      supplier: items[0]?.supplier,
      image: items[0]?.image.url,
      orginalName: items[0]?.name,
    });
    setEditBulkModal(true);
  };

  const columns = [
    {
      field: "ssid",
      name: "Serial Number",
      sortable: true,
      truncateText: true,
    },

    {
      field: "createdAt",
      name: "Created At",
      sortable: true,
      truncateText: true,
      render: (createdAt) => {
        const formattedDate = formatDateWithAMPM(createdAt);
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "updatedAt",
      name: "Updated At",
      sortable: true,
      truncateText: true,
      render: (updatedAt) => {
        const formattedDate = formatDateWithAMPM(updatedAt);
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "Status",
      name: "Status",
      sortable: true,
      truncateText: true,
    },
    {
      name: "Action",
      sortable: true,
      truncateText: true,
      render: (item) => {
        return (
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiButton
                onClick={() => handleEdit(item._id)}
                fill
                size="s"
                style={{ background: "#7024ec" }}
              >
                Edit
              </EuiButton>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiButton
                onClick={() => handleDelete(item.ssid)}
                fill
                size="s"
                color="danger"
              >
                Delete
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
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

  return (
    <EuiPageTemplate restrictWidth={"75%"} grow={true}>
      {isloading && (
        <div className="loading">
          <EuiEmptyPrompt
            className="loadingName"
            icon={<EuiLoadingSpinner size="xxl" />}
          />
        </div>
      )}
      <EuiPageTemplate.Header
        pageTitle={state.name}
        style={{ fontFamily: "Roboto" }}
        rightSideItems={[
          //delete in bulk
          <EuiButton fill color="danger" onClick={() => setConfirmDialog(true)}>
            Erase
          </EuiButton>,
          <EuiButton fill color="primary" onClick={() => handleEditInBulk()}>
            Edit in Bulk
          </EuiButton>,
        ]}
      />
      <EuiPageTemplate.Section grow="true">
        <EuiInMemoryTable
          tableCaption="Demo of EuiInMemoryTable with selection"
          ref={tableRef}
          items={items}
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

        {showModal && (
          <EditModal
            form={form}
            setShowModal={setShowModal}
            setIsModified={setIsModified}
            isModified={isModified}
            setLoading={setLoading}
            notify={notify}
          />
        )}
        {showEditBulkModal && (
          <BulkEditModal
            setEditBulkForm={setEditBulkForm}
            editBulkForm={editBulkForm}
            setEditBulkModal={setEditBulkModal}
            setLoading={setLoading}
            notify={notify}
          />
        )}
        {confirmDialog && (
          <ConfirmModal
            setConfirmDialog={setConfirmDialog}
            name={state.name}
            setLoading={setLoading}
            notify={notify}
          />
        )}
        <ToastContainer />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default ItemEditPage;
