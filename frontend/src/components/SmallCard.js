import React from "react";
import { Card } from "antd";
import "../CSS/Create.css";

function SmallCard({ title, children }) {
  return (
    <Card className="small-card" title={title}>
      {children}
    </Card>
  );
}

export default SmallCard;