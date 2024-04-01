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
import { tokens } from "../../theme";
import NotificationToast from "../notification";
import HealthRecommendationDetails from "./detailsDialog";
import HealthRecommendationUpdateForm from "./editDialog";

const HealthRecommendation = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { data, loading, error, reFetch } = useFetch(
    apis.healthRecommendationManagement + "health_recommendations"
  );

  // Component for view health recommendation details
  const [openDialog, setOpenDialog] = useState(false);
  const [
    selectedHealthRecommendationDetails,
    setSelectedHealthRecommendationDetails,
  ] = useState(null);

  // Open the details dialog
  const handleViewDetails = (health_recommendation) => {
    setSelectedHealthRecommendationDetails(health_recommendation);
    setOpenDialog(true);
  };

  // Close the details dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Components for edit health recommendation
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Open the edit dialog
  const handleEdit = (health_recommendation) => {
    setOpenEditDialog(true);
    setSelectedHealthRecommendationDetails(health_recommendation);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setToastMessage("Health Recommendation updated successfully");
    setOpenEditDialog(false);
    setShowToast(true);
  };

  const handleDefaultCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleDefaultCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("health_recommendations", JSON.stringify(data));
    };
    fetchData();
  }, [data]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [healthRecommendationToDelete, setHealthRecommendationToDelete] =
    useState(null);

  // Open the delete dialog
  const handleOpenDeleteDialog = (health_recommendation) => {
    setHealthRecommendationToDelete(health_recommendation);
    setDeleteDialogOpen(true);
  };

  // Close the delete dialog
  const handleCloseDeleteDialog = () => {
    setToastMessage("Health Recommendation deleted successfully");
    setDeleteDialogOpen(false);
    setHealthRecommendationToDelete(null);
    setShowToast(true);
  };

  const handleDelete = async () => {
    if (healthRecommendationToDelete) {
      const id = healthRecommendationToDelete.id;
      const url = apis.healthRecommendationManagement + "health_recommendation";

      try {
        // Send a DELETE request to the server
        const res = await axios.delete(url, {
          params: { health_recommendation_id: id },
          headers: authHeader(),
          withCredentials: true,
        });

        // Check if the delete was successful
        if (res.status === 200) {
          const updatedData = await reFetch();
          console.log(updatedData);

          localStorage.setItem(
            "health_recommendations",
            JSON.stringify(updatedData)
          );
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
  const renderCellWithValue = (value) => <div class="user-fields">{value}</div>;

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "heart_rate_impact",
      headerName: "Heart Rate Impact",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "blood_pressure_impact",
      headerName: "Blood Pressure Impact",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "temperature_impact",
      headerName: "Temperature Impact",
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

  return (
    <Box m="3vh">
      <div style={{ display: "flex" }}>
        <Header
          title="Health Recommendation"
          subtitle="Managing the health recommendations"
        />
        <NotificationToast
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
        />
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
          rows={data}
          loading={loading}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
        />
        <HealthRecommendationDetails
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedHealthRecommendationDetails={
            selectedHealthRecommendationDetails
          }
        />
        {openEditDialog && (
          <HealthRecommendationUpdateForm
            healthRecommendation={selectedHealthRecommendationDetails}
            handleCloseDialog={handleCloseEditDialog}
            handleCloseDefaultDialog={handleDefaultCloseEditDialog}
            reFetch={reFetch}
          />
        )}
      </Box>
      <CustomDialog
        open={deleteDialogOpen}
        handleClose={handleDefaultCloseDeleteDialog}
        handleConfirm={handleDelete}
        title="Delete Health Recommendation"
        description="Are you sure you want to remove this health recommendation?"
      />
    </Box>
  );
};

export default HealthRecommendation;
