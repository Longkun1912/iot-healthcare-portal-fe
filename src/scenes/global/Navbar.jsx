import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";

const NavBar = ({ logOut, currentUser, showAdminBoard, showManagerBoard }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <nav
      className="navbar navbar-expand navbar-dark mb-4"
      style={{
        backgroundColor: `${colors.primary[700]}`,
        color: `${colors.grey[100]}`,
        display: "flex",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexBasis: "80%" }}>
        <div className="navbar-nav mr-auto">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </IconButton>
        </div>
      </div>
      <div style={{ flexBasis: "20%", position: "relative" }}>
        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link
                to={"/profile"}
                className="nav-link"
                style={{ fontSize: "2vh" }}
              >
                {currentUser.username}
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                onClick={logOut}
                style={{ fontSize: "2vh" }}
              >
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto" style={{ marginLeft: "50%" }}>
            <li className="nav-item">
              <Link
                to={"/login"}
                className="nav-link"
                style={{ fontSize: "2vh" }}
              >
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={"/register"}
                className="nav-link"
                style={{ fontSize: "2vh" }}
              >
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
