import {Card, Modal, Button, Switch, Tabs} from 'antd';
import { useState, useEffect } from 'react';
import { useBackground } from '../context/BackgroundContext';
import '../CSS/Modals.css';

const { TabPane } = Tabs;

const SettingsModal = ({ open, onClose }) => {
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
                <TabPane tab="About Us" key="2">
                    <Card>
                        <h2>About Us</h2>
                        
                    </Card>
                </TabPane>
            </Tabs>
        </Modal>
    );

};

export default SettingsModal;