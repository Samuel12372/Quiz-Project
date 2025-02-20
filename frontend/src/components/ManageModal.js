import { Modal, List} from 'antd';
import { useState, useEffect} from 'react';
import axios from 'axios';


const ManageModal = ({open, onClose}) => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        //console.log(userId);
        axios.post(`http://localhost:8080/user/getQuizzes/${userId}`)
        .then((res) => {
            console.log(res.data.quizzesId);
            //setQuizzes(res.data.quizzesId);
            getQuizzes(res.data.quizzesId)
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const getQuizzes = async (ids) => {
        await axios.post(`http://localhost:8080/quizzes/multiple`, {ids})
        .then((res) => {
            console.log(res.data);
            setQuizzes(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className="manageModal">
            <Modal open={open} onCancel={onClose} footer={null}>
            <List
                    itemLayout="horizontal"
                    dataSource={quizzes}
                    renderItem={quiz => (
                        <List.Item>
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