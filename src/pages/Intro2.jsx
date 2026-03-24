import React, { useState, useEffect } from "react";
import "./Intro2.css";
import bgIntro from "../images/bg_intro.webp";
import objectIntro from "../images/object_intro.webp";

const Intro2 = ({ onNext }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "ยินดีต้อนรับสู่ท้องทะเลของพวกเรา ในขณะนี้ท่านกำลังเป็นนักดำน้ำที่กำลังจมลึกใต้ท้องทะเลอันกว้างใหญ่ หน้าที่ของท่านคือการสำรวจไปในซากปรักหักพัง และแนวปะการังหลากสี เพื่อค้นพบสิ่งมีชีวิตมากมาย โปรดเลือกการเดินทางของท่าน";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 50); // Speed of typing

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="intro2-overlay"
      style={{ backgroundImage: `url(${bgIntro})` }}
    >
      <div className="diver-wrapper">
        <img src={objectIntro} alt="Diver" className="diver-image" />
      </div>

      <div className="text-overlay">
        <p className="typing-text">
          {displayText}
          <span className="cursor">|</span>
        </p>

        {displayText.length >= fullText.length && (
          <button className="start-btn" onClick={onNext}>
            เลือกการเดินทาง
          </button>
        )}
      </div>
    </div>
  );
};

export default Intro2;
