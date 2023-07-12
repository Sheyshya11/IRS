import React, { useState } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiImage,
  EuiFieldText,
  EuiForm,
  EuiSpacer,
  EuiFormRow,
  EuiButton,
  EuiFieldNumber,
  EuiSelect,
  EuiFilePicker,
  EuiTextArea,
  EuiIcon,
  EuiHorizontalRule,
  EuiEmptyPrompt,
  EuiLink,
  EuiTitle,
} from "@elastic/eui";
import "../sass/stockPage.scss";

const StockPage = ({ handleCancel, count, form, setItem }) => {
  const components = [];

  const [SSID, setSSID] = useState([]);
  const { name, image, quality, description } = form;
  const value = [];
  const handleChange = (itemNumber, e) => {
    const updatedSSID = SSID.map((item) => {
      if (item.itemNumber === itemNumber) {
        return { ...item, ssid: e.target.value };
      }
      return item;
    });

    const index = updatedSSID.findIndex(
      (item) => item.itemNumber === itemNumber
    );

    if (index === -1) {
      const newItem = {
        itemNumber,
        value: e.target.value,
        name,
        quantity: count,
        image,
        quality,
        description,
      };
      setSSID((prevSSID) => [...prevSSID, newItem]);
    } else {
      setSSID(updatedSSID);
    }
  };
  const itemValues = SSID.map((item, index) => {
    const itemv = {
      itemNumber: index + 1,
      value: item.value,
    };
    return itemv;
  });
  console.log(itemValues)

  for (let i = 0; i < count; i++) {
    components.push(
      <>
        <EuiFlexItem>
          <EuiFieldText
            onChange={(e) => handleChange(`${i + 1}`, e)}
            placeholder={`Item ${i + 1}`}
            name="SSID"
          />
        </EuiFlexItem>
      </>
    );
  }

function isUnique(arr) {
  const valueOccurrences = {};

  for (let obj of arr) {
    const value = obj['ssid'];
    console.log(value)
    if (value in valueOccurrences) {
      // Field value is not unique
      return false;
    }

    valueOccurrences[value] = true;
  }

  // All field values are unique
  return true;
}


  const handleSubmit = (e) => {
    e.preventDefault();
    if(isUnique(SSID)){
      setItem(SSID);
      handleCancel(false);
   
      console.log('ssid is unique')
    }else{
      alert('ssid should be uniquee')

    }
   
  };

  return (
    <>
      <div className="stockPage">
        <EuiForm>
          <EuiFlexGroup
            alignItems="center"
            justifyContent="center"
            direction="column"
            className="container"
          >
            <EuiFlexItem>
              <EuiText size="l" color="red">
                ENTER SSID
              </EuiText>
            </EuiFlexItem>

            {components}

            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiButton fill onClick={handleSubmit}>
                  Submit
                </EuiButton>
              </EuiFlexItem>

              <EuiButton
                color="danger"
                fill
                onClick={() => handleCancel(false)}
              >
                Cancel
              </EuiButton>
            </EuiFlexGroup>
          </EuiFlexGroup>
        </EuiForm>
      </div>
    </>
  );
};

export default StockPage;
