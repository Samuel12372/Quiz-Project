import { Modal, List } from "antd";
import { useState, useEffect,  } from "react";
import axios from "axios";

const Leaderboard = ({open, onClose}) => {

const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        //fetch leaderboard data
        const fetchLeaderboard = async () => {
            try {
                await axios.get('http://localhost:8080/user/getAllPoints')
                .then((res) => {
                
                    const sortedData = res.data.sort((a, b) => b.points - a.points);
                    console.log(sortedData);
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

  return (
    <div className="leaderboard">
      <Modal open={open} onCancel={onClose} footer={null}>
        <h1>Leaderboard</h1>
        <List
          itemLayout="horizontal"
          dataSource={leaderboardData}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                title={`${user.username}`}
                description={`${user.points} points`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Leaderboard;