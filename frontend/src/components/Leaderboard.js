import { Modal, List, Button, Popover, message } from "antd";
import { useState, useEffect } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../context/quizContext";

const Leaderboard = ({ open, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        await axios
          .get(`${BASE_URL}/user/getAllPoints`)
          .then((res) => {
            const sortedData = res.data.sort((a, b) => b.points - a.points);
            setLeaderboardData(sortedData);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchLeaderboard();
  }, []);

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <div>
      <Modal className="leaderboard" open={open} onCancel={onClose} footer={null}>
        <Button
            type="text"
            icon={<InfoCircleOutlined />}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              fontSize: "18px",
              color: "#1890ff",
            }}
            onClick={() => alert("Users must be logged in to see the leaderboard to obtain points for the quiz.")}
        />
        <h1>Leaderboard</h1>
        <List
          dataSource={leaderboardData}
          renderItem={(user, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color:
                    index === 0
                      ? "gold"
                      : index === 1
                      ? "silver"
                      : index === 2
                      ? "brownze"
                      : "white",
                  marginRight: "10px",
                }}
              >
                {index + 1}.
              </span>
              <span style={{ flex: 1, color: "white"}}>{user.username}</span>
              <span style={{ fontWeight: "bold", color: "#4caf50" }}>
                {user.points} pts
              </span>
            </div>
          )}
        />
      </Modal>
    </div>
  );
};

export default Leaderboard;