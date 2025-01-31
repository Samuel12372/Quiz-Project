import React from 'react';
import { Button } from "antd";
import '../CSS/Navbar.css'; // Assuming you have some CSS for styling

const Navbar = () => {
    const handleManageClick = () => {};
    const handleCreateClick = () => {};
    const handleLogoutClick = () => {};
    
    return (
        <div className="navbar">
            <Button onClick={handleManageClick} type ="primary" id = "ManageButton">Manage Quizzes</Button>
            <Button onClick={handleCreateClick} type ="primary" id = "CreateButton">Create Quiz</Button>
            <Button onClick={handleLogoutClick} type ="primary" id = "LogoutButton">Logout</Button>
        </div>
    );
};

export default Navbar;