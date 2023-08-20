import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from "@elastic/eui";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteinBulk } from "../redux/ItemSlice";
import "../sass/editItem.scss";
import "../sass/loading.scss";

const ConfirmModal = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteInBulk = async () => {
    try {
      props.setConfirmDialog(false);
      props.setLoading(true);
      const response = await dispatch(deleteinBulk(props.name)).unwrap();
      props.setLoading(false);
      if (response) {
        navigate("/dash");
      }
    } catch (rejectedValueOrSerializedError) {
      props.setLoading(false);
      props.notify(rejectedValueOrSerializedError);
    }
  };

  return (
    <div className="editPage">
      <EuiEmptyPrompt
        layout="horizontal"
        color="plain"
        actions={
          <>
            <EuiFlexGroup direction="column" style={{ padding: "0 20px" }}>
              <EuiFlexItem>
                <EuiText color="text">
                  Do you want to delete all the items?
                </EuiText>
              </EuiFlexItem>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiButton onClick={handleDeleteInBulk} color="danger" fill>
                    Delete
                  </EuiButton>
                </EuiFlexItem>

                <EuiFlexItem>
                  <EuiButton
                    color="text"
                    fill
                    onClick={() => {
                      props.setConfirmDialog(false);
                    }}
                  >
                    Cancel
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexGroup>
          </>
        }
      />
    </div>
  );
};

export default ConfirmModal;
