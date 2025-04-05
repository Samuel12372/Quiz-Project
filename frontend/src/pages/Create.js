import { Button, Card, Dropdown, Space, Menu, Radio, Flex, Input } from "antd";
import { useParams } from "react-router-dom";
import { DownOutlined, EditOutlined, SaveOutlined, DeleteOutlined, LoginOutlined, SettingOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../context/quizContext";

import "../CSS/Create.css";
import SettingsModal from "../components/SettingsModal";


import MCQTemplate from "../components/templates/mcqTemplate";
import TFTemplate from "../components/templates/TFTemplate";

function CreatePage() {
  
  const { TextArea } = Input;
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([{ content: "Choose Template" }]);
  const[currentSlide, setCurrentSlide] = useState(0)
  const [selectedQuestionType, setSelectedQuestionType] = useState("Question Type");
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionSaved, setQuestionSaved] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [originalQuiz, setOriginalQuiz] = useState({});
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  

  useEffect(() => {   
    const fetchQuiz = async () => {
      await axios.get(`${BASE_URL}/quiz/${quizId}`)
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

  const handleEditToggle = () => {
    if (!isEditingQuiz) {
      // Store the current quiz details before entering edit mode
      setOriginalQuiz({ ...quiz });
    }
    setIsEditingQuiz(!isEditingQuiz);
  };
  
  const handleCancelEdit = () => {
    // Revert quiz details to the original values
    setQuiz(originalQuiz);
    setIsEditingQuiz(false); // Exit edit mode
  };

  const handleLeaveQuiz = () => {
    navigate("/"); // Redirect to the home page
  }

  const handleSaveQuizDetails = async () => {
    try {
      // Send updated quiz details to the backend
      const updatedQuiz = {
        ...quiz,
        title: quiz.title, // Ensure the title is updated
        description: quiz.description, // Ensure the description is updated
      };
  
      await axios.post(`${BASE_URL}/quiz/${quizId}`, updatedQuiz);
  
      // Update the local state with the saved quiz details
      setQuiz(updatedQuiz);
      setIsEditingQuiz(false); // Exit edit mode
      console.log("Quiz details saved successfully!");
    } catch (error) {
      console.error("Error saving quiz details:", error);
    }
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
    <Menu onClick={handleMenuClick} className="custom-dropdown-menu" >
      <Menu.Item key="1">Multiple Choice</Menu.Item>
      <Menu.Item key="2">True/False</Menu.Item>
      {/* <Menu.Item key="3">Number Questions</Menu.Item> */}

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
        return <TFTemplate 
                  question={question} 
                  onQuestionSaved={() => setQuestionSaved(prev => !prev)}
                  onQuestionDeleted={handleQuestionDeleted} 
                />;
      case "Number Questions":
        return <div>Coming Soon</div>;
      default:
        return <div>Choose a Template</div>;
    }
  };

  //settings button click
  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
};
//close settings modal
const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
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
          <Card id="toolbarCard">
          <h2>Toolbar</h2>
          
          <Dropdown overlay={menu} className="dropdown">
            <Button className="dropdown-button">
              <Space>
                {/* {selectedQuestionType} */}
                Question Type
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          </Card>

          
          <Card id="editCard">
            {isEditingQuiz ? (
              <div>
                <TextArea
                  id="quizTitle"
                  autoSize={{ minRows: 1, maxRows: 1 }}
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  placeholder="Enter Quiz Title"
                />
                <TextArea
                  id="quizDescription"
                  value={quiz.description}
                  onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  placeholder="Enter Quiz Description"
                />
                <Button
                  className="saveButton"
                  type="default"
                  icon={<SaveOutlined />}
                  onClick={handleSaveQuizDetails}
                >
                  Save
                </Button>
                <Button
                  className="cancelButton"
                  type="default"
                  icon={<DeleteOutlined />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>
                <Button
                  className="editButton"
                  type="default"
                  icon={<EditOutlined />}
                  onClick={handleEditToggle}
                >
                  Edit
                </Button>
              </div>
            )}
          </Card>

          <Card id="leaveCard">
            <Button className="leaveButton" type="text" icon={<LoginOutlined/>} onClick={handleLeaveQuiz}>
              Leave Quiz
            </Button>
            <Button 
              onClick={handleSettingsClick} 
              type="primary" 
              className="settingsButton" 
              icon={<SettingOutlined />} 
            />
            {isSettingsModalOpen && <SettingsModal open={isSettingsModalOpen} onClose={closeSettingsModal}/>}
            
            <p>
              Use the left sidebar to navigate between slides or create new ones. 
              In the main content area, you can edit the selected question based on its type.
              Make sure to save the question after editing. 
              Use the toolbar on the right to change the question type or edit quiz details.
            </p>
          </Card>

          
        </div>
    </div>
  );
}

export default CreatePage;
