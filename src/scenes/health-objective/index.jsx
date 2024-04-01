import { Delete, Visibility } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomDialog from "../../components/Dialog";
import Header from "../../components/Header";
import "../../css/health-objective.css";
import "../../css/user-index.css";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import { tokens } from "../../theme";
import NotificationToast from "../notification";
import HealthObjectiveDetails from "./detailsDialog";

const HealthObjective = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { data, loading, error, reFetch } = useFetch(
    apis.healthObjectiveManagement + "health_objectives"
  );

  // Component for view health objective details
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHealthObjectiveDetails, setSelectedHealthObjectiveDetails] =
    useState(null);

  // Open the details dialog
  const handleViewDetails = (health_recommendation) => {
    setSelectedHealthObjectiveDetails(health_recommendation);
    setOpenDialog(true);
  };

  // Close the details dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      localStorage.setItem("health_objectives", JSON.stringify(data));
    };
    fetchData();
  }, [data]);

  // Component for delete health objective
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [healthObjectiveToDelete, setHealthObjectiveToDelete] = useState(null);

  // Open the delete dialog
  const handleOpenDeleteDialog = (health_objective) => {
    setHealthObjectiveToDelete(health_objective);
    setDeleteDialogOpen(true);
  };

  // Close the delete dialog
  const handleCloseDeleteDialog = () => {
    setToastMessage("Health Objective deleted successfully");
    setDeleteDialogOpen(false);
    setHealthObjectiveToDelete(null);
    setShowToast(true);
  };

  const handleDefaultCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (healthObjectiveToDelete) {
      const id = healthObjectiveToDelete.id;
      const url = apis.healthObjectiveManagement + "health_objective";

      try {
        // Send a DELETE request to the server
        const res = await axios.delete(url, {
          params: { health_objective_id: id },
          headers: authHeader(),
          withCredentials: true,
        });

        // Check if the delete was successful
        if (res.status === 200) {
          const updatedData = await reFetch();
          console.log(updatedData);

          localStorage.setItem(
            "health_objectives",
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
      field: "title",
      headerName: "Objective Title",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value),
      headerClassName: "field-header-style",
    },
    {
      field: "heart_rate",
      headerName: "Heart Rate Status",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value + " bpm"),
      headerClassName: "field-header-style",
    },
    {
      field: "temperature",
      headerName: "Temperature Status",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value + " °C"),
      headerClassName: "field-header-style",
    },
    {
      field: "blood_pressure",
      headerName: "Blood Pressure Status",
      flex: 1,
      renderCell: ({ value }) => renderCellWithValue(value + " mmHg"),
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
          title="Health Objective"
          subtitle="Managing the health objectives"
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
        <HealthObjectiveDetails
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedHealthObjectiveDetails={selectedHealthObjectiveDetails}
        />
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

export default HealthObjective;
