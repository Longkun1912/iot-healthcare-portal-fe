import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Header from "../../components/Header";
import "../../css/health-recommendation-form.css";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import NotificationToast from "../notification";

const healthStatusOptions = ["Stable", "Decrease", "Increase"];

const initialValues = {
  name: "",
  heart_rate_impact: "",
  blood_pressure_impact: "",
  temperature_impact: "",
  description: "",
  guide_link: "",
};

const healthRecommendationSchema = yup.object().shape({
  name: yup.string().required("This field cannot be empty"),
  heart_rate_impact: yup.string().required("This field cannot be empty"),
  blood_pressure_impact: yup.string().required("This field cannot be empty"),
  temperature_impact: yup.string().required("This field cannot be empty"),
  description: yup.string().required("This field cannot be empty"),
  guide_link: yup.string().required("This field cannot be empty"),
});

const HealthRecForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const url = apis.healthRecommendationManagement + "health_recommendation";

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    const health_recommendation = {
      name: values.name,
      heart_rate_impact: values.heart_rate_impact,
      blood_pressure_impact: values.blood_pressure_impact,
      temperature_impact: values.temperature_impact,
      description: values.description,
      guide_link: values.guide_link,
    };

    try {
      const res = await axios.post(url, health_recommendation, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        setIsSubmitting(false);
        setToastMessage("Health Recommendation added successfully.");
        setShowToast(true);
      } else {
        setIsSubmitting(false);
        setMessage(`An error occurred: ${res.statusText}`);
      }
    } catch (err) {
      setIsSubmitting(false);
      setMessage(err.response.data);
    }
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  }, [showToast]);

  const headerTitle = "CREATE HEALTH RECOMMENDATION";
  const headerSubtitle = "Create a New Health Recommendation";
  const buttonTitle = "Create Health Recommendation";

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
        validationSchema={healthRecommendationSchema}
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
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={
                  touched.name && (
                    <span className="error-message">{errors.name}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                select
                label="Heart Rate Impact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.heart_rate_impact}
                name="heart_rate_impact"
                error={
                  !!touched.heart_rate_impact && !!errors.heart_rate_impact
                }
                helperText={
                  touched.heart_rate_impact && (
                    <span className="error-message">
                      {errors.heart_rate_impact}
                    </span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              >
                {healthStatusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                select
                label="Temperature Impact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.temperature_impact}
                name="temperature_impact"
                error={
                  !!touched.temperature_impact && !!errors.temperature_impact
                }
                helperText={
                  touched.temperature_impact && (
                    <span className="error-message">
                      {errors.temperature_impact}
                    </span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              >
                {healthStatusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                select
                label="Blood Pressure Impact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.blood_pressure_impact}
                name="blood_pressure_impact"
                error={
                  !!touched.blood_pressure_impact &&
                  !!errors.blood_pressure_impact
                }
                helperText={
                  touched.blood_pressure_impact && (
                    <span className="error-message">
                      {errors.blood_pressure_impact}
                    </span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
              >
                {healthStatusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Guide Link"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.guide_link}
                name="guide_link"
                error={!!touched.guide_link && !!errors.guide_link}
                helperText={
                  touched.guide_link && (
                    <span className="error-message">{errors.guide_link}</span>
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
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt="3vh"
            >
              <Typography
                sx={{ color: colors.deepOrange[700], fontSize: "1.6vh" }}
              >
                {message}
              </Typography>
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

export default HealthRecForm;
