import { Delete, EditOutlined, Visibility } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomDialog from "../../components/Dialog";
import Header from "../../components/Header";
import "../../css/organisation-index.css";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import { tokens } from "../../theme";
import NotificationToast from "../notification";
import OrgDetails from "./detailsDialog";
import OrgUpdateForm from "./editDialog";

const Organisation = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { data, loading, error, reFetch } = useFetch(
    apis.organisation + "organisations"
  );

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("organisations", JSON.stringify(data));
      window.onbeforeunload = () => {
        localStorage.removeItem("organisations");
      };
    };

    fetchData();
  }, [data]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrgDetails, setSelectedOrgDetails] = useState(null);

  // Open the details dialog
  const handleOpenDetailsDialog = (org) => {
    setSelectedOrgDetails(org);
    setDetailDialogOpen(true);
  };

  // Close the details dialog
  const handleCloseDetailsDialog = () => {
    setDetailDialogOpen(false);
    setSelectedOrgDetails(null);
  };

  // Open the edit dialog
  const handleOpenEditDialog = (org) => {
    setSelectedOrgDetails(org);
    setEditDialogOpen(true);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setToastMessage("Organisation updated successfully");
    setEditDialogOpen(false);
    setSelectedOrgDetails(null);
    setShowToast(true);
  };

  const handleDefaultCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // Open the delete dialog
  const handleOpenDeleteDialog = (org) => {
    setSelectedOrgDetails(org);
    setDeleteDialogOpen(true);
  };

  const handleDefaultCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Close the delete dialog
  const handleCloseDeleteDialog = () => {
    setToastMessage("Organisation deleted successfully");
    setDeleteDialogOpen(false);
    setSelectedOrgDetails(null);
    setShowToast(true);
  };

  const handleDelete = async () => {
    if (selectedOrgDetails) {
      const id = selectedOrgDetails.id;
      const url = apis.organisation + "organisation";

      try {
        // Send a DELETE request to the server
        const res = await axios.delete(url, {
          params: { org_id: id },
          headers: authHeader(),
          withCredentials: true,
        });

        // Check if the delete was successful
        if (res.status === 200) {
          const updatedData = await reFetch();
          console.log(updatedData);

          localStorage.setItem("organisations", JSON.stringify(updatedData));

          // setOrganisations(updatedData);

          handleCloseDeleteDialog();
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
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "header-text",
      cellClassName: "data-cell",
    },
    {
      field: "contact_number",
      headerName: "Contact Number",
      flex: 2,
      headerClassName: "header-text",
      cellClassName: "data-cell",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      headerClassName: "header-text",
      cellClassName: "data-cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      cellClassName: "data-cell",
      renderCell: ({ row }) => (
        <Box p="1vh" display="flex" justifyContent="center">
          <Link
            onClick={() => handleOpenDetailsDialog(row)}
            style={{ marginRight: "2vh" }}
          >
            <Visibility />
          </Link>
          <Link
            onClick={() => handleOpenEditDialog(row)}
            style={{ marginRight: "2vh" }}
          >
            <EditOutlined />
          </Link>
          <Link>
            <Delete onClick={() => handleOpenDeleteDialog(row)} />
          </Link>
        </Box>
      ),
      headerClassName: "header-text",
    },
  ];

  return (
    <Box m="2vh">
      <div style={{ display: "flex" }}>
        <Header title="Organisation" subtitle="Managing the organisations" />
        <NotificationToast
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
        />
      </div>
      <Box
        m="4vh 0 0 0"
        height="75vh"
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
          rows={data}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <CustomDialog
        open={deleteDialogOpen}
        handleClose={handleDefaultCloseDeleteDialog}
        handleConfirm={handleDelete}
        title="Delete Organization"
        description="Are you sure you want to delete this organization?"
      />
      <OrgDetails
        openDialog={detailDialogOpen}
        handleCloseDialog={handleCloseDetailsDialog}
        selectedOrgDetails={selectedOrgDetails}
      />
      {editDialogOpen && (
        <OrgUpdateForm
          handleCloseDialog={handleCloseEditDialog}
          handleDefaultCloseEditDialog={handleDefaultCloseEditDialog}
          org={selectedOrgDetails}
          reFetch={reFetch}
        />
      )}
    </Box>
  );
};

export default Organisation;
