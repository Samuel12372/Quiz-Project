import { Modal } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';


const ManageModal = ({open, onClose}) => {

    useEffect(() => {
        axios.get()
    }, [open]);
    return (
        <div className="manageModal">
            <Modal open={open} onCancel={onClose} footer={null}>
                <h1>Manage Quizzes</h1>
            </Modal>   
        </div>
    );
};

export default ManageModal;