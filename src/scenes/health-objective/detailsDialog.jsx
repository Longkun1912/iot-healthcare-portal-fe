import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const HealthObjectiveDetails = ({
  openDialog,
  handleCloseDialog,
  selectedHealthObjectiveDetails,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <h1>Health Objective Details</h1>
      </DialogTitle>
      <DialogContent>
        {selectedHealthObjectiveDetails && (
          <div>
            <div className="top-objective-details">
              <div className="left-objective-details">
                <img
                  class="health-objective-image"
                  src={selectedHealthObjectiveDetails.image}
                  alt="Health Objective"
                />
              </div>
              <div className="right-objective-details">
                <p className="objective-intro">
                  Name: {selectedHealthObjectiveDetails.title}
                </p>
                <p className="objective-intro">
                  Heart Rate Status: {selectedHealthObjectiveDetails.heart_rate}{" "}
                  bpm
                </p>
                <p className="objective-intro">
                  Temperature Status:{" "}
                  {selectedHealthObjectiveDetails.temperature}
                  °C
                </p>
                <p className="objective-intro">
                  Blood Pressure Status:{" "}
                  {selectedHealthObjectiveDetails.blood_pressure}
                  mmHg
                </p>
              </div>
            </div>
            <div className="bottom-objective-details">
              <p className="objective-details">
                Description: {selectedHealthObjectiveDetails.description}
              </p>
              <p className="objective-details">
                More details at:{" "}
                <a
                  href={selectedHealthObjectiveDetails.information_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "yellow",
                    display: "block",
                    maxWidth: "60vh",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedHealthObjectiveDetails.information_url}
                </a>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          sx={{ color: colors.grey[100] }}
          colors="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthObjectiveDetails;
