import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/Modals.css';
import BASE_URL from "../context/quizContext";

const CreateModal = ({ open, onClose }) => {

    const [form] = Form.useForm();
    const navigate = useNavigate();


    const handleFormSubmit = async (values) => {
        
        await axios.post(`${BASE_URL}/quiz/create`, values)
        .then((res) => {
            //console.log(res);
            const quizzesId = res.data._id;
            const userId = localStorage.getItem('userId'); 
            console.log(userId);
            
            if (userId) {
                addQuizId(userId, quizzesId);
                navigate(`/create/${quizzesId}`);
            } else {
                console.error('User ID is not defined');
            }
        })
        .catch((error) => {
            console.log(error);
        });

        //console.log('Form Submitted:', values);
        form.resetFields();
        onClose();
    };

    const addQuizId = async(userId, quizzesId) => {
       
       await axios.post(`${BASE_URL}/user/addQuizId/${userId}`, {quizzesId})
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    const handleCancel = () => {
        form.resetFields();
    };


    return(
        <div >
            <Modal className="createModal" title="Create Quiz" open={open} onCancel={onClose} footer={null} >
                <Form
                    form={form}
                    name="create"
                    onFinish={handleFormSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        label="Quiz Name"
                        name="title"
                        rules={[{ required: true, message: 'Please input the quiz name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Quiz Description"
                        name="description"
                        rules={[{ required: true , message: 'Please input the quiz description!', }]} 
                        //change this later so you dont have to input description
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <div className="buttonContainer">
                            <Button type="primary" htmlType="submit" id="SubmitButton">Submit</Button>
                            <Button type="primary" onClick={handleCancel} id="ClearButton">Clear</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}; 


export default CreateModal;