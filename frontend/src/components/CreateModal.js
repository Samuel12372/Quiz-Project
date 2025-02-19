import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/Modals.css';

const CreateModal = ({ open, onClose }) => {

    const [form] = Form.useForm();
    const navigate = useNavigate();


    const handleFormSubmit = (values) => {
        
        axios.post('http://localhost:8080/quiz/create', values)
        .then((res) => {
            //console.log(res);
            const quizId = res.data._id;
            //console.log(quizId);
            axios.post('')
            navigate(`/create/${quizId}`);
        })
        .catch((error) => {
            console.log(error);
        });

        //console.log('Form Submitted:', values);
        form.resetFields();
        onClose();
    };
    
    const handleCancel = () => {
        form.resetFields();
    };


    return(
        <div className="createModal">
            <Modal title="Create Quiz" open={open} onCancel={onClose} footer={null} >
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