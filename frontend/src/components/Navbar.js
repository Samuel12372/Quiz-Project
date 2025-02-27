import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "antd";
import '../CSS/Navbar.css'; 
import Login from './Login';
import CreateModal from './CreateModal';
import ManageModal from './ManageModal';
import Leaderboard from './Leaderboard';


const Navbar = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //state to toggle login modal
    const [isModalopen, setIsModalopen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isManageModalopen, setIsManageModalopen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    //leaderboard button click
    const handleLeaderboardClick = () => {
        setIsLeaderboardModalOpen(true);
    };

    //close leaderboard modal
    const closeLeaderboardModal = () => {
        setIsLeaderboardModalOpen(false);
    };

    //login button click
    const handleLoginClick = () => {
        setIsModalopen(true); 
    };
    //close login modal
    const closeModal = () => {
        setIsModalopen(false);
    };
    //login success
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setIsModalopen(false);
    };
    //manage button click
    const handleManageClick = () => {
        setIsManageModalopen(true);
    };
    //close manage modal
    const closeManageModal = () => {
        setIsManageModalopen(false);   
    };
    //create button click
    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };
    //close create modal
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };
    //logout button click
    const handleLogoutClick = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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
                    <Button onClick={handleManageClick} type="primary" id="ManageButton" className="navbar-button">Manage Quizzes</Button>
                    <Button onClick={handleCreateClick} type="primary" id="CreateButton" className="navbar-button">Create Quiz</Button>
                    <Button onClick={handleLogoutClick} type="primary" id="LogoutButton" className="navbar-button">Logout</Button>
                    <Button onClick={handleLeaderboardClick} type="primary" id="LeaderboardButton" className="navbar-button">Leaderboard</Button>
                    {isCreateModalOpen && <CreateModal open={isCreateModalOpen} onClose={closeCreateModal} />}
                    {isManageModalopen && <ManageModal open={isManageModalopen} onClose={closeManageModal}/>}
                    {isLeaderboardModalOpen && <Leaderboard open={isLeaderboardModalOpen} onClose={closeLeaderboardModal}/>}

                </>
            )}
        </div>
    );
};

export default Navbar;