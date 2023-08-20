import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLoadingSpinner,
} from "@elastic/eui";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editSSID } from "../redux/ItemSlice";
import "../sass/editItem.scss";
import "../sass/loading.scss";

const EditModal = (props) => {
  const [modifiedssid, setModifiedssid] = useState(props.form.ssid);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const item = {
      ssid: props.form.ssid,
      modifiedssid: modifiedssid,
    };
    try {
      props.setShowModal(false);
      props.setLoading(true);
      const response = await dispatch(editSSID(item)).unwrap();
      props.setLoading(false);
      if (response) {
        props.setIsModified(true);
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
        title={<h2 style={{ textAlign: "center" }}>Edit </h2>}
        actions={
          <>
            <EuiForm component="form" onSubmit={handleSubmit}>
              <EuiFlexGroup direction="column" style={{ padding: "0 20px" }}>
                <EuiFlexItem>
                  <EuiFormRow label="SSID">
                    <EuiFieldText
                      value={modifiedssid}
                      placeholder="SSID"
                      onChange={(e) => setModifiedssid(e.target.value)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiButton type="submit" color="primary" fill>
                      Submit
                    </EuiButton>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiButton
                      color="danger"
                      fill
                      onClick={() => {
                        props.setShowModal(false);
                      }}
                    >
                      Cancel
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexGroup>
            </EuiForm>
          </>
        }
      />
    </div>
  );
};

export default EditModal;
