import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Header from "../../components/Header";
import useFetch from "../../hooks/useFetch";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import NotificationToast from "../notification";

const initialValues = {
  name: "",
  description: "",
  address: "",
  contactNumber: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  name: yup
    .string()
    .required("This field is required")
    .max(80, "Address cannot exceed 80 characters"),
  description: yup
    .string()
    .required("This field is required")
    .max(400, "Address cannot exceed 400 characters"),
  contactNumber: yup
    .string()
    .required("This field is required")
    .matches(phoneRegExp, "Phone number is not valid"),
  address: yup
    .string()
    .required("This field is required")
    .max(100, "Address cannot exceed 100 characters"),
});

const OrgForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const url = apis.organisation + "organisation";
  const { reFetch } = useFetch(apis.organisation + "organisations");

  const isNonMobile = useMediaQuery("(min-width:60vh)");

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    const organisation = {
      organisationName: values.name,
      orgnisationDescription: values.description,
      organisationAdress: values.address,
      organisationContactNumber: values.contactNumber,
    };

    try {
      const res = await axios.post(url, organisation, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        const updatedData = await reFetch();
        localStorage.setItem("organisations", JSON.stringify(updatedData));

        setIsSubmitting(false);
        setToastMessage("Organisation created successfully");
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
  // const headerTitle = isEdit ? "EDIT ORGANISATION" : "CREATE ORGANISATION";
  const headerTitle = "CREATE ORGANISATION";
  // const headerSubtitle = isEdit ? "Edit an Existing Organisation" : "Create a New Organisation";
  const headerSubtitle = "Create a New Organisation";
  // const buttonTitle =  isEdit ? "Edit Organisation" : "Create Organisation";
  const buttonTitle = "Create Organisation";
  return (
    <Box m="2vh">
      <Header title={headerTitle} subtitle={headerSubtitle} />
      <NotificationToast
        show={showToast}
        onClose={handleCloseToast}
        message={toastMessage}
      />

      <Formik
        onSubmit={handleFormSubmit}
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
              <div style={{ marginLeft: "auto" }}>
                <Button
                  style={{ fontSize: "3vh" }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  {isSubmitting ? <span>Loading...</span> : buttonTitle}
                </Button>
              </div>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default OrgForm;
