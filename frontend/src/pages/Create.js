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
  const[currentSlide, setCurrenSlide] = useState(0)
  const [selectedQuestionType, setSelectedQuestionType] = useState("Question Type");
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);

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
  }, [quizId,]);

  //new slide button click to add a slide
  const handleNewSlide = () => {
    console.log("New Slide Button Clicked");
    const newSlide = {
      content: { questionText: "New slide content", questionType: "Question Type" },
    };
    setSlides([...slides, newSlide]);
    setQuestions([...questions, {}]);
  };

  //sidebar slide click to change the current slide
  const handleSlideClick = (index) => {
    setCurrenSlide(index)
  };

      
  //menu click to change the template
  const handleMenuClick = ({ key }) => {
    let template;
    let questionType;
    switch (key) {
      case "1":
        template = <MCQTemplate />;
        questionType = "MQC";
        break;
      case "2":
        template = <TFTemplate />;
        questionType = "T/F";
        break;
      case "3":
        template = "Picture Question Template";
        questionType = "Picture Question";
        break;
      case "4":
        template = "Number Question Template";
        questionType = "Number Questions";
        break;
      case "5":
        template = "Letter Question Template";
        questionType = "Letter Question";
        break;
      default:
        template = "Choose Template";
        questionType = "Question Type";
    }
    setSelectedQuestionType(questionType);
    const updatedSlides = slides.map((slide, index) => {
      if (index === currentSlide) {
        return { ...slide, content: {...slide.content, questionType} };
      }
      return slide;
    });
    setSlides(updatedSlides);
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
    if (!question) return <div>Unknown Question Type</div>;

    switch (question.questionType) {
      case "MCQ":
        return <MCQTemplate question={question} />;
      case "T/F":
        return <TFTemplate question={question} />;
      case "Picture Question":
        return <div>Picture Question Template</div>;
      case "Number Questions":
        return <div>Number Question Template</div>;
      case "Letter Question":
        return <div>Letter Question Template</div>;
      default:
        return <div>Unknown Question Type</div>;
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
          
              <h1>{renderQuestion()}</h1>
          
        </Card>
        </div>

      {/* Right Sidebar */}
        <div className="rightsidebar">
        <Card title="Toolbar">
        <Dropdown overlay={menu}>
          <Button >
            <Space>
              {selectedQuestionType}
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
