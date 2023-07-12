import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginWithGoogle } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { notify } from "../utils/Toastmessage";
import "../sass/login.scss";

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
  EuiLink,
} from "@elastic/eui";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emptyEmailError, setemptyEmailError] = useState(false);
  const [emptyPasswordError, setemptyPasswordError] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);
  let emailError, passwordError, invalidEmail, loginError;
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
    if (form.email) {
      setemptyEmailError(false);
    }
    if (form.password) {
      setemptyPasswordError(false);
    }

    if (form.email !== "" && !regex.test(form.email)) {
      setInvalidEmailError(true);
    } else {
      setInvalidEmailError(false);
    }
  };

  if (invalidEmailError) {
    invalidEmail = ["Invalid email"];
  }

  if (emptyEmailError) {
    emailError = ["Cant enter empty email"];
  }

  if (emptyPasswordError) {
    passwordError = ["Cant enter empty password"];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const originalPromiseResult = await dispatch(loginUser(form)).unwrap();

      if (originalPromiseResult) {
        console.log("im logged");
        navigate("/home");
      }

      // handle result here
    } catch (rejectedValueOrSerializedError) {
      notify(rejectedValueOrSerializedError);

      if (form.email == "") {
        setemptyEmailError(true);
        setForm({ ...form, email: "" });
      }
      if (form.password == "") {
        setemptyPasswordError(true);
        setForm({ ...form, password: "" });
      }
    }
  };

  async function handleGoogleLoginSuccess(tokenResponse) {
    try {
      const accessToken = tokenResponse.access_token;
      console.log(accessToken);
      const originalPromiseResult = await dispatch(
        loginWithGoogle(accessToken)
      ).unwrap();

      if (originalPromiseResult) {
        console.log("im logged");
        navigate("/home");
      }
    } catch (rejectedValueOrSerializedError) {
      if (rejectedValueOrSerializedError === 401) {
        notify("User is not approved yet");
      } else if (rejectedValueOrSerializedError === 404) {
        notify("User not found");
      }

      navigate("/");
    }
  }

  const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });

  return (
    <EuiFlexGroup
      className="login-container"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <EuiFlexItem className="login-header" grow={false}>
        <EuiText color="#FFFFFF" className="login-text">
          LOGIN TO YOUR ACCOUNT
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiImage
          className="login-image"
          src="/login-image.png"
          alt="Login image"
        />
      </EuiFlexItem>

      <EuiForm component="form" autoComplete="off" onSubmit={handleSubmit}>
        <EuiFlexItem>
          <EuiFormRow
            isInvalid={emptyEmailError || invalidEmailError}
            error={emailError || invalidEmail}
          >
            <input
              className="email-text"
              placeholder="EMAIL"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => handleFormFieldChange("email", e)}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiSpacer />

        <EuiFlexItem>
          <EuiFormRow isInvalid={emptyPasswordError} error={passwordError}>
            <input
              className="email-text"
              placeholder="PASSWORD"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => handleFormFieldChange("password", e)}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem className="forgot-pass">
          <EuiText size="s">
            <EuiLink
              color="text"
              style={{ fontFamily: "Roboto", fontWeight: '700' }}
              href="http://www.elastic.co"
              external
            >
              Forgot Password?
            </EuiLink>
          </EuiText>
        </EuiFlexItem>
        <EuiSpacer />

        <EuiFlexItem className="">
          <EuiButton className="login-btn" size="s" type="submit">
            LOGIN
          </EuiButton>
        </EuiFlexItem>
      </EuiForm>

      <EuiFlexItem className="" grow={false}>
        <EuiText style={{ fontWeight: "500" }}>Or Login Using </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton className="google-login-button" onClick={() => login()}>
          Continue With Google
        </EuiButton>
      </EuiFlexItem>

      <EuiFlexGroup direction="row" className="no-account" gutterSize={0}>
        <EuiFlexItem grow={false}>
          <EuiText>No Account?</EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <EuiLink
              color="success"
              style={{ fontFamily: "Roboto", fontWeight:'700' }}
              href="http://localhost:3000/signup"
              external
            >
              Signup
            </EuiLink>
          </EuiText>
          <ToastContainer />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexGroup>
  );
};

export default Login;
