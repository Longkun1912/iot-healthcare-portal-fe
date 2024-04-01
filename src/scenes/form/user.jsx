import { Box, Button, MenuItem, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import Header from "../../components/Header";
import "../../css/account-form.css";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import authService from "../../services/auth.service";
import NotificationToast from "../notification";

const genderOptions = ["Male", "Female", "Other"];

const initialValues = {
  username: "",
  avatar: null,
  email: "",
  mobile: "",
  password: "",
  confirm_password: "",
  gender: "",
  roles: [],
  organisation: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  username: yup.string().required("This field must not be empty"),
  email: yup
    .string()
    .email("Invalid email")
    .required("This field must not be empty"),
  mobile: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("This field must not be empty"),
  password: yup.string().required("This field must not be empty"),
  confirm_password: yup
    .string()
    .required("This field must not be empty")
    .oneOf([yup.ref("password"), null], "Confirm password does not match"),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UserForm = () => {
  const currentUser = authService.getCurrentUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [genderMessage, setGenderMesage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState(["user"]);
  const [organisation, setOrganisation] = useState(currentUser.organisation);
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

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [baseurl, setBaseUrl] = useState("");

  useEffect(() => {
    if (currentUser.roles.includes("admin")) {
      setBaseUrl(apis.admin);
    } else if (currentUser.roles.includes("manager")) {
      setBaseUrl(apis.manager);
    }
  }, [currentUser.roles]);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    if (!gender) {
      setGenderMesage("Please select a gender");
      setIsSubmitting(false);
      return;
    }
    if (!organisation) {
      setMessage("Please select an organisation");
      setIsSubmitting(false);
      return;
    }
    if (roles.length === 0) {
      setMessage("Please select a role");
      setIsSubmitting(false);
      return;
    }

    if (!selectedImage) {
      setMessage("Please upload an avatar");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("avatar", selectedImage);
    formData.append("email", values.email);
    formData.append("mobile", values.mobile);
    formData.append("gender", gender);
    if (values.password) {
      formData.append("password", values.password);
    }
    if (values.confirm_password) {
      formData.append("confirm_password", values.confirm_password);
    }
    formData.append("roles", roles);
    formData.append("organisation", organisation);

    const url = baseurl + "user";

    try {
      const res = await axios.post(url, formData, {
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        setToastMessage("User added successfully");
        setIsSubmitting(false);
        setShowToast(true);
      }
    } catch (err) {
      setMessage(err.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [rolesOptions, setRolesOptions] = useState([]);
  const [organisationOptions, setOrganisationOptions] = useState([]);

  const fetchRolesAndOrganisations = async () => {
    try {
      const rolesResponse = await axios.get(apis.admin + "roles", {
        headers: authHeader(),
        withCredentials: true,
      });
      const organisationsResponse = await axios.get(
        apis.organisation + "organisations"
      );

      const orgOptions = organisationsResponse.data.map((org) => org.name);
      const rolesOpts = rolesResponse.data.map((role) => role.roleName);

      setOrganisationOptions(orgOptions);
      localStorage.setItem(
        "organisations",
        JSON.stringify(organisationsResponse.data)
      );

      setRolesOptions(rolesOpts);
      localStorage.setItem("roles", JSON.stringify(rolesOpts));
    } catch (error) {
      console.error("Error fetching roles and organisations:", error);
      setMessage("Error fetching roles and organisations");
    }
  };

  useEffect(() => {
    if (currentUser.roles.includes("admin")) {
      const initializeData = async () => {
        const orgLocal = localStorage.getItem("organisations");
        const roleLocal = localStorage.getItem("roles");

        try {
          if (
            orgLocal &&
            JSON.parse(orgLocal).length !== 0 &&
            roleLocal &&
            JSON.parse(roleLocal).length !== 0
          ) {
            const orgOptions = JSON.parse(
              localStorage.getItem("organisations")
            ).map((org) => org.name);
            setOrganisationOptions(orgOptions);
            setRolesOptions(JSON.parse(localStorage.getItem("roles")));
          } else {
            await fetchRolesAndOrganisations();
          }
        } catch (error) {
          console.error("Error initializing data:", error);
          setMessage("Error initializing data");
        }
      };
      initializeData();
    }
  }, []);

  const onChangeRoles = (event) => {
    const selectedRole = event.target.value;
    let updatedRoles = [];

    if (selectedRole === "manager") {
      updatedRoles = ["manager", "user"];
    } else if (selectedRole === "user") {
      updatedRoles = ["user"];
    }
    setRoles(updatedRoles);
  };

  const onChangeOrganisation = (e) => {
    setOrganisation(e.target.value);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
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

  return (
    <Box m="20px">
      <div>
        <Header title="CREATE USER" subtitle="Create a New User Account" />
        <NotificationToast
          show={showToast}
          onClose={handleCloseToast}
          message={toastMessage}
        />
      </div>

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
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="User Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={
                  touched.username && (
                    <span className="validation-error">{errors.username}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={
                  touched.email && (
                    <span className="validation-error">{errors.email}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
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
              <div className="avatar-upload-form">
                <h2 className="avatar-label">Avatar</h2>
                <input
                  type="file"
                  className="avatar-input"
                  accept="image/*"
                  onBlur={handleBlur}
                  onChange={handleImageChange}
                  name="avatar"
                  sx={{ gridColumn: "span 2" }}
                />
                {touched.avatar && !selectedImage && (
                  <div className="error-message" id="avatar-empty-error">
                    <span>Please upload an avatar</span>
                  </div>
                )}
              </div>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mobile"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mobile}
                name="mobile"
                error={!!touched.mobile && !!errors.mobile}
                helperText={
                  touched.mobile && (
                    <span className="validation-error">{errors.mobile}</span>
                  )
                }
                sx={{ gridColumn: "span 2", marginLeft: "42vh !important" }}
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
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={
                  touched.password && (
                    <span className="validation-error">{errors.password}</span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
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
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirm_password}
                name="confirm_password"
                error={!!touched.confirm_password && !!errors.confirm_password}
                helperText={
                  touched.confirm_password && (
                    <span className="validation-error">
                      {errors.confirm_password}
                    </span>
                  )
                }
                sx={{ gridColumn: "span 2" }}
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

              <div className="selection-inputs">
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Gender"
                  onBlur={handleBlur}
                  onChange={onChangeGender}
                  value={gender}
                  name="gender"
                  error={!!touched.gender && !gender}
                  helperText={
                    touched.gender &&
                    !gender && (
                      <span className="error-message">{genderMessage}</span>
                    )
                  }
                  sx={{ gridColumn: "span 2", width: "30vh" }}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                {currentUser.roles.includes("admin") && (
                  <>
                    <TextField
                      fullWidth
                      variant="filled"
                      select
                      label="Organisation"
                      onBlur={handleBlur}
                      onChange={(e) => onChangeOrganisation(e)}
                      value={organisation}
                      name="organisation"
                      sx={{ minWidth: 80, marginLeft: "5vh", width: "30vh" }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select an organisation</em>
                      </MenuItem>
                      {organisationOptions.map((org) => (
                        <MenuItem key={org} value={org}>
                          {org}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      variant="filled"
                      select
                      label="Roles"
                      onBlur={handleBlur}
                      onChange={onChangeRoles}
                      value={roles.length > 0 ? roles[0] : ""}
                      name="roles"
                      sx={{ minWidth: 80, marginLeft: "5vh", width: "30vh" }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select a role</em>
                      </MenuItem>
                      {rolesOptions.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
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
              <div style={{ marginLeft: "auto" }}>
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  id="create-user-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span>Loading...</span> : "Create New User"}
                </Button>
              </div>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserForm;
