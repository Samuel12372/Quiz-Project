import { Modal, List, Button} from 'antd';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ManageModal = ({open, onClose}) => {

    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    //useEffect to get quizzes
    useEffect(() => {
        const userId = localStorage.getItem('userId')
        //console.log(userId);
        axios.post(`http://localhost:8080/user/getQuizzes/${userId}`)
        .then((res) => {
            //console.log(res.data.quizzesId);
            //setQuizzes(res.data.quizzesId);
            getQuizzes(res.data.quizzesId)
        })
        .catch((error) => {
            console.log(error);
        });
    }, [open, setQuizzes]);

    //get multiple quizzes
    const getQuizzes = async (ids) => {
        await axios.post(`http://localhost:8080/quizzes/multiple`, {ids})
        .then((res) => {
            //console.log(res.data);
            setQuizzes(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    //handle edit quiz button
    const handleEdit = (quizId) => {
        onClose();
        navigate(`/create/${quizId}`);
    };

    //handle delete quiz button
    const handleDelete = async (quizId) => {
        await axios.delete(`http://localhost:8080/quiz/delete/${quizId}`)
        .then((res) => {
            console.log(res);
            const userId = localStorage.getItem('userId');
            removeQuizId(userId, quizId);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    //remove quiz id from user
    const removeQuizId = async (userId, quizId) => {
        await axios.post(`http://localhost:8080/user/removeQuizId/${userId}`, {quizId})
        .then((res) => {
            console.log(res);
            setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        })
        .catch((error) => {
            console.log(error);
        });
    };

    //handle host quiz button
    const handleHost = async (quizId) => {
        
        const userId = localStorage.getItem('userId'); // Get the host's user ID

        // Generate a unique quiz code
        const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase(); 
        console.log(quizCode + quizId);
        // Store hosted quiz data in the backend
        await axios.post(`http://localhost:8080/quiz/host`, {
            userId,
            quizId,
            quizCode
        }).then((res) => {
            console.log(res);
            navigate(`/view/${quizId}`, { state: { quizCode } });
            onClose();
        }).catch((error) => {
            console.log(error);
        });

        // Redirect the host to the live quiz page

        
    };

    return (
        <div className="manageModal">
            <Modal open={open} onCancel={onClose} footer={null}>
            <List
                    itemLayout="horizontal"
                    dataSource={quizzes}
                    renderItem={quiz => (
                        <List.Item
                            actions={[
                                <Button onClick={() => handleEdit(quiz._id)}>Edit</Button>,
                                <Button onClick={() => handleDelete(quiz._id)}>Delete</Button>,
                                <Button onClick={() => handleHost(quiz._id)}>Host</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={quiz.title}
                                description={quiz.description}
                            />

                        </List.Item>
                    )}
                />
            </Modal>   
        </div>
    );
};

export default ManageModal;