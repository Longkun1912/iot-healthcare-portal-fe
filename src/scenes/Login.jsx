import React, { useState } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import { Link, useNavigate } from "react-router-dom";
import "../../src/css/login.css";
import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = ({ fetchRoles }) => {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    AuthService.login(email, password).then(
      () => {
        fetchRoles();
        navigator("/profile");
      },
      (error) => {
        setMessage("Incorrect email or password! Please try again.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="col-md-12">
      <div className="card card-container" id="login-form">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleLogin} ref={(c) => {}}>
          <div class="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <Input
              type="text"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validations={[required]}
            />
          </div>

          <div class="mb-4">
            <label
              htmlFor="password"
              className="form-label"
              style={{ fontSize: "3vh" }}
            >
              Password:
            </label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              validations={[required]}
            />
          </div>

          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="form-check" style={{ marginLeft: "2.5vh" }}>
              <input
                class="form-check-input primary"
                style={{ fontSize: "3vh" }}
                type="checkbox"
                value=""
                id="flexCheckChecked"
                checked
              />
              <label class="form-check-label text-dark" for="flexCheckChecked">
                Remember Me
              </label>
            </div>
            {/* <a class="text-primary fw-bold" href="./index.html">
              Forgot Password ?
            </a> */}
          </div>

          <div className="form-group" id="login-option">
            <button
              className="btn btn-primary btn-block"
              disabled={loading}
              id="login-btn"
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={(c) => {}} />
          <div
            class="d-flex align-items-center justify-content-center"
            style={{ marginTop: "2vh" }}
          >
            <p class="fs-4 mb-0 fw-bold">Don't have an account yet?</p>
            <Link to={`/register`} className="register-btn">
              Register Now
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
