import { useState, useEffect  } from "react";
import { Radio, Flex, Input, Form, Button } from "antd";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../../CSS/Create.css";

const MCQTemplate = ({question, onQuestionSaved}) => {
    
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    const { quizId } = useParams();
    
    useEffect(() => {
        if(question){
            form.setFieldsValue({
                question: question.questionText,
                a: question.options?.[0] || "",
                b: question.options?.[1] || "",
                c: question.options?.[2] || "",
                d: question.options?.[3] || "",
            });
        }
    }, [question, form]);
    


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
                options: [values.a, values.b, values.c, values.d],
                correctAnswer: value,
                questionType: "MCQ"
            };
            console.log(quizId);

            await axios.post(`http://localhost:8080/${quizId}/question`, questionData);
            console.log("Question saved:", questionData);
            onQuestionSaved();
        } catch (error) {
            console.error("Error saving question:", error);
        }
    };

    return (
        <div className="multipleChoiceTemplate">
            <Form id="mcqForm" form={form}>
                <Form.Item name="question" rules={[{ required: true, message: "Please enter the question" }]}>
                    <Input placeholder="Type Question Here" />
                </Form.Item>

                <div className="optionContainer">
                    <Form.Item name="a" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Input placeholder="Option A" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="b" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Input placeholder="Option B" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="c" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Input placeholder="Option C" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="d" >
                        <Input placeholder="Option D" />
                    </Form.Item>
                </div>

                {/* Correct Answer Selection */}
                <Form.Item name="correctAnswer">
                    <Radio.Group onChange={onChange} value={value}>
                        <Flex vertical gap="small">
                            <Radio value="a">A</Radio>
                            <Radio value="b">B</Radio>
                            <Radio value="c">C</Radio>
                            <Radio value="d">D</Radio>
                        </Flex>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Flex justify="space-between">
                        <Button onClick={handleSubmit} type="primary" id="SubmitButton">
                            Save Question
                        </Button>
                        <Button onClick={handleClear} type="primary" id="ClearButton">
                            Clear
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    );
};

export default MCQTemplate;