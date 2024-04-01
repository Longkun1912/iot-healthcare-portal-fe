import React from "react";
import EditAddUserForm from "../components/Admin/EditAddUser/EditAddUserForm";
import {
    MDBCard,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

const EditAddUser = () => {
    return (
        <div>
            <MDBContainer fluid>
                <MDBRow className="justify-content-center align-items-center m-5">
                    <MDBCard>
                        <EditAddUserForm />
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default EditAddUser;
