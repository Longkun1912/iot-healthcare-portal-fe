import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import { isEmail } from "validator";
import "../../src/css/register.css";

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";

import AuthService from "../services/auth.service";

const genderOptions = ["Male", "Female", "Other"];

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vgender = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Please select your gender.
      </div>
    );
  }
};

const vemail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vmobile = (value) => {
  if (value.length !== 10) {
    return (
      <div className="alert alert-danger" role="alert">
        Mobile number must be valid.
      </div>
    );
  }
};

const vpassword = (value, confirm_password) => {
  if (value.length < 5 || value.length > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 5 and 100 characters.
      </div>
    );
  } else if (value && value !== confirm_password) {
    return (
      <div className="alert alert-danger" role="alert">
        Passwords do not match.
      </div>
    );
  }
};

const Register = () => {
  const navigator = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [gender, setGender] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const [state, setState] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    successful: false,
    message: "",
    // Validation data fields
    usernameError: "",
    emailError: "",
    mobileError: "",
    avatarError: "",
    passwordError: "",
    confirm_passwordError: "",
    genderError: "",
    recaptchaError: "",
    agreeTerms: false,
    agreeTermsError: "",
  });

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setState((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      message: "",
      successful: false,
      usernameError: "",
      emailError: "",
      avatarError: "",
      mobileError: "",
      passwordError: "",
      confirm_passwordError: "",
      genderError: "",
      recaptchaError: "",
      agreeTermsError: "",
    }));

    const { username, email, mobile, password, confirm_password } = state;

    console.log("State this time: " + JSON.stringify(state));

    const usernameError = required(username) || vusername(username);
    const emailError = required(email) || vemail(email);
    const mobileError = required(mobile) || vmobile(mobile);
    const passwordError =
      required(password) || vpassword(password, confirm_password);
    const confirm_passwordError =
      required(confirm_password) || vpassword(password, confirm_password);
    const genderError = vgender(gender);

    if (
      usernameError ||
      emailError ||
      mobileError ||
      !selectedImage ||
      passwordError ||
      confirm_passwordError ||
      genderError ||
      !recaptchaValue ||
      !state.agreeTerms
    ) {
      // Update state with specific field errors
      setState((prevState) => ({
        ...prevState,
        usernameError,
        emailError,
        mobileError,
        avatarError: !selectedImage ? "Please upload an avatar." : "",
        passwordError,
        confirm_passwordError,
        genderError,
        recaptchaError: !recaptchaValue
          ? "Please verify that you are not a robot."
          : "",
        agreeTermsError: !state.agreeTerms
          ? "You must agree to the terms and conditions."
          : "",
      }));
    } else {
      // Proceed with registration
      const formData = new FormData();
      formData.append("username", username);
      formData.append("avatar", selectedImage);
      formData.append("email", email);
      formData.append("mobile", mobile);
      formData.append("gender", gender);
      formData.append("password", password);
      formData.append("confirm_password", confirm_password);

      console.log("Form data: " + JSON.stringify(formData));

      AuthService.register(formData).then(
        (response) => {
          setState({
            message: response.data.message,
            successful: true,
          });
          navigator("/login");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.response.data ||
            error.toString();
          setState((prevState) => ({
            ...prevState,
            successful: false,
            message: resMessage.toString(),
          }));
        }
      );
    }
  };

  const {
    successful,
    message,
    usernameError,
    emailError,
    avatarError,
    mobileError,
    passwordError,
    confirm_passwordError,
  } = state;

  return (
    <MDBContainer fluid>
      <MDBRow className="justify-content-center align-items-center m-5">
        <MDBCard style={{ marginTop: "-2vh", width: "150vh" }}>
          <MDBCardBody className="px-4">
            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5" id="form-title">
              Registration Form
            </h3>
            <Form onSubmit={handleRegister} ref={(c) => {}}>
              {!successful && (
                <div style={{ overflow: "auto" }}>
                  <MDBRow>
                    <MDBCol md="6">
                      <label htmlFor="username" className="input-field">
                        Username:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="username"
                        type="text"
                        name="username"
                        value={state.username}
                        onChange={onChange}
                        validations={[required, vusername]}
                      />
                      {usernameError && (
                        <div className="error-message">{usernameError}</div>
                      )}
                    </MDBCol>

                    <MDBCol md="6">
                      <label htmlFor="email" className="input-field">
                        Email:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="email"
                        type="text"
                        name="email"
                        value={state.email}
                        onChange={onChange}
                        validations={[required, vemail]}
                      />
                      {emailError && (
                        <div className="error-message">{emailError}</div>
                      )}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <label htmlFor="mobile" className="input-field">
                        Mobile:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="mobile"
                        type="text"
                        name="mobile"
                        value={state.mobile}
                        onChange={onChange}
                        validations={[required, vmobile]}
                      />
                      {mobileError && (
                        <div className="error-message">{mobileError}</div>
                      )}
                    </MDBCol>

                    <MDBCol md="6">
                      <label htmlFor="avatar" className="input-field">
                        Avatar:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="avatar"
                        type="file"
                        style={{ height: "fit-content" }}
                        name="avatar"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {avatarError && (
                        <div
                          className="alert alert-danger"
                          role="alert"
                          id="avatar-empty-alert"
                        >
                          {avatarError}
                        </div>
                      )}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <label htmlFor="password" className="input-field">
                        Password:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="password"
                        type="password"
                        name="password"
                        value={state.password}
                        onChange={onChange}
                        validations={[required, vpassword]}
                      />
                      {passwordError && (
                        <div className="error-message">{passwordError}</div>
                      )}
                    </MDBCol>

                    <MDBCol md="6">
                      <label htmlFor="confirm_password" className="input-field">
                        Confirm password:
                      </label>
                      <MDBInput
                        wrapperClass="mb-4"
                        size="lg"
                        id="confirm_password"
                        type="password"
                        name="confirm_password"
                        value={state.confirm_password}
                        onChange={onChange}
                      />
                      {confirm_passwordError && (
                        <div className="error-message">
                          {confirm_passwordError}
                        </div>
                      )}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="6">
                      <label htmlFor="gender" className="input-field">
                        Gender:
                      </label>
                      <select
                        className="gender-selection"
                        name="gender"
                        value={gender}
                        onChange={(e) => handleChangeGender(e)}
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        {genderOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {state.genderError && (
                        <div className="other-error-message">
                          {state.genderError}
                        </div>
                      )}
                    </MDBCol>
                    <MDBCol md="6">
                      <label htmlFor="recaptcha" className="input-field">
                        Verify ReCAPTCHA:
                      </label>
                      <ReCAPTCHA
                        sitekey="6LcFSGIpAAAAACwCDP0Yjv2uOYqztle4cXJZixoS"
                        onChange={(value) => setRecaptchaValue(value)}
                      />
                      {state.recaptchaError && (
                        <div
                          className="other-error-message"
                          style={{ color: "red" }}
                        >
                          {state.recaptchaError}
                        </div>
                      )}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12" className="term-check-agreement">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={state.agreeTerms}
                          onChange={onChange}
                        />
                        <label htmlFor="agreeTerms" id="agree-terms-label">
                          I agree to the terms and conditions of the IoT
                          healthcare platform.
                        </label>
                        {state.agreeTermsError && (
                          <div
                            className="other-error-message"
                            style={{ color: "red" }}
                          >
                            {state.agreeTermsError}
                          </div>
                        )}
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <div className="form-option">
                    <MDBBtn
                      className="mb-4"
                      size="lg"
                      type="submit"
                      id="register-confirmation"
                    >
                      Register
                    </MDBBtn>
                    <p class="fs-4 mb-0 fw-bold" id="alternative-option">
                      Already registered?
                    </p>
                    <Link to={`/login`} className="login-way">
                      Login Now
                    </Link>
                  </div>
                </div>
              )}
              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={(c) => {}} />
            </Form>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
