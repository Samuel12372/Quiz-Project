import { Button, Card, Dropdown, Space, Menu, Radio, Flex } from "antd";
import { useParams } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import axios from "axios";

import "../CSS/Create.css";

import MCQTemplate from "../components/templates/mcqTemplate";
import TFTemplate from "../components/templates/TFTemplate";

function CreatePage() {

  const { quizId } = useParams();
  const [slides, setSlides] = useState([{ content: "Choose Template" }]);
  const[currentSlide, setCurrentSlide] = useState(0)
  const [selectedQuestionType, setSelectedQuestionType] = useState("Question Type");
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionSaved, setQuestionSaved] = useState(false);

  useEffect(() => {
    
    const fetchQuiz = async () => {
      await axios.get(`http://localhost:8080/quiz/${quizId}`)
      .then((res) => {
        //console.log(res.data.questions);
        if (!res.data) {
          console.log("No quiz found");
          return;
        }
        setQuiz(res.data);
        setQuestions(res.data.questions);
        const initialSlides = res.data.questions.map((question) => ({
          content: question,
        }));
        setSlides(initialSlides);
      })
      .catch((error) => {
        console.log(error);
      });
    };

    fetchQuiz();
  }, [quizId, questionSaved]);

  //new slide button click to add a slide
  const handleNewSlide = () => {
    console.log("New Slide Button Clicked");
    const newSlide = {
      content: { questionText: "New slide content", questionType: "Question Type" },
    };
    setSlides([...slides, newSlide]);
    setQuestions([...questions, { questionText: "", questionType: "Question Type" }])
  };

  //sidebar slide click to change the current slide
  const handleSlideClick = (index) => {
    setCurrentSlide(index)
  };

  const handleQuestionDeleted = () => {
    setCurrentSlide(currentSlide - 1);
    const updatedQuestions = questions.filter((_, index) => index !== currentSlide);
    setQuestions(updatedQuestions);
    setSlides(updatedQuestions.map((question) => ({ content: question })));
  };

      
  //menu click to change the template
  const handleMenuClick = ({ key }) => {
    let questionType;
    switch (key) {
      case "1":
        questionType = "MCQ";
        break;
      case "2":
        questionType = "T/F";
        break;
      case "3":
        questionType = "Picture Question";
        break;
      case "4":
        questionType = "Number Questions";
        break;
      case "5":
        questionType = "Letter Question";
        break;
      default:
        questionType = "Question Type";
    }
    setSelectedQuestionType(questionType);
  
    const updatedQuestions = [...questions];
    updatedQuestions[currentSlide] = {
      ...updatedQuestions[currentSlide],
      questionType,
    };
    setQuestions(updatedQuestions);
  };

  //menu for question type
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Multiple Choice</Menu.Item>
      <Menu.Item key="2">True/False</Menu.Item>
      <Menu.Item key="3">Picture Question</Menu.Item>
      <Menu.Item key="4">Number Questions</Menu.Item>
      <Menu.Item key="5">Letter Question</Menu.Item>
    </Menu>
  );
  
  const renderQuestion = () => {
    const question = questions[currentSlide];
    if (!question) return <div>Choose Question Type</div>;
  
    switch (question.questionType) {
      case "MCQ":
        return <MCQTemplate 
                  question={question} 
                  onQuestionSaved={() => setQuestionSaved(prev => !prev)}
                  onQuestionDeleted={handleQuestionDeleted} 
                />;
      case "T/F":
        return <TFTemplate question={question} />;
      case "Picture Question":
        return <div>Picture Question Template</div>;
      case "Number Questions":
        return <div>Number Question Template</div>;
      case "Letter Question":
        return <div>Letter Question Template</div>;
      default:
        return <div>Choose a Template</div>;
    }
  };





  return (
    <div className="container">
      
      {/* Left Sidebar */}
        <div className="sidebar">
          <Button onClick={handleNewSlide} type="primary" id="newSlideButton">New Slide</Button>
          {questions.map((question, index) => (
            <Card id="smallCard" onClick={() => handleSlideClick(index)} key={index} >
             {question.questionText ? question.questionText : `Slide ${index + 1}`}
            </Card>
          ))}
        </div>

      {/* Main Content */}
        <div className="mainContent">
        <Card id="mainCard">
          
          {renderQuestion()}
          
        </Card>
        </div>

      {/* Right Sidebar */}
        <div className="rightsidebar">
        <Card title="Toolbar">
        <Dropdown overlay={menu}>
          <Button >
            <Space>
              {/* {selectedQuestionType} */}
              Question Type
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        </Card>
        </div>
    </div>
  );
}

export default CreatePage;
