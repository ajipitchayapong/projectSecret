import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stages.css";

const stagesData = [
  {
    id: 1,
    title: "สำรวจ",
    bgClass: "bg-research",
    route: "/landing", // Add route here
  },
  {
    id: 2,
    title: "รายละเอียด",
    bgClass: "bg-detail",
    route: "/detail",
  },
  {
    id: 3,
    title: "ภัยคุกคาม",
    bgClass: "bg-test",
  },
  {
    id: 4,
    title: "ทำไมต้อง Polygon",
    bgClass: "bg-deliver",
  },
];

const Stages = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleTabClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="stages-container">
      {stagesData.map((stage) => (
        <div
          key={stage.id}
          className={`stage-tab ${stage.bgClass} ${activeTab === stage.id ? "active" : ""}`}
          onMouseEnter={() => setActiveTab(stage.id)}
          onMouseLeave={() => setActiveTab(null)}
          onClick={() => handleTabClick(stage.route)}
        >
          <div className="stage-content">
            <div className="stage-number-circle">{stage.id}</div>
            <h2 className="stage-title">{stage.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stages;
