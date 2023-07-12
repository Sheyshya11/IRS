import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import "../sass/assignPage.scss";
import { EuiButton, EuiForm, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { approveItemRequest } from "../redux/ItemSlice";
import { useDispatch } from "react-redux";

const AssignSSID = ({ ssids, setAssign, requestId }) => {
  const [selectedSSid, setSelectedSSid] = useState([]);
  const dispatch = useDispatch()
  const handleSubmit = async() => {
    const item = {
      ssid: selectedSSid[0],
      id: requestId,
    };
    try {
      const response = await dispatch(approveItemRequest(item))
      console.log(response)
    } catch (error) {
      console.log({error})
      
    }

    console.log("submitted");
  };
  
  return (
    <>
      <div className="assignPage">
        <EuiForm component="form" className="container">
          <EuiFlexGroup
            alignItems="center"
            justifyContent="center"
            direction="column"
            className="container"
          >
            <EuiFlexItem>
              <Multiselect
                isObject={false}
                onRemove={(event) => {
                  event;
                }}
                onSelect={(event) => {
                  setSelectedSSid([event]);
                }}
                options={ssids}
                showCheckbox
              />
            </EuiFlexItem>

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiButton onClick={handleSubmit} color="primary" fill>
                  Submit
                </EuiButton>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiButton color="danger" fill onClick={() => setAssign(false)}>
                  Cancel
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexGroup>
        </EuiForm>
      </div>
    </>
  );
};

export default AssignSSID;
