import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
import axios from 'axios';
import '../CSS/Navbar.css';
import BASE_URL from "../context/quizContext.js";


const Login = ({ open, onClose, onSuccess }) => {

    // State to toggle between login and register form
    const [isRegister, setIsRegister] = useState(false);
    // State to set the form name
    const [formName, setFormName] = useState('Login');
    // State to store error message
    const [errorMessage, setErrorMessage] = useState('');
    //success message
    const [successMessage, setSuccessMessage] = useState('');
    // Form instance
    const [form] = Form.useForm();

    
    // Function to toggle between login and register form
    const toggleFormType = () => {
        setFormName(isRegister ? 'Login' : 'Register');
        setIsRegister(!isRegister);
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Function to handle modal close
    const handleClose = () => {
        form.resetFields();
        setErrorMessage('');
        setSuccessMessage('');
        setIsRegister(false);
        onClose();
    };

    // Function to handle form submission
    const handleFormSubmit = (values) => {
        if (isRegister) {
            axios.post(`${BASE_URL}/user/register`, values)
            .then((res) => {
                console.log(res);
                setErrorMessage('');
                setSuccessMessage('Registration successful! You can now log in.');
                setIsRegister(false);
            })
            .catch((error) => {
                console.log(error);
                setSuccessMessage('');
                setErrorMessage('Registration failed. Please try again.');
            });

        } else {
            axios.post(`${BASE_URL}/user/login`, values)
            .then((res) => {
                //console.log(res);
                if (res.status === 200) {
                    console.log(res.data.userId);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('token', res.data.token); // Store the token
                    onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage('Login failed. Please check your credentials and try again.');
            });
        }
    };


    return (
        <div >
           <Modal
           className="login"
            title={formName}
            open={open}
            onCancel={handleClose}
            footer={null}
            >
                <Form  form={form} onFinish={handleFormSubmit}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your username!',
                            },
                        ]}
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* Display email field only for registration */}
                    
                    {isRegister && (
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                required: true,
                                message: 'Email is required!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="text" onClick={toggleFormType}>
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </Button>
                    </Form.Item>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" id="LoginButton">
                            {isRegister ? 'Register' : 'Login'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Login;