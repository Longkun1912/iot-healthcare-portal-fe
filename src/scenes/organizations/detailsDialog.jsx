import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const OrgDetails = ({
    openDialog,
    handleCloseDialog,
    selectedOrgDetails,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>
        <h1>Organisation Details</h1>
    </DialogTitle>
    <DialogContent>
        {selectedOrgDetails && (
        <div >
            <div >
            <p>ID: {selectedOrgDetails.id}</p>
            <p >Name: {selectedOrgDetails.name}</p>
            <p >Address: {selectedOrgDetails.address}</p>
            <p >Mobile: {selectedOrgDetails.contact_number}</p>
            <p >Description: {selectedOrgDetails.description}</p>
            {/* <p >
                Last updated: {selectedOrgDetails.last_updated}
            </p> */}
            </div>
        </div>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} sx={{ color: colors.grey[100] }}  colors="primary">
            Close
        </Button>
    </DialogActions>
    </Dialog>
);
};

export default OrgDetails;
  