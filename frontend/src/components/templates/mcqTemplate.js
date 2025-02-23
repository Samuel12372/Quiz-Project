import { useState, useEffect  } from "react";
import { Radio, Flex, Input, Form, Button } from "antd";
import axios from 'axios';
import "../../CSS/Create.css";

const MCQTemplate = ({question}) => {
    
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    
    useEffect(() => {
        if(question){
            console.log(question);
            console.log(question.options);
            form.setFieldsValue({
                question: question.questionText,
                a: question.options[0],
                b: question.options[1],
                c: question.options[2],
                d: question.options[3],
            });
        }
    }, [question]);


    const onChange = (e) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSubmit = async() => {
        //axios call to save the question to the database
        //save to quizzes collection 
        //
        //get quiz id
        //get current user id 
        //save to users Quizzes id 
    };

    return (
        <div className="multipleChoiceTemplate">
            <Form id="mcqForm" form={form}>
                
                <Form.Item name="question"><Input placeholder="Type Question Here" /></Form.Item>
                <div className="optionContainer">
                    <Form.Item name="a">
                        <Input placeholder="Option A" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="b">
                        <Input placeholder="Option B" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="c">
                        <Input placeholder="Option C" />
                    </Form.Item>
                </div>
                <div className="optionContainer">
                    <Form.Item name="d">
                        <Input placeholder="Option D" />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Flex justify="space-between">
                        <Button onClick={handleSubmit} type="primary" id="SubmitButton">Save Question</Button>
                        <Button onClick={handleClear} type="primary" id="ClearButton">Clear</Button>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    );
};

export default MCQTemplate;