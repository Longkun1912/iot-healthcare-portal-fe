import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const HealthRecommendationDetails = ({
  openDialog,
  handleCloseDialog,
  selectedHealthRecommendationDetails,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        <h1>Health Recommendation Details</h1>
      </DialogTitle>
      <DialogContent>
        {selectedHealthRecommendationDetails && (
          <div>
            <div>
              <p>Name: {selectedHealthRecommendationDetails.name}</p>
              <p>
                Heart Rate Impact:{" "}
                {selectedHealthRecommendationDetails.heartRateImpact + " %"}
              </p>
              <p>
                Temperature Impact:{" "}
                {selectedHealthRecommendationDetails.temperature_impact}
              </p>
              <p>
                Blood Pressure Impact:{" "}
                {selectedHealthRecommendationDetails.bloodPressureImpact}
              </p>
              <p>
                Description: {selectedHealthRecommendationDetails.description}
              </p>
              <p>
                Guide Link:{" "}
                <a
                  href={selectedHealthRecommendationDetails.guide_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "yellow" }}
                >
                  {selectedHealthRecommendationDetails.guide_link}
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

export default HealthRecommendationDetails;
