import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/user-profile.css";
import useFetch from "../hooks/useFetch";
import apis from "../services/api-service";
import EditProfile from "./EditProfile";
import EditUserPassword from "./EditUserPassword";

const Profile = () => {
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "" });
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const [showProfileToast, setShowProfileToast] = useState(false);
  const [showPasswordToast, setShowPasswordToast] = useState(false);

  const { data, loading, error, reFetch } = useFetch(apis.user + "profile");

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("currentUser", JSON.stringify(data));
      window.onbeforeunload = () => {
        localStorage.removeItem("currentUser");
      };
    };
    fetchData();
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    console.log("Current user: " + localStorage.getItem("currentUser"));
    setUserReady(true);
  }, [data]);

  // Components for edit profile
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);

  const handleShowEditProfileDialog = (user) => {
    setOpenEditProfileDialog(true);
    setSelectedUserDetails(user);
  };

  const handleCloseEditProfileDialog = () => {
    setOpenEditProfileDialog(false);
    if (showPasswordToast) {
      setShowPasswordToast(false);
    }
    setShowProfileToast(true);
  };

  const handleDefaultProfileDialogClose = () => {
    setOpenEditProfileDialog(false);
  };

  const handleDefaultPasswordDialogClose = () => {
    setOpenEditPasswordDialog(false);
  };

  // Components for edit password
  const [openEditPasswordDialog, setOpenEditPasswordDialog] = useState(false);

  const handleShowEditPasswordDialog = (user) => {
    setOpenEditPasswordDialog(true);
    setSelectedUserDetails(user);
  };

  const handleCloseEditPasswordDialog = () => {
    setOpenEditPasswordDialog(false);
    if (showProfileToast) {
      setShowProfileToast(false);
    }
    setShowPasswordToast(true);
  };

  const handleProfileToastClose = () => {
    setShowProfileToast(false);
  };

  const handlePasswordToastClose = () => {
    setShowPasswordToast(false);
  };

  useEffect(() => {
    if (showProfileToast) {
      setTimeout(() => {
        setShowProfileToast(false);
      }, 7000);
    }
    if (showPasswordToast) {
      setTimeout(() => {
        setShowPasswordToast(false);
      }, 7000);
    }
  }, [showProfileToast, showPasswordToast]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="container">
      {userReady && (
        <div>
          <div className="header-notify">
            <Header title="Profile" subtitle="View personal information" />
            <Toast
              show={showProfileToast}
              onClose={handleProfileToastClose}
              className="set-goal-success-toast"
            >
              <Toast.Header>
                <div id="notification-header">
                  <strong style={{ fontSize: "2.4vh" }} className="mr-auto">
                    Notification
                  </strong>
                </div>
              </Toast.Header>
              <Toast.Body className="notification-content">
                User profile has been updated.
              </Toast.Body>
            </Toast>
            <Toast
              show={showPasswordToast}
              onClose={handlePasswordToastClose}
              className="set-goal-success-toast"
            >
              <Toast.Header>
                <div id="notification-header">
                  <strong style={{ fontSize: "2.4vh" }} className="mr-auto">
                    Notification
                  </strong>
                </div>
              </Toast.Header>
              <Toast.Body className="notification-content">
                User password has been updated.
              </Toast.Body>
            </Toast>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4" id="profile-overview">
                <div className="card-body text-center">
                  <img
                    src={currentUser.avatar}
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "25vh", height: "25vh" }}
                  />
                  <h5 className="my-3" style={{ fontSize: "3vh" }}>
                    {currentUser.username}
                  </h5>
                  <p className="text-muted mb-4 user-info">
                    {currentUser.email}
                  </p>
                  <div className="profile-management">
                    <Button
                      onClick={() => handleShowEditProfileDialog(currentUser)}
                      className="edit-profile-btn"
                    >
                      <FaUserEdit className="profile-management-icon" />
                      EDIT PROFILE
                    </Button>
                    {openEditProfileDialog && (
                      <EditProfile
                        show={openEditProfileDialog}
                        user={selectedUserDetails}
                        handleClose={handleCloseEditProfileDialog}
                        handleCloseDefault={handleDefaultProfileDialogClose}
                        reFetch={reFetch}
                      />
                    )}
                    <Button
                      onClick={() => handleShowEditPasswordDialog(currentUser)}
                      className="edit-password-btn"
                    >
                      <RiLockPasswordFill className="profile-management-icon" />
                      EDIT PASSWORD
                    </Button>
                    {openEditPasswordDialog && (
                      <EditUserPassword
                        show={openEditPasswordDialog}
                        user={selectedUserDetails}
                        handleClose={handleCloseEditPasswordDialog}
                        handleCloseDefault={handleDefaultPasswordDialogClose}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4" id="profile-details">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">UID</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0 user-info">
                        {currentUser.id}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0 user-info">
                        {currentUser.username}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0 user-info">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">Mobile</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0 user-info">
                        {currentUser.mobile}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">Gender</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0 user-info">
                        {currentUser.gender}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 user-info">Authorities</p>
                    </div>
                    <div className="col-sm-9" id="role-list">
                      <ul
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          listStyle: "none",
                        }}
                      >
                        {currentUser.roles &&
                          currentUser.roles.map((role, index) => (
                            <li
                              key={index}
                              className="user-info"
                              id="role-item"
                            >
                              {role}
                              {index !== currentUser.roles.length - 1 && ", "}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  {!currentUser.roles ||
                    (!currentUser.roles.includes("admin") && (
                      <div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0 user-info">Organisation</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0 user-info">
                              {currentUser.organisation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
