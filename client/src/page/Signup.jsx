import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { signUpWithGoogle } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { notify } from "../utils/Toastmessage";
import "../sass/signup.scss";
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


const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inValid, setinValid] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    department: "SOC",
    email: "",
    password: "",
  });

  let passwordError, emailError;
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
console.log(form)
  if (inValid) {
    passwordError = ["Must be atleast 8 chars long"];
  }
  if (invalidEmail) {
    emailError = ["Invalid email"];
  }

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });

    if (form.email !== "" && !regex.test(form.email)) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }
    if (form.password !== "" && form.password.length < 8) {
      setinValid(true);
    } else {
      setinValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inValid) {
      console.log("submitted");
      await dispatch(registerUser(form));
      navigate("/");
    } else {
      notify("Password must have atleast 8 characters");
      setForm({ ...form, password: "" });
    }
  };

  async function handleGoogleSignUpSuccess(tokenResponse) {
    try {
      const accessToken = tokenResponse.access_token;

      const response = await dispatch(signUpWithGoogle(accessToken)).unwrap();
      if (response) {
        console.log("User created");
        navigate("/");
      }
    } catch (error) {
      notify("user already exists");
      console.log({ error });
    }
  }
  const signup = useGoogleLogin({ onSuccess: handleGoogleSignUpSuccess });
  return (
    <EuiFlexGroup
      className="signup-container"
      alignItems="center"
      gutterSize={0}
    >
      <EuiFlexGroup alignItems="center" justifyContent="center" gutterSize={0}>
        <EuiFlexItem grow={false}>
          <EuiImage
            className="signup-image"
            src="/signup.png"
            alt="Signup Image"
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup
        className="container-form"
        justifyContent="center"
        alignItems="center"
        gutterSize={0}
      >
        <EuiForm component="form" autoComplete="off" onSubmit={handleSubmit}>
          <EuiFlexItem grow={false}>
            <EuiText textAlign="center" className="create-text" size="l">
              CREATE NEW ACCOUNT
            </EuiText>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiSpacer />

          {/* firstname */}
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow label="Firstname">
                <input
                  className="first-last"
                  name="firstname"
                  value={form.firstname}
                  onChange={(e) => handleFormFieldChange("firstname", e)}
                  required
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label="Lastname">
                <input
                  className="first-last"
                  name="lastname"
                  value={form.lastname}
                  onChange={(e) => handleFormFieldChange("lastname", e)}
                  required
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Username">
              <input
                className="email-text"
                name="email"
                value={form.username}
                onChange={(e) => handleFormFieldChange("username", e)}
                required
              />
            </EuiFormRow>
          </EuiFlexItem>
      
          <EuiFlexItem>
            <EuiFormRow style={{paddingBottom:'10px'}} label="Department">
         
              <select className="email-text" onChange={(e) => handleFormFieldChange("department", e)}>
                <option value="SOC">SOC</option>
                <option value="Software Enginerring">Software Enginerring</option>
                <option value="VAPT">VAPT</option>
                <option value="SIEM">SIEM</option>
              </select>
            </EuiFormRow>
          </EuiFlexItem>
        
          <EuiFlexItem>
            <EuiFormRow
              isInvalid={invalidEmail}
              error={emailError}
              label="Email"
            >
              <input
                type="email"
                className="email-text"
                name="email"
                value={form.email}
                onChange={(e) => handleFormFieldChange("email", e)}
                required
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow
              isInvalid={inValid}
              error={passwordError}
              label="Password"
            >
              <input
                className="email-text"
                name="email"
                type="password"
                value={form.password}
                onChange={(e) => handleFormFieldChange("password", e)}
                required
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiSpacer />
          <EuiSpacer />

          <EuiButton className="signup-btn" size="s" type="submit">
            SIGN UP
          </EuiButton>

          <EuiSpacer />
          <EuiFlexGroup
            gutterSize={0}
            justifyContent="center"
            alignItems="center"
          >
            <EuiFlexItem grow={false}>
              <EuiText size="s" className="haveAccount-text">
                Already have an account?
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText size="s">
                <EuiLink
                  color="success"
                  style={{ fontFamily: "Roboto", fontWeight: '700' }}
                  href="https://requisition.vercel.app/login"
                  external
                >
                  Login
                </EuiLink>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiFlexGroup
            alignItems="center"
            direction="column"
            justifyContent="center"
          >
            <EuiFlexItem className="" grow={false}>
              <EuiText textAlign="center">Or Signup using</EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                className="google-login-button"
                onClick={() => signup()}
              >
                Continue with google
              </EuiButton>
              <ToastContainer />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiForm>
      </EuiFlexGroup>
    </EuiFlexGroup>
  );
};

export default Signup;
