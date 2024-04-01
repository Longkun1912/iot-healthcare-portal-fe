import React, { useState } from 'react';
import { Button, useTheme, DialogTitle, DialogContent, DialogActions, Dialog } from "@mui/material";
import { tokens } from "../theme";

const CustomDialog = ({ open, handleClose, handleConfirm, title, description }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [loading, setLoading] = useState(false);

    const loadingConfirm = async () => {
        try {
            setLoading(true);

            await handleConfirm();

            setLoading(false);

        } catch (error) {
            console.error("An error occurred:", error);
            setLoading(false);
        }
    };
    const styles = {
        overflow: 'hidden',
        scrollbarWidth: 'none', // For Firefox
        msOverflowStyle: 'none' // For Internet Explorer and Edge
    };

    return (
        <Dialog open={open} onClose={handleClose} style={styles}>
            <DialogTitle color={colors.grey[100]}><h2>{title}</h2></DialogTitle>
            <DialogContent color={colors.grey[100]} >
                <p>{description}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ color: colors.grey[100] }} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={loadingConfirm} sx={{ color: colors.grey[100] }} disabled={loading}>
                    {loading ? "Loading..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog ;
