import {Card, Modal, Button, Switch, Tabs, QRCode} from 'antd';
import { useState, useEffect } from 'react';
import { useBackground } from '../context/BackgroundContext';
import '../CSS/Modals.css';

const { TabPane } = Tabs;

const SettingsModal = ({ open, onClose }) => {

    const JoinLink = `https://quiz-project-frontend-dyul.onrender.com`;

    const { isAnimated, setIsAnimated } = useBackground();

    const handleToggle = (checked) => {
        setIsAnimated(checked);
    };

    return (
        <Modal
            className='settingsModal'
            title="Settings"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="General" key="1">
                    <Card>
                        <p>Toggle Background Animation:</p>
                        <Switch
                            checked={isAnimated}
                            onChange={handleToggle}
                            checkedChildren="Animated"
                            unCheckedChildren="Static"
                        />
                    </Card>
                </TabPane>
                <TabPane tab="QR Code" key="2">
                    <Card>
                        <h2>CodeClash QR Code</h2>
                        <div className='qrCodeDiv'>
                            <QRCode value={JoinLink} size={200} className="QR" fgColor="#000000" bgColor="#ffffff" />
                        </div>
                    </Card>
                </TabPane>
                <TabPane tab="Survey Link" key="3">
                    <Card>
                        
                        <h2><a href="https://docs.google.com/forms/d/e/1FAIpQLSfQswvW0NCwFeJdJb_z4gQvaQ9OZ0rMxHFRb_m9lkN5E5cKlw/viewform?usp=dialog">Google form link</a></h2>
                        
                    </Card>
                </TabPane>
            </Tabs>
        </Modal>
    );

};

export default SettingsModal;