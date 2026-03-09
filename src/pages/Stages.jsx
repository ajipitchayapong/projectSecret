import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Intro1 from "./Intro1.jsx";
import Intro2 from "./Intro2.jsx";
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
    bgClass: "bg-danger",
  },
  {
    id: 4,
    title: "ทำไมต้อง Polygon",
    bgClass: "yPolygon",
  },
];

// Keep track of intro state outside the component to persist across navigation
// but reset on full page refresh.
let hasSeenIntroGlobal = false;

const Stages = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [introStep, setIntroStep] = useState(hasSeenIntroGlobal ? 0 : 1);
  const navigate = useNavigate();

  const handleStepChange = (nextStep) => {
    setIntroStep(nextStep);
    if (nextStep === 0) {
      hasSeenIntroGlobal = true;
    }
  };

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

      {/* Intro Overlays */}
      {introStep === 1 && <Intro1 onNext={() => handleStepChange(2)} />}
      {introStep === 2 && <Intro2 onNext={() => handleStepChange(0)} />}
    </div>
  );
};

export default Stages;
