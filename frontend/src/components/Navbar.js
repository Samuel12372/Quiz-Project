import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "antd";
import { SettingOutlined } from '@ant-design/icons';
import '../CSS/Navbar.css'; 
import Login from './Login';
import CreateModal from './CreateModal';
import ManageModal from './ManageModal';
import Leaderboard from './Leaderboard';
import SettingsModal from './SettingsModal';



const Navbar = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //state to toggle login modal
    const [isModalopen, setIsModalopen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isManageModalopen, setIsManageModalopen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);



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
    //settings button click
    const handleSettingsClick = () => {
        setIsSettingsModalOpen(true);
    };
    //close settings modal
    const closeSettingsModal = () => {
        setIsSettingsModalOpen(false);
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

                </>
            )}
            <Button onClick={handleLeaderboardClick} type="primary" id="LeaderboardButton" className="navbar-button">Leaderboard</Button>
            <Button onClick={handleSettingsClick} type="primary" id="SettingsButton" className="navbar-button" icon={<SettingOutlined />}></Button>
            {isCreateModalOpen && <CreateModal open={isCreateModalOpen} onClose={closeCreateModal} />}
            {isManageModalopen && <ManageModal open={isManageModalopen} onClose={closeManageModal}/>}
            {isLeaderboardModalOpen && <Leaderboard open={isLeaderboardModalOpen} onClose={closeLeaderboardModal}/>}
            {isSettingsModalOpen && <SettingsModal open={isSettingsModalOpen} onClose={closeSettingsModal}/>}
        </div>
    );
};

export default Navbar;