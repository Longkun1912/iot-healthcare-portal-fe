import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  colors,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";

const healthStatusOptions = ["Stable", "Decrease", "Increase"];

const initialValues = {
  name: "",
  heart_rate_impact: "",
  blood_pressure_impact: "",
  temperature_impact: "",
  description: "",
  guide_link: "",
};

const userSchema = yup.object().shape({
  name: yup.string().required("This field is required"),
  heart_rate_impact: yup.string().required("This field is required"),
  blood_pressure_impact: yup.string().required("This field is required"),
  temperature_impact: yup.string().required("This field is required"),
  description: yup.string().required("This field is required"),
  guide_link: yup.string().required("This field is required"),
});

const HealthRecommendationUpdateForm = ({
  handleCloseDialog,
  handleCloseDefaultDialog,
  healthRecommendation,
  reFetch,
}) => {
  initialValues.name = healthRecommendation.name || "";
  initialValues.heart_rate_impact =
    healthRecommendation.heart_rate_impact || "";
  initialValues.blood_pressure_impact =
    healthRecommendation.blood_pressure_impact || "";
  initialValues.temperature_impact =
    healthRecommendation.temperature_impact || "";
  initialValues.description = healthRecommendation.description || "";
  initialValues.guide_link = healthRecommendation.guide_link || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const isNonMobile = useMediaQuery("(min-width:60vh)");

  const handleSubmit = async (values) => {
    const health_recommendation = {
      id: healthRecommendation.id,
      name: values.name,
      heart_rate_impact: values.heart_rate_impact,
      blood_pressure_impact: values.blood_pressure_impact,
      temperature_impact: values.temperature_impact,
      description: values.description,
      guide_link: values.guide_link,
    };
    console.log(health_recommendation);

    try {
      setIsSubmitting(true);
      const url = apis.healthRecommendationManagement + "health_recommendation";
      const res = await axios.put(url, health_recommendation, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        const updatedData = await reFetch();
        localStorage.setItem(
          "health_recommendations",
          JSON.stringify(updatedData)
        );

        setIsSubmitting(false);

        setMessage("Health Recommendation update successfully.");
        handleCloseDialog();
      } else {
        setIsSubmitting(false);
        setMessage(`An error occurred: ${res.data}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      setMessage(error.response.data);
    }
  };

  return (
    <Dialog open={true} onClose={handleCloseDefaultDialog}>
      <DialogTitle>Edit Health Recommendation</DialogTitle>
      <DialogContent>
        <Formik
          onSubmit={handleSubmit}
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
                gap="4vh"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
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
                  helperText={touched.name && errors.name}
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
                    touched.blood_pressure_impact &&
                    errors.blood_pressure_impact
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
                    touched.temperature_impact && errors.temperature_impact
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
                  helperText={touched.guide_link && errors.guide_link}
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
                  helperText={touched.description && errors.description}
                  multiline
                  rows={3}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>

              <DialogActions>
                <Typography
                  sx={{ color: colors.deepOrange[700], fontSize: "1.6vh" }}
                >
                  {message}
                </Typography>
                <Button
                  className="cancel-btn"
                  onClick={handleCloseDefaultDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span>Loading...</span> : "Edit"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecommendationUpdateForm;
