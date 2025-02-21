import ReactDOMServer from "react-dom/server";
import { Button, Card, Dropdown, Space, Menu, Radio, Flex } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { useState } from "react";

import "../CSS/Create.css";

import MCQTemplate from "../components/templates/mcqTemplate";
import TFTemplate from "../components/templates/TFTemplate";

function CreatePage() {

  const [slides, setSlides] = useState([{ content: "Choose Template" }]);
  const[currentSlide, setCurrenSlide] = useState(0)
  const [selectedQuestionType, setSelectedQuestionType] = useState("Question Type");

  //new slide button click to add a slide
  const handleNewSlide = () => {
    console.log("New Slide Button Clicked");
    const newSlide = {
      content: "New slide content",
    };
    setSlides([...slides, newSlide]);
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
        questionType = "Multiple Choice";
        break;
      case "2":
        template = <TFTemplate />;
        questionType = "True/False";
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
        return { ...slide, content: template };
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

  return (
    <div className="container">
      
      {/* Left Sidebar */}
        <div className="sidebar">
          <Button onClick={handleNewSlide} type="primary" id="newSlideButton">New Slide</Button>
          {slides.map((slide, index) => (
            <Card id="smallCard" onClick={() => handleSlideClick(index)} key={index} >
              {/* {typeof slide.content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: slide.content }} />
              ) : (
                slide.content
              )} */}
            </Card>
          ))}
        </div>

      {/* Main Content */}
        <div className="mainContent">
          <Card id="mainCard">
          {typeof slides[currentSlide].content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }} />
          ) : (
            slides[currentSlide].content
          )}
          </Card>
        </div>

      {/* Right Sidebar */}
        <div className="rightsidebar">
        <Card title="Toolbar">
        <Dropdown overlay={menu}>
          <Button>
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
