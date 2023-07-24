import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import "../sass/assignPage.scss";
import {
  EuiButton,
  EuiForm,
  EuiFlexGroup,
  EuiFlexItem,
  EuiEmptyPrompt,
} from "@elastic/eui";
import { approveItemRequest } from "../redux/ItemSlice";
import { useDispatch } from "react-redux";
import { setItemSelected } from "../redux/ItemSlice";
import Select from "react-select";

const AssignSSID = ({
  ssids,
  setAssign,
  requestId,
  name,
  setSelectedItems,
  selectedItems,
  deviceName,
  email,
  reqUnit,
  userId,
}) => {
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState();
  const [unmatchedObjects, setUnmatchedObject] = useState([]);

  const newOption = ssids?.map((item) => {
    return {
      value: item,
      label: item,
    };
  });

  useEffect(() => {
    const itm = selectedItems.filter((item) => item.id == requestId);
    itm.map((i) => {
      setSelectedOptions(i.deviceOption);
    });

    checkIfSelectedPreviously();
  }, []);

  // if previously serial num selected for the same item.
  const checkIfSelectedPreviously = () => {
    const ifItemAlreadySelected = selectedItems.filter(
      (item) => item.deviceName == deviceName && item.id !== requestId
    );
      console.log(ifItemAlreadySelected)
    const spreadPrevSelected = ifItemAlreadySelected.map((opt) => {
      const newitem = opt.deviceOption.map((i) => i.value);
      return newitem;
    });
    const flattenedArray = spreadPrevSelected.flat(1);

    if (flattenedArray.length > 0) {
      const resultArray = newOption.filter(
        (item) => !flattenedArray.includes(item.value)
      );
      setUnmatchedObject(resultArray);
    }
  };



  // submit
  const handleSubmit = async () => {
    const serialNumbers = selectedOptions?.map((i) => {
      return i.value;
    });

    const item = {
      devices: serialNumbers,
      id: requestId,
      name,
      deviceName: deviceName,
      deviceOption: selectedOptions,
      email: email,
      userId,
    };

    if (selectedOptions?.length > reqUnit) {
      alert("Cant select more than required amount");
      return;
    }

    if (!selectedOptions?.length) {
      setSelectedItems((prevItems) => {
        const filteredItems = prevItems.filter(
          (prevItem) => prevItem.id !== requestId
        );
        return filteredItems;
      });
    } else {
      setSelectedItems((prevItems) => {
        const filteredItems = prevItems.filter(
          (prevItem) => prevItem.id !== requestId
        );
        return [...filteredItems, item];
      });
    }

    dispatch(
      setItemSelected({ id: requestId, status: !!selectedOptions?.length })
    );

    setAssign(false);
  };

  // Array of all options

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }
  console.log(newOption)

  return (
    <>
      <div className="assignPage">
        <EuiEmptyPrompt
          layout="horizontal"
          color="plain"
          title={<h2>Select serial Numbers</h2>}
          body={<p>Email will be sent with the assigned items.</p>}
          actions={
            <>
              <EuiForm component="form" className="container">
                <EuiFlexGroup
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                  className="container"
                >
                  <EuiFlexItem>
                    <Select
                      options={
                        unmatchedObjects.length > 0
                          ? unmatchedObjects
                          : newOption
                      }
                      placeholder="Select Serial Number"
                      value={selectedOptions}
                      onChange={handleSelect}
                      isSearchable={true}
                      isMulti
                    />
                  </EuiFlexItem>

                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiButton onClick={handleSubmit} color="primary" fill>
                        Submit
                      </EuiButton>
                    </EuiFlexItem>

                    <EuiFlexItem>
                      <EuiButton
                        color="danger"
                        fill
                        onClick={() => {
                          setAssign(false);
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
    </>
  );
};

export default AssignSSID;
