import React, { useEffect, useState } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiFieldText,
  EuiForm,
  EuiButton,
  EuiEmptyPrompt,
} from "@elastic/eui";
import "../sass/stockPage.scss";

const StockPage = ({
  handleCancel,
  count,
  setSerialNumbers,
  serialNumbers,
}) => {
  const components = [];
  const initialState = Array.from(
    { length: count },
    (_, index) => serialNumbers[index] || ""
  );

  useEffect(() => {
    setSerialNumbers(initialState);
  }, []);

  const handleChange = (index, e) => {
    const newValue = e.target.value;
    setSerialNumbers((prevSSID) => {
      const newSSID = [...prevSSID];
      newSSID[index - 1] = newValue;
      return newSSID;
    });
  };

  for (let i = 0; i < count; i++) {
    components.push(
      <>
        <EuiFlexItem>
          <EuiFieldText
            onChange={(e) => handleChange(i + 1, e)}
            value={serialNumbers[i]}
            placeholder={`Item ${i + 1}`}
            name="SSID"
          />
        </EuiFlexItem>
      </>
    );
  }

  function areElementsUnique(arr) {
    const uniqueSet = new Set(arr);
    return uniqueSet.size === arr.length;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    serialNumbers.forEach((item) => {
      if (!item?.length) {
        alert("Need to fill all serial numbers");
      }
    });
    if (areElementsUnique(serialNumbers)) {
      setSerialNumbers(serialNumbers);
      handleCancel(false);

      console.log("ssid is unique");
    } else {
      return alert("ssid should be uniquee");
    }
  };

  return (
    <>
      <div className="stockPage">
        <EuiEmptyPrompt
          layout="horizontal"
          color="plain"
          title={
            <EuiText style={{ fontFamily: "Roboto" }} textAlign="center">
              Enter serial Numbers
            </EuiText>
          }
          actions={
            <>
              <EuiForm>
                <EuiFlexGroup
                  alignItems="center"
                  direction="column"
                  className="container"
                >
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
            </>
          }
        />
      </div>
    </>
  );
};

export default StockPage;
