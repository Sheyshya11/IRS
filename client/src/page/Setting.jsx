import React, { useEffect, useState } from "react";
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
  EuiPageTemplate,
  EuiTitle,
  EuiIcon,
} from "@elastic/eui";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/userSlice";
import { notify } from "../utils/Toastmessage";
import { ToastContainer } from "react-toastify";
import Loading from "../component/Loading";

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

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

  const customButtons = [
    <EuiButton fill onClick={() => navigate("/dash")}>
      Dashboard
    </EuiButton>,
  ];
  const [form, setForm] = useState({
    username: "",
    email: "",
    oldPass: "",
    newPass: "",
    department: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const data = jwtDecode(token);

    setForm((prev) => {
      return {
        ...prev,
        department: data?.department,
      };
    });
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const data = jwtDecode(token);
    if (
      form.department !== data.department ||
      form.email ||
      form.username ||
      form.oldPass ||
      form.newPass
    ) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = {};

    for (const key in form) {
      if (form.hasOwnProperty(key) && form[key].length > 0) {
        result[key] = form[key];
      }
    }

    try {
      if (isEdited) {
        setLoading(true);
        const response = await dispatch(updateUser(result)).unwrap();
        setLoading(false);
        if (response) {
          console.log("submitted");
        }
      } else {
        alert("Update atleast one field");
      }
    } catch (rejectedValueOrSerializedError) {
      notify(rejectedValueOrSerializedError);
    }
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const pageTitleProps = {
    style: { fontFamily: "Roboto", fontSize: "32px" },
  };

  return (
    <EuiPageTemplate restrictWidth={"75%"} grow={true}>
      <EuiPageTemplate.Header
        alignItems="center"
        rightSideItems={customButtons}
        bottomBorder="extended"
      >
        {loading && <Loading msg="Re-login to see the changes." />}
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiIcon type="indexEdit" size="xl" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiTitle size="l" {...pageTitleProps}>
              <h1>Update Profile</h1>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageTemplate.Header>
      <EuiPageTemplate.Section grow={true}>
        <EuiFlexGroup direction="column">
          <EuiFlexItem grow={false}>
            <EuiForm
              component="form"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <EuiFormRow label="Username">
                    <EuiFieldText
                      onChange={(e) => handleFormFieldChange("username", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Department">
                    <EuiSelect
                      value={form.department}
                      onChange={(e) => handleFormFieldChange("department", e)}
                      options={options}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Email">
                    <EuiFieldText
                      onChange={(e) => handleFormFieldChange("email", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Old Password">
                    <EuiFieldPassword
                      onChange={(e) => handleFormFieldChange("oldPass", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="New Password">
                    <EuiFieldPassword
                      onChange={(e) => handleFormFieldChange("newPass", e)}
                    />
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
        <ToastContainer />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
};

export default Setting;
