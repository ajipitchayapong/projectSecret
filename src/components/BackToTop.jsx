import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import "./BackToTop.css";

const BackToTop = () => {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen to scrollYProgress changes
    return scrollYProgress.on("change", (latest) => {
      // Show button only when very close to the bottom (e.g., last 1%)
      if (latest > 0.99) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="back-to-top-btn"
          initial={{ opacity: 0, scale: 0.5, y: 50, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.5, y: 50, x: "-50%" }}
          whileHover={{ scale: 1.05, y: -5, x: "-50%" }}
          whileTap={{ scale: 0.95, x: "-50%" }}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <span className="btn-text">กลับขึ้นบน</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
