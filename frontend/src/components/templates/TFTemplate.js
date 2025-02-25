import React, { useEffect, useState } from 'react';
import { Form, Radio, Input, Button, Flex } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../CSS/Create.css';


const TFTemplate = ({question, }) => {

    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    const { quizId } = useParams();

    useEffect(() => {
        if(question){
            console.log(question);
            form.setFieldsValue({
                question: question.questionText,
                correctAnswer: question.correctAnswer
            });
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

    const handleSubmit = async() => {};
    const handleDelete = async() => {};

    return (
        <div className="TrueFalseContainer">
            <Form id="mcqForm" form={form}>
                <div className="questionContainer">
                    <Form.Item name="question" rules={[{ required: true, message: "Please enter the question" }]}>
                        <Input placeholder="Type Question Here" />
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