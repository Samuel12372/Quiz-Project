import React from 'react';
import { useState } from 'react';
import { Button } from "antd";
import '../CSS/Navbar.css'; 
import Login from './Login';
import CreateModal from './CreateModal';


const Navbar = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalopen, setIsModalopen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsModalopen(true); 
    };
    
    const closeModal = () => {
        setIsModalopen(false);
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsModalopen(false);
    };

    const handleManageClick = () => {};

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleLogoutClick = () => {
        setIsLoggedIn(false);
    };
    
    return (
        <div className="navbar">
            {!isLoggedIn ? (
                <>
                <Button onClick={handleLoginClick} type="primary" id="LoginButton">Login</Button>
                <Login open={isModalopen} onClose={closeModal} onSuccess={handleLoginSuccess}/>
                </>
            ) : (
                <>
                    <Button onClick={handleManageClick} type="primary" id="ManageButton">Manage Quizzes</Button>
                    <Button onClick={handleCreateClick} type="primary" id="CreateButton">Create Quiz</Button>
                    <Button onClick={handleLogoutClick} type="primary" id="LogoutButton">Logout</Button>
                    {isCreateModalOpen && <CreateModal open={isCreateModalOpen} onClose={closeCreateModal} />}
                </>
            )}
        </div>
    );
};

export default Navbar;