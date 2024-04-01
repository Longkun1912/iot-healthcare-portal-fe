import { Delete, EditOutlined, Visibility } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomDialog from "../../components/Dialog";
import Header from "../../components/Header";
import "../../css/user-index.css";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import authService from "../../services/auth.service";
import { tokens } from "../../theme";
import NotificationToast from "../notification";
import UserUpdateForm from "./update-user";
import UserDetails from "./user-details";

const User = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const user = authService.getCurrentUser();
  const apiEndpoint = user
    ? user.roles.includes("admin")
      ? apis.admin + "users"
      : apis.manager + "users"
    : null;

  const { data, loading, error, reFetch } = useFetch(apiEndpoint);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data.filter((userData) => userData.id !== user.id));
  }, [data, user.id]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const filterRefetch = async () => {
    const refetchData = await reFetch();
    setFilteredData(refetchData);
  };

  const handleViewDetails = (user) => {
    setSelectedUserDetails(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Components for edit user
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleEdit = (user) => {
    setOpenEditDialog(true);
    setSelectedUserDetails(user);
  };

  const handleCloseEditDialog = () => {
    setToastMessage("User updated successfully");
    setOpenEditDialog(false);
    setShowToast(true);
  };

  const handleCloseDefaultEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usertoDelete, setUserToDelete] = useState(null);

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (usertoDelete) {
      const id = usertoDelete.id;
      const url = user
        ? user.roles.includes("admin")
          ? apis.admin + "user"
          : apis.manager + "user"
        : null;
      try {
        // Send a DELETE request to the server
        const res = await axios.delete(url, {
          params: { user_id: id },
          headers: authHeader(),
          withCredentials: true,
        });

        // Check if the delete was successful
        if (res.status === 200) {
          const updatedData = await filterRefetch();
          localStorage.setItem("users", JSON.stringify(updatedData));
          handleCloseDeleteDialog();
          setToastMessage("User deleted successfully");
          setShowToast(true);
        } else {
          // Handle error
        }
      } catch (err) {
        console.error(err);
        // Handle error
      }
    }
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  }, [showToast]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "id",
      headerName: "UID",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style username-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "organisation",
      headerName: "Organisation",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box p="1vh" display="flex" justifyContent="center">
          <Link>
            <Visibility
              onClick={() => handleViewDetails(row)}
              style={{ marginRight: "2vh" }}
            />
          </Link>
          <Link>
            <EditOutlined
              onClick={() => handleEdit(row)}
              style={{ marginRight: "2vh" }}
            />
          </Link>
          <Link>
            <Delete onClick={() => handleOpenDeleteDialog(row)} />
          </Link>
        </Box>
      ),
      headerClassName: "field-header-style",
    },
  ];

  const renderCellWithValue = (value) => <div class="user-fields">{value}</div>;

  return (
    <Box m="3vh">
      <div className="header-container">
        <div style={{ display: "flex" }}>
          <Header title="User" subtitle="Managing the user members" />
          <NotificationToast
            show={showToast}
            onClose={handleCloseToast}
            message={toastMessage}
          />
        </div>
      </div>
      <Box
        height="75vh"
        width="165vh"
        padding-bottom="5vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .css-hia42h-MuiCircularProgress-root": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          loading={loading}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
        />
        <UserDetails
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedUserDetails={selectedUserDetails}
        />
        {openEditDialog && (
          <UserUpdateForm
            user={selectedUserDetails}
            handleClose={handleCloseEditDialog}
            reFetch={filterRefetch}
            handleCloseDefault={handleCloseDefaultEditDialog}
          />
        )}
      </Box>
      <CustomDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleDelete}
        title="Delete User"
        headerName="Delete User"
        description="Are you sure you want to delete this user?"
      />
    </Box>
  );
};

export default User;
