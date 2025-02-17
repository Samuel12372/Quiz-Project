import React, { useState } from "react";
import { Radio, Flex, Input, Form, Button } from "antd";
import axios from 'axios';
import "../../CSS/Create.css";

const MCQTemplate = () => {
    
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
  
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSubmit = () => {
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
                <Radio.Group onChange={onChange} value={value}>
                    <Form.Item name="a">
                        <div className="optionContainer">
                            <Input placeholder="Option A" />
                            <Radio value="a" />
                        </div>
                    </Form.Item>
                    <Form.Item name="b">
                        <div className="optionContainer">
                            <Input placeholder="Option B" />
                            <Radio value="b" />
                        </div>
                    </Form.Item>
                    <Form.Item name="c">
                        <div className="optionContainer">
                            <Input placeholder="Option C" />
                            <Radio value="c" />
                        </div>
                    </Form.Item>
                    <Form.Item name="d">
                        <div className="optionContainer">
                            <Input placeholder="Option D" />
                            <Radio value="d" />
                            </div>
                        </Form.Item>
                    </Radio.Group>
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