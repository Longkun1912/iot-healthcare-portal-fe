// DeviceBox.js
import React from 'react';
import '../../css/device-box.css';
import { useTheme} from "@mui/material";
import { tokens } from '../../theme';

const DeviceBox = ({ status, latestData, deviceName, isClicked, onClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const getStatusColor = () => {
        return status === "On" ? 'green' : 'red';
    };
    const borderStyle = isClicked ? `3px solid ${colors.greenAccent[400]}` : `1px solid ${colors.grey[100]}`;

    return (
    <div className="device-box" 
        style={{
            color: colors.primary[100],
            border: borderStyle
        }}
        onClick={onClick}
    >
        <div 
            className="status-circle" 
            style={{ backgroundColor: getStatusColor() }}
        ></div>
        
        <div className="status">{status}</div>
        <div className="latest-data" style={{ color: isClicked ? colors.greenAccent[400] : colors.grey[100] }}>{latestData}</div>
        <div className="device-name">{deviceName}</div>
    </div>
    );
};

export default DeviceBox;
