import {
  AddBusiness,
  Business,
  MenuOutlined,
  PeopleOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { BiSolidChat } from "react-icons/bi";
import { GiHealthIncrease } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { RiHealthBookFill, RiMentalHealthFill } from "react-icons/ri";
import { SiWorldhealthorganization } from "react-icons/si";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const AdminSideBar = (currentUser) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "0.5vh 3.5vh 0.5vh 2vh !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{
              margin: "1vh 0 2vh 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="1.5vh"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="2.5vh">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100vh"
                  height="100vh"
                  src={currentUser.currentUser.avatar}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  fontSize="2.5vh"
                  paddingTop="3%"
                  sx={{ m: "1vh 0 0 0" }}
                >
                  {currentUser.currentUser.username}
                </Typography>
                <Typography
                  variant="h5"
                  fontSize="1.9vh"
                  color={colors.greenAccent[500]}
                >
                  {currentUser.currentUser.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Profile"
              to="/profile"
              icon={<ImProfile />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Data
            </Typography>
            <Item
              title="User"
              to="/admin/user"
              icon={<PeopleOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Organisation"
              to="/admin/organisation"
              icon={<Business />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Recommendation"
              to="/health_recommendation-management/health_recommendations"
              icon={<RiMentalHealthFill style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Objective"
              to="/health_objective-management/health_objectives"
              icon={<GiHealthIncrease style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Forms
            </Typography>
            <Item
              title="Account Form"
              to="/admin/userform"
              icon={<PersonOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Organisation Form"
              to={"/admin/orgform"}
              icon={<AddBusiness />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Rec Form"
              to={"/admin/healthrecform"}
              icon={<RiHealthBookFill style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Health Goal Form"
              to={"/admin/healthobjForm"}
              icon={<SiWorldhealthorganization style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "1.5vh 0 0.5vh 2vh" }}
            >
              Communication
            </Typography>
            <Item
              title="Inbox"
              to="/inbox"
              icon={<BiSolidChat style={{ fontSize: "2.5vh" }} />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSideBar;
