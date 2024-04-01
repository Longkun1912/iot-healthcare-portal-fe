import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const UserDetails = ({
  openDialog,
  handleCloseDialog,
  selectedUserDetails,
}) => {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <h1 class="title">User Details</h1>
      </DialogTitle>
      <DialogContent>
        {selectedUserDetails && (
          <div class="user-details">
            <div class="avatar">
              <img
                class="user-avatar"
                src={selectedUserDetails.avatar}
                alt="User Avatar"
              />
              <p class="username">{selectedUserDetails.username}</p>
            </div>
            <div class="other-info">
              <p class="user-info">UID: {selectedUserDetails.id}</p>
              <p class="user-info">Email: {selectedUserDetails.email}</p>
              <p class="user-info">Mobile: {selectedUserDetails.mobile}</p>
              <p class="user-info">Gender: {selectedUserDetails.gender}</p>
              <p class="user-info">
                Organisation: {selectedUserDetails.organisation}
              </p>
              <p class="user-info">
                Roles:{" "}
                {selectedUserDetails.roles.map((role, index) => (
                  <span key={index}>
                    {role}
                    {index !== selectedUserDetails.roles.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p class="user-info">
                Last updated: {selectedUserDetails.last_updated}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          className="view-health-details"
          onClick={handleCloseDialog}
          colors="primary"
        >
          View health status
        </Button>
        <Button
          className="close-details-dialog"
          onClick={handleCloseDialog}
          colors="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetails;
