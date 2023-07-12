import React, { useState, useEffect } from "react";
import {
  EuiText,
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSelect,
  EuiPageTemplate,
  EuiFieldPassword,
} from "@elastic/eui";
import { useDispatch } from "react-redux";
import { createPassword, logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const CreatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("SOC");
  const [passwordError, setPasswordError] = useState(false);

  let passworderrormsg;

  if (passwordError) {
    passworderrormsg = ["Password doesnt match"];
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cred = {
        confirmPassword,
        department,
      };
      if (password == confirmPassword) {
        setPasswordError(false);
        setLoading(true);
        const response = await dispatch(createPassword(cred));
        setLoading(false);
        console.log(response);

        await dispatch(logout());
        navigate("/");
      } else {
        setPasswordError(true);
      }
    } catch (error) {
      console.log({ error });
    }
    console.log("submitted");
  };

  return (
    <EuiPageTemplate restrictWidth={"75%"} grow={true}>
      <EuiPageTemplate.Section grow={true}>
        {loading && <Loading msg="Creating new password" />}
        <EuiFlexGroup direction="column">
          <EuiFlexItem grow={false}>
            <EuiText style={{ fontWeight: "600" }}>Setup Profile</EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiForm
              component="form"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <EuiFormRow label="Password">
                    <EuiFieldPassword
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    isInvalid={passwordError}
                    error={passworderrormsg}
                    label="Confirm Password"
                  >
                    <EuiFieldPassword
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Department">
                    <EuiSelect
                      options={options}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow>
                    <EuiButton type="submit" size="s" fill color="primary">
                      Create
                    </EuiButton>
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiForm>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default CreatePassword;
