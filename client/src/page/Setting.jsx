import React from "react";
import {
  EuiText,
  EuiButton,
  EuiEmptyPrompt,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSelect,
  EuiFieldPassword,
} from "@elastic/eui";

const Setting = () => {
  const options = [
    {
      text: "SOC",
      value: "SOC",
    },
    {
      text: "VAPT",
      value: "VAPT",
    },
    {
      text: "Software Engineering",
      value: "Software Engineering",
    },
    {
      text: "SIEM",
      value: "SIEM",
    },
  ];

  const [form, setForm] = useState({
 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <EuiText>Edit profile</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiForm component="form" autoComplete="off" onSubmit={handleSubmit}>
          <EuiFlexGroup direction="column">
            <EuiFlexItem>
              <EuiFormRow label="Username">
                <EuiFieldText />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label="Department">
                <EuiSelect options={options} />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label="Email">
                <EuiFieldText />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label="Old Password">
                <EuiFieldPassword />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label="New Password">
                <EuiFieldPassword />
              </EuiFormRow>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiFormRow>
                <EuiButton type="submit" fill color="primary">
                  Edit
                </EuiButton>
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiForm>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default Setting;
