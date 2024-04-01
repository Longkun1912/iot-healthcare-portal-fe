import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import NotificationToast from "../notification";
import authService from "../../services/auth.service";
import useFetch from "../../hooks/useFetch";

const initialValues = {
  deviceId: "",

};
const userSchema = yup.object().shape({
  // deviceId: yup.string().required("This field must not be empty"),
});
const AssignDeviceForm = ({ handleClose, reFetch, isManager }) => {
  
  const owner = authService.getCurrentUser().username;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState("");

  const [selectedDevice, setSelectedDevice] = useState();
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [usersOptions, setUsersOptions] = useState([]);

  const fetchDevices = async () => {
    try {
      const devicesResponse = await axios.get(
        apis.device + "devices/unassigned",
        { headers: authHeader(), withCredentials: true }
      );
      const deviceOptions = devicesResponse.data.map((device) => ({
        id: device.id,
        name: device.name,
      }));
      console.log(deviceOptions)
      setDevicesOptions(deviceOptions);
      const usersResponse = await axios.get(
        apis.manager + "users",
        { headers: authHeader(), withCredentials: true }
      );
      const usersOptions = usersResponse.data.map((user) => ({
        id: user.id,
        name: user.username,
      }));
      console.log(usersOptions)
      setUsersOptions(usersOptions)

    } catch (error) {
      console.error("Error fetching unassigned device:", error);
      setMessage("Error fetching unassigned devices");
    }
  };
  fetchDevices();
  const onChangeDevice = (e) => {
    setSelectedDevice(e.target.value);
  };
  const onChangeUser = (e) => {
    setSelectedUser(e.target.value);
  };
  const handleCloseToast = () => {
    setShowToast(false);
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  }, [showToast]);
  const handleAssignDevice = async (values) => {
    setIsSubmitting(true);
    const assignDevice = {
      owner: isManager ? selectedUser : owner,
      device_id: selectedDevice,
    };
    console.log(assignDevice);
    try {
      const url = `${apis.device}device/assign`;
      const res = await axios.post(url, assignDevice, {
        headers: authHeader(),
        withCredentials: true,
      });

      if (res.status === 200) {
        handleClose();
        await reFetch();
        setToastMessage("Device assign successfully");
        setShowToast(true);
        setIsSubmitting(false);
      } else {
        // Handle error
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      // Handle error
    }
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Assign Device</DialogTitle>
      <NotificationToast
        show={showToast}
        onClose={handleCloseToast}
        message={message}
      />
      <DialogContent>
        <Formik
          onSubmit={handleAssignDevice}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                // gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Devices"
                  onBlur={handleBlur}
                  onChange={onChangeDevice}
                  value={selectedDevice}
                  name="devices"
                  sx={{ minWidth: 80, marginLeft: "5vh", width: "30vh" }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a device</em>
                  </MenuItem>
                  {devicesOptions.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </TextField>
                {isManager && (
                    <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="Users"
                    onBlur={handleBlur}
                    onChange={onChangeUser}
                    value={selectedUser}
                    name="users"
                    sx={{ minWidth: 80, marginLeft: "5vh", width: "30vh" }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select an user</em>
                      </MenuItem>
                      {usersOptions.map((user) => (
                        <MenuItem key={user.id} value={user.name}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </TextField>
                )}
                
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="3vh"
                pt="3vh"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  id="create-user-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span>Loading...</span> : "Add"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDeviceForm;
