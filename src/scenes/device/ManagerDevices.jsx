import { AddBox, EditOutlined } from "@mui/icons-material";
import { Box, Button, Drawer, Link, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "../../css/manager-devices.css";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import AddDevice from "../form/addDevice";
import DeviceBox from "./DeviceBox";
import AssignDeviceForm from "../form/assignDevice";

const ManagerDevices = () => {
  const { data, loading, error, reFetch } = useFetch(
    apis.device + "manager/devices"
  );
  const devicesByOwner = {};
  data.forEach((device) => {
    let ownerId = device.ownerUserName;
    const key = ownerId !== null ? ownerId : "Unassigned";

    if (!devicesByOwner[key]) {
      devicesByOwner[key] = [];
    }
    devicesByOwner[key].push(device);
  });
  console.log(devicesByOwner);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     localStorage.setItem("user_devices", JSON.stringify(data));
  //   };
  //   fetchData();
  // }, [data]);
  const [clickedDevice, setClickedDevice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleDeviceClick = (device) => {
    setClickedDevice(device);
    setDrawerOpen(true);
  };
  const handleDrawerClose = async () => {
    // await reFetch();
    setClickedDevice(null);
    setDrawerOpen(false);
  };
  const formatCreatedTime = (createdTime) => {
    const date = new Date(createdTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  // const [filterStatus, setFilterStatus] = useState('All');
  // const handleFilterChange = (event) => {
  //   setFilterStatus(event.target.value);
  // };

  // const filteredDevices = data.filter((device) => {
  //   if (filterStatus === 'All') {
  //     return true; // Show all devices
  //   }
  //   return device.status.toLowerCase() === filterStatus.toLowerCase();
  // });

  console.log(clickedDevice);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handleOpenAssignDialog = () => {
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
  };
  console.log(clickedDevice);
  const handleUnassignDevice = async () => {
    setIsSubmitting(true);
    const assignDevice = {
      owner: clickedDevice.ownerUserName,
      device_id: clickedDevice.id,
    };
    try {
      // Make a request to unassign the device
      await axios.post(`${apis.device}device/unassign`, assignDevice, {
        headers: authHeader(),
        withCredentials: true,
      });
      handleDrawerClose();
      setIsSubmitting(false);
      await reFetch();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error unassigning device:", error);
      // Handle error, maybe show a notification to the user
    }
  };
  const [editedName, setEditedName] = useState();
  useEffect(() => {
    if (clickedDevice) {
      setEditedName(clickedDevice.name)
    }
  }, [clickedDevice]);
  const [isEditingName, setIsEditingName] = useState(false);
  const handleSaveName = async() => {
    setIsEditingName(false);
    try{
      const editDevice = {
        'id': clickedDevice.id,
        'name': editedName
      }
      await axios.post(`${apis.device}device/edit`, editDevice, {
        headers: authHeader(),
        withCredentials: true,
      });
      handleDrawerClose();
      setEditedName("")
      await reFetch()
    }catch(err){
      handleDrawerClose();
      setEditedName("")
      console.log(err)
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    // Reset the edited name to the original device name
    setEditedName(clickedDevice.name);
  };

  const handleChangeName = (event) => {
    setEditedName(event.target.value);
  };
  return (
    <Box m="3vh">
      <Header title="Devices" subtitle="Managing your own devices" />
      <Button
        onClick={() => handleOpenAddDialog()}
        sx={{ color: "red" }}
      >
        Add Device
      </Button>

      <Button
        onClick={() => handleOpenAssignDialog()}
        sx={{ color: "red" }}
      >
        Assign Device
      </Button>
      {/* <Box m="2vh">
        <FormControl display="flex" flex-wrap='wrap' justify-content= 'start'>
            <InputLabel>Status</InputLabel>
            <Select
                // value={filterStatus}
                // onChange={handleFilterChange}
                style={{ marginLeft: '10px', position: 'relative'}}
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="On">On</MenuItem>
                <MenuItem value="Off">Off</MenuItem>
            </Select>
            <InputLabel style={{ marginLeft: '10px' }}>Manufacturer</InputLabel>
            <Select
                // value={anotherFilter}
                // onChange={handleAnotherFilterChange}
                style={{ marginLeft: '10px', position: 'relative'}}
            >
                <MenuItem value="SomeValue">Toshiba</MenuItem>
                <MenuItem value="AnotherValue">Samsung</MenuItem>
                {/* Add more options as needed */}
      {/* </Select> */}
      {/* </FormControl> */}
      {/* </Box> */}
      <div className="app-container">
        <div className="devicesContainer">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            Object.entries(devicesByOwner).map(([ownerId, devices]) => (
              <div key={ownerId} className="owner-container">
                {/* Render owner information */}
                <h3>{ownerId}</h3>

                {/* Render devices for this owner */}
                <div className="device-container">
                  {devices.map((device) => (
                    <DeviceBox
                      key={device.id}
                      status={device._active ? "Online" : "Offline"}
                      latestData={device.additional_info}
                      deviceName={device.name}
                      isClicked={
                        clickedDevice && clickedDevice.name === device.name
                      }
                      onClick={() => handleDeviceClick(device)}
                      className="device-box"
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        width={300}
      >
        <Box p={2}>
          <Typography variant="h5">Device Information</Typography>

          {clickedDevice && (
            <div>
              <Typography variant="subtitle1">{`Device Name: ${clickedDevice.name}`}</Typography>
              {isEditingName ? (
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={handleChangeName}
                />
                <button onClick={handleSaveName}>Save</button>
                <button onClick={handleCancelEditName}>Cancel</button>
              </div>):(
                <EditOutlined
                  onClick={()=>setIsEditingName(true)}
                  style={{ marginRight: "2vh" }}
              />
              )}
              <Typography variant="subtitle1">{`Type: ${clickedDevice.type}`}</Typography>
              <Typography variant="subtitle1">{`Status: ${
                clickedDevice._active ? "Online" : "Offline"
              }`}</Typography>
              <Typography variant="subtitle1">{`Created Time: ${formatCreatedTime(
                clickedDevice.created_time
              )}`}</Typography>
              {clickedDevice.picture && (
                <img
                  src={clickedDevice.picture}
                  alt={`Device ${clickedDevice.name} Picture`}
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUnassignDevice}
                disabled={isSubmitting}
              >
                {isSubmitting ? <span>Loading...</span> : "Unassign"}
              </Button>
            </div>
          )}
        </Box>
      </Drawer>
      {addDialogOpen && (
        <AddDevice handleClose={handleCloseAddDialog} reFetch={reFetch} />
      )}
      {assignDialogOpen && (
        <AssignDeviceForm
          handleClose={handleCloseAssignDialog}
          reFetch={reFetch}
          isManager  = {true}
        />
      )}
    </Box>
  );
};

export default ManagerDevices;
