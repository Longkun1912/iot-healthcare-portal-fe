import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import NotificationToast from "../notification";

const initialValues = {
  deviceId: "",
};
const userSchema = yup.object().shape({
  deviceId: yup.string().required("This field must not be empty"),
});
export default function AddDevice({ handleClose, reFetch }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState("");
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
  const handleAddDevice = async (values) => {
    setIsSubmitting(true);
    try {
      if (values.deviceId) {
        const url = `${apis.device}device/add?device_id=${values.deviceId}`;
        const res = await axios.post(url, null, {
          headers: authHeader(),
          withCredentials: true,
        });

        if (res.status === 200) {
          handleClose();
          await reFetch();
          setToastMessage("Device added successfully");
          setShowToast(true);
          setIsSubmitting(false);
        } else {
          // Handle error
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      // Handle error
    }
  };
  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Add Device to Organisation</DialogTitle>
      <NotificationToast
        show={showToast}
        onClose={handleCloseToast}
        message={message}
      />
      <DialogContent>
        <Formik
          onSubmit={handleAddDevice}
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
                  type="text"
                  label="Device Id"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.deviceId}
                  name="deviceId"
                  error={!!touched.deviceId && !!errors.deviceId}
                  helperText={
                    touched.deviceId && (
                      <span className="validation-error">
                        {errors.deviceId}
                      </span>
                    )
                  }
                  sx={{ gridColumn: "span 4" }}
                  InputLabelProps={{
                    style: {
                      fontSize: "2vh",
                    },
                  }}
                  inputProps={{
                    style: {
                      fontSize: "3vh",
                    },
                  }}
                />
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
}
