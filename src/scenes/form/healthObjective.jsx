import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Header from "../../components/Header";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import NotificationToast from "../notification";

const initialValues = {
  title: "",
  picture: "",
  heart_rate: "",
  blood_pressure: "",
  temperature: "",
  description: "",
  information_url: "",
};

const healthObjectiveSchema = yup.object().shape({
  title: yup.string().required("This field cannot be empty"),
  heart_rate: yup
    .number()
    .typeError("This field must be a number")
    .required("This field cannot be empty"),
  blood_pressure: yup
    .number()
    .typeError("This field must be a number")
    .required("This field cannot be empty"),
  temperature: yup
    .number()
    .typeError("This field must be a number")
    .required("This field cannot be empty"),
  description: yup.string().required("This field cannot be empty"),
  information_url: yup.string().required("This field cannot be empty"),
});

const HealthObjForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const url = apis.healthObjectiveManagement + "health_objective";

  const handleFormSubmit = async (values) => {
    if (selectedPicture) {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("picture", selectedPicture);
      formData.append("heart_rate", parseInt(values.heart_rate, 10));
      formData.append("blood_pressure", parseInt(values.blood_pressure, 10));
      formData.append("temperature", parseInt(values.temperature, 10));
      formData.append("description", values.description);
      formData.append("information_url", values.information_url);

      try {
        const res = await axios.post(url, formData, {
          headers: authHeader(),
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsSubmitting(false);
          setToastMessage("Health Objective created successfully");
          setShowToast(true);
        } else {
          setIsSubmitting(false);
          setMessage(`An error occurred: ${res.statusText}`);
        }
      } catch (err) {
        setIsSubmitting(false);
        setMessage(err.response.data);
      }
    }
  };

  const handlePictureChange = (event) => {
    setSelectedPicture(event.target.files[0]);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  }, [showToast]);

  const headerTitle = "CREATE HEALTH OBJECTIVE";
  const headerSubtitle = "Create a New Health Objective";
  const buttonTitle = "Create Health Objective";

  return (
    <Box m="2vh">
      <Header title={headerTitle} subtitle={headerSubtitle} />
      <NotificationToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={healthObjectiveSchema}
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
              gap="4vh"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={
                  touched.title && (
                    <span className="error-message">{errors.title}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Heart Rate"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.heart_rate}
                name="heart_rate"
                error={!!touched.heart_rate && !!errors.heart_rate}
                helperText={
                  touched.heart_rate && (
                    <span className="error-message">{errors.heart_rate}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Temperature"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.temperature}
                name="temperature"
                error={!!touched.temperature && !!errors.temperature}
                helperText={
                  touched.temperature && (
                    <span className="error-message">{errors.temperature}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Blood Pressure"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.blood_pressure}
                name="blood_pressure"
                error={!!touched.blood_pressure && !!errors.blood_pressure}
                helperText={
                  touched.blood_pressure && (
                    <span className="error-message">
                      {errors.blood_pressure}
                    </span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={
                  touched.description && (
                    <span className="error-message">{errors.description}</span>
                  )
                }
                multiline
                rows={3}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Information URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.information_url}
                name="information_url"
                error={!!touched.information_url && !!errors.information_url}
                helperText={
                  touched.information_url && (
                    <span className="error-message">
                      {errors.information_url}
                    </span>
                  )
                }
                multiline
                rows={3}
                sx={{ gridColumn: "span 2" }}
              />

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.13)",
                  borderRadius: "1vh",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.9vh",
                    marginLeft: "1.5vh",
                    marginTop: "2vh",
                  }}
                >
                  Picture
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onBlur={handleBlur}
                  onChange={handlePictureChange}
                  name="picture"
                  style={{
                    marginLeft: "1.5vh",
                    marginBottom: "1vh",
                    marginTop: "1vh",
                    fontSize: "2vh",
                  }}
                  sx={{ gridColumn: "span 2" }}
                />
                {touched.picture && !selectedPicture && (
                  <div
                    className="error-message"
                    id="avatar-empty-error"
                    style={{ marginTop: "1vh" }}
                  >
                    <span>Please upload goal image</span>
                  </div>
                )}
              </div>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt="3vh"
            >
              {message && (
                <div className="form-group">
                  <div className={"alert alert-danger"} role="alert">
                    {message}
                  </div>
                </div>
              )}
              <div style={{ marginLeft: "auto" }}></div>
              <Button
                style={{ fontSize: "3vh" }}
                type="submit"
                color="secondary"
                variant="contained"
              >
                {isSubmitting ? <span>Loading...</span> : buttonTitle}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default HealthObjForm;
