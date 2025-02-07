import React from 'react';
import { useState } from 'react';
import { Button } from "antd";
import '../CSS/Navbar.css'; 
import Login from './Login';


const Navbar = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalopen, setIsModalopen] = useState(false);

    const handleLoginClick = () => {
        setIsModalopen(true); 
    };
    const closeModal = () => {
        setIsModalopen(false);
    };

    const handleManageClick = () => {};
    const handleCreateClick = () => {};
    const handleLogoutClick = () => {
        setIsLoggedIn(false);
    };
    
    return (
        <div className="navbar">
            {!isLoggedIn ? (
                <>
                <Button onClick={handleLoginClick} type="primary" id="LoginButton">Login</Button>
                <Login open={isModalopen} onClose={closeModal}/>
                </>
            ) : (
                <>
                    <Button onClick={handleManageClick} type="primary" id="ManageButton">Manage Quizzes</Button>
                    <Button onClick={handleCreateClick} type="primary" id="CreateButton">Create Quiz</Button>
                    <Button onClick={handleLogoutClick} type="primary" id="LogoutButton">Logout</Button>
                </>
            )}
        </div>
    );
};

export default Navbar;