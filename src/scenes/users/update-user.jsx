import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  colors,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import apis from "../../services/api-service";
import authHeader from "../../services/auth-header";
import authService from "../../services/auth.service";
import { tokens } from "../../theme";

const genderOptions = ["Male", "Female", "Other"];

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
function getStyles(roles, role, colors) {
  return {
    color: role.indexOf(roles) === -1 ? colors.grey[100] : colors.grey[400],
  };
}
const UserUpdateForm = ({ user, handleClose, reFetch, handleCloseDefault }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    avatar: null,
    mobile: user.mobile,
    password: user.password,
  });

  // Validate whether input on each field below is empty or not
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    avatar: null,
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const [gender, setGender] = useState(user.gender || "");
  const [roles, setRoles] = useState(user.roles || []);
  const [organisation, setOrganisation] = useState(user.organisation || "");
  const [rolesOptions, setRolesOptions] = useState([]);
  const [organisationOptions, setOrganisationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const currentUser = authService.getCurrentUser();
  const [error, setError] = useState();

  const fetchRolesAndOrganisations = async () => {
    setLoading(true);
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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles and organisations:", error);
      setMessage("Error fetching roles and organisations");
      setLoading(false);
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
            setLoading(false);
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

    if (selectedRole === "admin") {
      updatedRoles = ["admin", "manager", "user"];
    } else if (selectedRole === "manager") {
      updatedRoles = ["manager", "user"];
    } else if (selectedRole === "user") {
      updatedRoles = ["user"];
    }

    console.log(updatedRoles);

    setRoles(updatedRoles);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Use the updated state value in the callback function
    setSelectedImage(selectedFile, () => {
      // Update the formData object with the selectedImage
      setFormData((prevData) => ({
        ...prevData,
        avatar: selectedFile,
      }));
    });
  };

  const onChangeOrganisation = (e) => {
    setOrganisation(e.target.value);
  };

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error message when user starts typing in the field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};
    let formIsValid = true;

    for (const field in formData) {
      if (formData[field] === "") {
        errors[field] = `${field} cannot be empty.`;
        formIsValid = false;
      } else {
        errors[field] = "";
      }
    }

    if (roles.length === 0) {
      errors.roles = "Roles is required.";
      formIsValid = false;
    }

    console.log("Password:", formData.password);
    console.log("Confirm Password:", formData.confirm_password);

    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match.";
      formIsValid = false;
    } else {
      errors.confirm_password = "";
    }

    if (!formIsValid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const edittedUser = new FormData();
    edittedUser.append("id", user.id);
    edittedUser.append("username", formData.username);
    edittedUser.append("mobile", formData.mobile);
    edittedUser.append("email", formData.email);

    if (selectedImage) {
      edittedUser.append("avatar", selectedImage);
    }

    edittedUser.append("gender", gender);
    edittedUser.append("password", formData.password);
    edittedUser.append("organisation", organisation);
    edittedUser.append("roles", roles);

    try {
      const res = await axios.put(
        currentUser.roles.includes("admin")
          ? apis.admin + "user"
          : apis.manager + "user",
        edittedUser,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedData = await reFetch();
        localStorage.setItem("users", JSON.stringify(updatedData));
        setIsSubmitting(false);
        handleClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response.data);
      console.error("Error updating user:", error);
    }
  };

  const theme = useTheme();
  const CustomColors = tokens(theme.palette.mode);

  return (
    <Dialog open={true} onClose={handleCloseDefault}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <div className="left-input">
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!formErrors.username}
                helperText={formErrors.username}
                inputProps={{
                  style: {
                    height: "4vh",
                  },
                }}
              />
            </div>
            <div className="right-input" id="avatar-upload-form">
              <h2 className="avatar-label" id="avatar-image-label">
                Avatar
              </h2>
              <input
                type="file"
                className="avatar-input-field"
                accept="image/*"
                onChange={handleImageChange}
                name="avatar"
                sx={{ gridColumn: "span 2" }}
              />
            </div>
          </div>
          <div className="field-group">
            <div className="special-left-input">
              <div className="left-left-input">
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!formErrors.mobile}
                  helperText={formErrors.mobile}
                  InputLabelProps={{
                    className: "custom-input-height",
                  }}
                  InputProps={{
                    classes: {
                      root: "mobile-input-fieldset",
                      input: "custom-input-height",
                    },
                  }}
                />
              </div>
              <div className="left-right-input">
                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => handleChangeGender(e)}
                    autoWidth
                    label="Gender"
                  >
                    <MenuItem
                      value=""
                      disabled
                      aria-required={!!formErrors.gender}
                    >
                      <em>Select a gender</em>
                    </MenuItem>
                    {genderOptions.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="special-right-input">
              <div className="right-left-input">
                {currentUser.roles.includes("admin") && (
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel>Organisation</InputLabel>
                    <Select
                      value={organisation}
                      onChange={(e) => onChangeOrganisation(e)}
                      autoWidth
                      label="Organisation"
                      required
                    >
                      <MenuItem
                        value=""
                        disabled
                        aria-required={!!formErrors.organisation}
                      >
                        <em>Select an organisation</em>
                      </MenuItem>
                      {organisationOptions.map((org) => (
                        <MenuItem key={org} value={org}>
                          {org}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
              <div className="right-right-input">
                {currentUser.roles.includes("admin") && (
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel>Roles</InputLabel>
                    <Select
                      value={roles.length > 0 ? roles[0] : ""}
                      onChange={onChangeRoles}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                      required
                    >
                      {rolesOptions
                        .filter((role) => role !== "admin")
                        .map((role) => (
                          <MenuItem
                            key={role}
                            value={role}
                            style={getStyles(role, roles, CustomColors)}
                            aria-required={!!formErrors.roles}
                          >
                            {role}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
          </div>
          <div className="field-group">
            <div className="left-input">
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </div>
            <div className="right-input">
              <TextField
                label="Confirm password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!formErrors.confirm_password}
                helperText={formErrors.confirm_password}
              />
            </div>
          </div>
          <DialogActions
            style={{
              marginTop: "4% !important",
              marginRight: "-2% !important",
            }}
          >
            <Typography
              sx={{ color: colors.deepOrange[700], fontSize: "1.6vh" }}
            >
              {message}
            </Typography>
            <Typography
              sx={{ color: colors.deepOrange[700], fontSize: "1.6vh" }}
            >
              {error}
            </Typography>
            <Button
              className="cancel-btn"
              onClick={handleCloseDefault}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Confirm changes"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateForm;
