import { useState, useEffect  } from "react";
import { Radio, Flex, Input, Form, Button, Space} from "antd";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../../CSS/Create.css";

const MCQTemplate = ({question, onQuestionSaved, onQuestionDeleted}) => {
    
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
                correctAnswer: question.correctAnswer
                
            });
            const correctIndex = question.options?.indexOf(question.correctAnswer);
        if (correctIndex !== -1) {
            setValue(['a', 'b', 'c', 'd'][correctIndex]); // Ensure Radio.Group gets 'a', 'b', 'c', or 'd'
        }
        }
    }, [question, form]);
    
    const options = [
        {
          label:  "Option A",
          value: 'a',
        },
        {
          label:  "Option B",
          value: 'b',
        },
        {
          label:  "Option C",
          value: 'c',
        },
        {
          label: "Option D",
          value: 'd',
        },
      ];

    const onChange = (e) => {
        const selectedLetter = e.target.value; // 'a', 'b', 'c', or 'd'
        setValue(selectedLetter);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSubmit = async() => {
        try {
            const values = await form.validateFields();
            const selectedIndex = ['a', 'b', 'c', 'd'].indexOf(value);

            const questionData = {
                questionText: values.question,
                options: [values.a, values.b, values.c, values.d],
                correctAnswer: selectedIndex !== -1 ? values[['a', 'b', 'c', 'd'][selectedIndex]] : "",
                questionType: "MCQ"
            };
            //console.log(quizId);
            

            await axios.post(`http://localhost:8080/${quizId}/question`, questionData);
            console.log("Question saved:", questionData);
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
        <div className="multipleChoiceTemplate">
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
                <div className="optionContainer">
                    <Form.Item label="Option A:" name="a" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Space.Compact>
                            <Form.Item name="a" noStyle> 
                                <Input placeholder="Option A" />
                            </Form.Item>
                            <Button type="primary">Upload Image</Button>
                        </Space.Compact>
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item label="Option B:" name="b" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Space.Compact>
                            <Form.Item name="b" noStyle> 
                                <Input placeholder="Option B" />
                            </Form.Item>
                            <Button type="primary">Upload Image</Button>
                        </Space.Compact>
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item label="Option C:" name="c" rules={[{ required: true, message: "At least 3 options required" }]}>
                        <Space.Compact>
                            <Form.Item name="c" noStyle> 
                                <Input placeholder="Option C" />
                            </Form.Item>
                            <Button type="primary">Upload Image</Button>
                        </Space.Compact>
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item label="Option D:" name="d" rules={[{ required: true, message: "At least 3 options required" }]} >
                        <Space.Compact>
                            <Form.Item name="d" noStyle> 
                                <Input placeholder="Option D" />
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

export default MCQTemplate;