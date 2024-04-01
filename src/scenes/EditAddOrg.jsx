import React from "react";
import EditAddOrgForm from "../components/Admin/EditAddOrg/EditAddOrgForm";
import {
    MDBCard,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

const EditAddOrg = () => {
    return (
        <div>
            <MDBContainer fluid>
                <MDBRow className="justify-content-center align-items-center m-5">
                    <MDBCard>
                        <EditAddOrgForm />
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default EditAddOrg;
