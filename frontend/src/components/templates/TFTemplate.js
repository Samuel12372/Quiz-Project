import React, { useEffect, useState } from 'react';
import { Form, Radio, Input, Button, Flex, Space } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../CSS/Create.css';


const TFTemplate = ({question, onQuestionDeleted, onQuestionSaved }) => {

    const [form] = Form.useForm();
    const [value, setValue] = useState('true');
    const { quizId } = useParams();

    useEffect(() => {
        if(question){
            //console.log(question);
            form.setFieldsValue({
                question: question.questionText,
                correctAnswer: question.correctAnswer
            });
          setValue(question.correctAnswer);
        }
    }, [question, form]);

    const options = [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' }
    ];

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSubmit = async() => {
        try {
            const values = await form.validateFields();
            const questionData = {
                questionText: values.question,
                correctAnswer: value,
                questionType: "T/F"
            };
            await axios.post(`http://localhost:8080/${quizId}/question`, questionData);
            //console.log("Question saved:", questionData);
            onQuestionSaved();
        } catch (error) {
            console.error("Error saving question:", error);
        }
    };

    const handleDelete = async() => {
        try {
            await axios.delete(`http://localhost:8080/${quizId}/question/${question._id}`);
            //console.log("Question deleted:", question.id);
            onQuestionDeleted();
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    return (
        <div className="TrueFalseContainer">
            <Form id="mcqForm" form={form}>
                <div className="questionContainer">
                <Form.Item label="Question:" name="question" rules={[{ required: true, message: "Please enter the question" }]}>
                        <Space.Compact>
                            <Form.Item name="question" noStyle> 
                                <Input placeholder="Type Question Here" />
                            </Form.Item>
                            <Button type="primary">Upload Image</Button>
                        </Space.Compact>
                    </Form.Item>
                </div>
                

                 {/* Correct Answer Selection */}
                 <Form.Item>
                    <Flex vertical gap="middle">
                        <Radio.Group block options={options} onChange={onChange} value={value} optionType="button" buttonStyle="solid" />
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Flex justify="space-between">
                        <Button onClick={handleSubmit} type="primary" id="SubmitButton">
                            Save Question
                        </Button>
                        <Button onClick={handleClear} type="primary" id="ClearButton">
                            Clear
                        </Button>
                        <Button onClick={handleDelete} type="primary" id="DeleteButton">
                            Delete Question
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    );
};

export default TFTemplate;