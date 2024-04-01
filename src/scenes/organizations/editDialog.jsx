import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const initialValues = {
  name: "",
  description: "",
  address: "",
  contactNumber: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const userSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  contactNumber: yup.string().matches(phoneRegExp, "Phone number is not valid"),
  address: yup.string().required("required"),
});

const OrgUpdateForm = ({
  handleCloseDialog,
  org,
  reFetch,
  handleDefaultCloseEditDialog,
}) => {
  initialValues.name = org.name || "";
  initialValues.description = org.description || "";
  initialValues.address = org.address || "";
  initialValues.contactNumber = org.contact_number || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const isNonMobile = useMediaQuery("(min-width:60vh)");

  const handleSubmit = async (values) => {
    const organisation = {
      organisationName: values.name,
      orgnisationDescription: values.description,
      organisationAdress: values.address,
      organisationContactNumber: values.contactNumber,
    };
    console.log(organisation);

    try {
      setIsSubmitting(true);
      const url = apis.organisation + "organisation";
      const res = await axios.put(url, organisation, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        const updatedData = await reFetch();
        localStorage.setItem("organisations", JSON.stringify(updatedData));
        setIsSubmitting(false);
        setMessage("Org update successfully.");
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
    <Dialog open={true} onClose={handleDefaultCloseEditDialog}>
      <DialogTitle>Edit Org</DialogTitle>
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
                  type="text"
                  label="Mobile"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contactNumber}
                  name="contactNumber"
                  error={!!touched.contactNumber && !!errors.contactNumber}
                  helperText={touched.contactNumber && errors.contactNumber}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
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
                  onClick={handleDefaultCloseEditDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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

export default OrgUpdateForm;
