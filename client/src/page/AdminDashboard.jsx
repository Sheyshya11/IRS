import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  EuiPanel,
  EuiEmptyPrompt,
} from "@elastic/eui";
import { useDispatch, useSelector } from "react-redux";
import { approveUser, getAllUser } from "../redux/fetchDataSlice";
import { setDashboard } from "../redux/dashboardSlice";
import { setLoading } from "../redux/ItemSlice";


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const fetchref = useRef(false);

  const users = useSelector((state) => state.userData.users);

  const { loading } = useSelector((state) => state.item);

  // email and username formatting
  const refineEmail = (email) => {
    var firstChar = email.charAt(0).toUpperCase();
    var remainingChars = email.slice(1).toLowerCase();

    return firstChar + remainingChars;
  };
  const refineUsername = (username) => {
    var firstChar = username.charAt(0).toUpperCase();
    var remainingChars = username.slice(1).toLowerCase();

    return firstChar + remainingChars;
  };

  //accept or reject users
  const acceptUserRequest = async (_id, approve) => {
    try {
      dispatch(setLoading(true));
      const response = await dispatch(approveUser(_id, approve));
      dispatch(setLoading(false));
    } catch (error) {
      console.log({ error });
    }
  };



  return (
    <>
      {users.length ? (
        <EuiTable>
          <EuiTableHeader>
            <EuiTableHeaderCell>S.N</EuiTableHeaderCell>
            <EuiTableHeaderCell>Email</EuiTableHeaderCell>
            <EuiTableHeaderCell>User Name</EuiTableHeaderCell>
            <EuiTableHeaderCell>Action</EuiTableHeaderCell>
          </EuiTableHeader>
          <EuiTableBody>
            {users.map((item, index) => (
              <EuiTableRow key={item._id}>
                <EuiTableRowCell>{index + 1}</EuiTableRowCell>
                <EuiTableRowCell>
                  <b>{refineEmail(item.email)}</b>
                </EuiTableRowCell>
                <EuiTableRowCell>
                  <b>{refineUsername(item.username)}</b>
                </EuiTableRowCell>
                <EuiTableRowCell>
                  <>
                    <EuiButton
                      color="primary"
                      fill
                      size="s"
                      onClick={() => acceptUserRequest(item._id, true)}
                    >
                      Approve
                    </EuiButton>

                    <EuiButton
                      style={{ marginLeft: "20px" }}
                      color="danger"
                      fill
                      size="s"
                      onClick={() => acceptUserRequest(item._id, false)}
                    >
                      Reject
                    </EuiButton>
                  </>
                </EuiTableRowCell>
              </EuiTableRow>
            ))}
          </EuiTableBody>
        </EuiTable>
      ) : (
        <EuiFlexGroup
          style={{ height: "30vh" }}
          alignItems="center"
          justifyContent="center"
        >
          <EuiFlexItem grow={false}>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiEmptyPrompt
                  iconType="users"
                  title={<h2>You have no pending requests</h2>}
                  body={<></>}
                  actions={
                    <EuiButton
                      onClick={() => dispatch(setDashboard())}
                      iconType="dashboardApp"
                      color="primary"
                      fill
                    >
                      Go to Dashboard
                    </EuiButton>
                  }
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  );
};

export default AdminDashboard;
