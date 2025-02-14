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
    switch (key) {
      case "1":
        template = ReactDOMServer.renderToString(<MCQTemplate />);
        break;
      case "2":
        template = ReactDOMServer.renderToString(<TFTemplate />);
        break;
      case "3":
        template = "Picture Question Template"; // Replace with actual template
        break;
      case "4":
        template = "Number Question Template"; // Replace with actual template
        break;
      case "5":
        template = "Letter Question Template"; // Replace with actual template
        break;
      default:
        template = "Choose Template"; // Fallback template
    }
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
              <div dangerouslySetInnerHTML={{ __html: slide.content }} /> 
            </Card>
          ))}
        </div>

      {/* Main Content */}
        <div className="mainContent">
          <Card id="mainCard">
            <div dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }} /> 
          </Card>
        </div>

      {/* Right Sidebar */}
        <div className="rightsidebar">
        <Card title="Toolbar">
        <Dropdown overlay={menu}>
          <Button>
            <Space>
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
