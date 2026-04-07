import React, { useState, useEffect } from "react";
import Intro1 from "./Intro1.jsx";
import Intro2 from "./Intro2.jsx";
import "./Stages.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // Lock scroll when intro is active
  useEffect(() => {
    if (introStep === 1 || introStep === 2) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Extra lock for mobile
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [introStep]);

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
        <motion.div
          key={stage.id}
          layoutId={`stage-${stage.id}`}
          className={`stage-tab ${stage.bgClass} ${activeTab === stage.id ? "active" : ""}`}
          onMouseEnter={() => !isMobile && setActiveTab(stage.id)}
          onMouseLeave={() => !isMobile && setActiveTab(null)}
          onClick={() => handleTabClick(stage)}
        >
          <motion.div layout className="stage-content">
            <div className="stage-number-circle">{stage.id}</div>
            <h2 className="stage-title">{stage.title}</h2>
          </motion.div>

          <div className="stage-info">
            <h1 className="stage-info-title">{stage.title}</h1>
            <p className="stage-info-subtitle">{stage.subtitle}</p>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {mobileSelected && selectedStage && (
          <motion.div
            key="mobile-preview"
            layoutId={`stage-${selectedStage.id}`}
            className={`mobile-preview ${selectedStage.bgClass}`}
            onClick={() => handleTabClick(selectedStage)}
            style={{ zIndex: 100 }}
          >
            <motion.div
              className="mobile-preview-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <button
              className="mobile-preview-close"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSelected(null);
              }}
            >
              ✕
            </button>
            <motion.div
              className="mobile-preview-content"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div
                className="stage-number-circle large"
                variants={{
                  hidden: { y: -20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                {selectedStage.id}
              </motion.div>
              <motion.h1
                className="mobile-preview-title"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                {selectedStage.title}
              </motion.h1>
              <motion.p
                className="mobile-preview-subtitle"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                {selectedStage.subtitle}
              </motion.p>
              <motion.button
                className="mobile-preview-btn"
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
              >
                เข้าสู่เส้นทางนี้ →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {introStep === 1 && <Intro1 onNext={() => handleStepChange(2)} />}
      {introStep === 2 && <Intro2 onNext={() => handleStepChange(0)} />}
    </div>
  );
};

export default Stages;
