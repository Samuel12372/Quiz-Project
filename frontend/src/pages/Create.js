import "../CSS/Create.css";
import { Card } from "antd";

function CreatePage() {
  return (
    <div className="container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <Card title="Slide 1">
          <p>test</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mainContent">
        <Card title="Create a Quiz">
          <p>test</p>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="rightsidebar">
        <Card title="Slide 2">
          <p>test</p>
        </Card>
      </div>
    </div>
  );
}

export default CreatePage;
