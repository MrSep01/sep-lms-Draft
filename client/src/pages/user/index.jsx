import React from 'react';
import UserNav from '../../components/RoleNav/UserNav'; // Adjust the path according to your file structure
import Auth from '../../utils/auth'; // Adjust the path to your auth utility

const UserIndex = () => {
    if (!Auth.loggedIn()) {
        // Optionally, handle the unauthorized access here
        // For example, redirect to login page or display a message
        return <div>Access Denied. Please log in.</div>;
    }

    return (

    <div className= "container-fluid" >
        <div className = "row">
            <div className = "col-md-2">
                <UserNav />
            </div>
            <div className = "col-md-10">
                <h1 className="jumbotron text-center square">User Dashboard</h1>
            </div>


        </div>
        
    </div>
    );
}
export default UserIndex;

