import React, { useState, useEffect } from "react";
import Intro1 from "./Intro1.jsx";
import Intro2 from "./Intro2.jsx";
import "./Stages.css";
import { useNavigate, useLocation } from "react-router-dom";

const stagesData = [
  {
    id: 1,
    title: "สำรวจท้องทะเล",
    subtitle:
      "ร่วมสำรวจและทำความรู้จักกับเหล่า 10 สัตว์ทะเลหายากที่ใกล้สูญพันธุ์ หรือบางชนิดก็หาไม่ได้แล้ว เพื่อเรียนรู้ว่าทำไมการมีอยู่ของพวกมันถึงมีความหมายต่อโลกใบนี้",
    bgClass: "bg-research",
    route: "/landing",
  },
  {
    id: 2,
    title: "รายละเอียด",
    subtitle: "เจาะลึกข้อมูลเชิงลึกของแต่ละสายพันธุ์ที่น่าสนใจ",
    bgClass: "bg-detail",
    route: "/detail",
  },
  {
    id: 3,
    title: "ทำไมต้อง Polygon",
    subtitle:
      "เข้าใจว่าทำไม Polygon ถึงเป็นเครื่องมือที่ดีที่สุดสำหรับการอนุรักษ์",
    bgClass: "yPolygon",
    route: "/polygon",
  },
];

let hasSeenIntroGlobal = false;

const Stages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const skipIntro = location.state?.skipIntro ?? false;

  const [introStep, setIntroStep] = useState(
    hasSeenIntroGlobal || skipIntro ? 0 : 1,
  );
  const [activeTab, setActiveTab] = useState(null);
  const [mobileSelected, setMobileSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStepChange = (nextStep) => {
    setIntroStep(nextStep);
    if (nextStep === 0) hasSeenIntroGlobal = true;
  };

  const handleTabClick = (stage) => {
    if (isMobile) {
      if (mobileSelected === stage.id) {
        if (stage.route) navigate(stage.route);
      } else {
        setMobileSelected(stage.id);
      }
    } else {
      if (stage.route) navigate(stage.route);
    }
  };

  const selectedStage = stagesData.find((s) => s.id === mobileSelected);

  return (
    <div className="stages-container">
      {stagesData.map((stage) => (
        <div
          key={stage.id}
          className={`stage-tab ${stage.bgClass} ${activeTab === stage.id ? "active" : ""}`}
          onMouseEnter={() => !isMobile && setActiveTab(stage.id)}
          onMouseLeave={() => !isMobile && setActiveTab(null)}
          onClick={() => handleTabClick(stage)}
        >
          <div className="stage-content">
            <div className="stage-number-circle">{stage.id}</div>
            <h2 className="stage-title">{stage.title}</h2>
          </div>

          <div className="stage-info">
            <h1 className="stage-info-title">{stage.title}</h1>
            <p className="stage-info-subtitle">{stage.subtitle}</p>
          </div>
        </div>
      ))}

      {mobileSelected && selectedStage && (
        <div
          className={`mobile-preview ${selectedStage.bgClass}`}
          onClick={() => handleTabClick(selectedStage)}
        >
          <div className="mobile-preview-overlay" />
          <button
            className="mobile-preview-close"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSelected(null);
            }}
          >
            ✕
          </button>
          <div className="mobile-preview-content">
            <div className="stage-number-circle large">{selectedStage.id}</div>
            <h1 className="mobile-preview-title">{selectedStage.title}</h1>
            <p className="mobile-preview-subtitle">{selectedStage.subtitle}</p>
            <button className="mobile-preview-btn">เข้าสู่เส้นทางนี้ →</button>
          </div>
        </div>
      )}

      {introStep === 1 && <Intro1 onNext={() => handleStepChange(2)} />}
      {introStep === 2 && <Intro2 onNext={() => handleStepChange(0)} />}
    </div>
  );
};

export default Stages;
