import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";

import { CssBaseline, ThemeProvider } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import { useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./common/with-router";
import HealthProgress from "./scenes/HealthProgress.jsx";
import HealthRecord from "./scenes/HealthRecord.jsx";
import Login from "./scenes/Login";
import Profile from "./scenes/Profile";
import Register from "./scenes/Register";
import UnauthorizedPage from "./scenes/Unauthorized";
import Inbox from "./scenes/communication/Inbox.jsx";
import ManagerDevices from "./scenes/device/ManagerDevices.jsx";
import UserDevices from "./scenes/device/userDevices.jsx";
import HealthObjForm from "./scenes/form/healthObjective.jsx";
import HealthRecForm from "./scenes/form/healthRecommendation.jsx";
import OrgForm from "./scenes/form/organisation";
import UserForm from "./scenes/form/user";
import NavBar from "./scenes/global/Navbar";
import AdminSideBar from "./scenes/global/Sidebar/AdminSideBar.jsx";
import ManagerSideBar from "./scenes/global/Sidebar/ManagerSideBar.jsx";
import UserSideBar from "./scenes/global/Sidebar/UserSideBar.jsx";
import HealthObjective from "./scenes/health-objective/index.jsx";
import UserObjectiveView from "./scenes/health-objective/user-view.jsx";
import HealthRecommendation from "./scenes/health-recommendation/index.jsx";
import Organisation from "./scenes/organizations";
import User from "./scenes/users";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showManagerBoard, setShowManagerBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const navigator = useNavigate();
  const fetchRoles = () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowManagerBoard(
        Array.isArray(user.roles) && user.roles.includes("manager")
      );
      setShowAdminBoard(
        Array.isArray(user.roles) && user.roles.includes("admin")
      );
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const logOut = () => {
    navigator("/login");
    AuthService.logout();
    setShowManagerBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {currentUser && (
            <>
              {currentUser.roles.includes("admin") ? (
                <AdminSideBar currentUser={currentUser} isSidebar={isSidebar} />
              ) : currentUser.roles.includes("manager") ? (
                <ManagerSideBar
                  currentUser={currentUser}
                  isSidebar={isSidebar}
                />
              ) : currentUser.roles.includes("user") ? (
                <UserSideBar currentUser={currentUser} isSidebar={isSidebar} />
              ) : null}
            </>
          )}
          <main className="content">
            <NavBar
              logOut={logOut}
              currentUser={currentUser}
              showAdminBoard={showAdminBoard}
              showManagerBoard={showManagerBoard}
            />
            <Routes>
              <Route path="/" element={<Login fetchRoles={fetchRoles} />} />
              <Route
                path="/login"
                element={<Login fetchRoles={fetchRoles} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin/user"
                element={
                  <ProtectedRoute element={<User />} requiredRole="admin" />
                }
              />
              <Route
                path="/admin/organisation"
                element={
                  <ProtectedRoute
                    element={<Organisation />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/admin/userform"
                element={
                  <ProtectedRoute element={<UserForm />} requiredRole="admin" />
                }
              />
              <Route
                path="/admin/orgform/"
                element={
                  <ProtectedRoute element={<OrgForm />} requiredRole="admin" />
                }
              />
              <Route
                path="/admin/healthrecform/"
                element={
                  <ProtectedRoute
                    element={<HealthRecForm />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/admin/healthObjform/"
                element={
                  <ProtectedRoute
                    element={<HealthObjForm />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/health_recommendation-management/health_recommendations"
                element={
                  <ProtectedRoute
                    element={<HealthRecommendation />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/health_objective-management/health_objectives"
                element={
                  <ProtectedRoute
                    element={<HealthObjective />}
                    requiredRole="admin"
                  />
                }
              />
              <Route
                path="/health_objective-management/user_health_objectives"
                element={
                  <ProtectedRoute
                    element={<UserObjectiveView />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/device-management/devices"
                element={
                  <ProtectedRoute
                    element={<UserDevices />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/health_progress/"
                element={
                  <ProtectedRoute
                    element={<HealthProgress />}
                    requiredRole="user"
                  />
                }
              />
              <Route
                path="/inbox/"
                element={
                  <ProtectedRoute element={<Inbox />} requiredRole="user" />
                }
              />
              <Route path="/health" element={<HealthRecord />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route
                path="/manager/user"
                element={
                  <ProtectedRoute element={<User />} requiredRole="manager" />
                }
              />
              <Route
                path="/manager/devices"
                element={
                  <ProtectedRoute
                    element={<ManagerDevices />}
                    requiredRole="manager"
                  />
                }
              />
              <Route
                path="/manager/userform"
                element={
                  <ProtectedRoute
                    element={<UserForm />}
                    requiredRole="manager"
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
