import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SoundController.css";

const SoundController = ({ bgSound }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const userIntentionalMute = useRef(false);
  const audioRef = useRef(null);

  const toggleSound = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    if (audioRef.current) {
      if (isMuted) {
        userIntentionalMute.current = false;
        audioRef.current.volume = volume;
        audioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      } else {
        userIntentionalMute.current = true;
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        userIntentionalMute.current = true;
        audioRef.current.pause();
      } else if (isMuted) {
        setIsMuted(false);
        userIntentionalMute.current = false;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  useEffect(() => {
    if (!isMuted || userIntentionalMute.current) return;

    const startAudio = () => {
      if (audioRef.current && isMuted && !userIntentionalMute.current) {
        audioRef.current.volume = volume;
        audioRef.current
          .play()
          .then(() => {
            console.log("Audio started successfully.");
            userIntentionalMute.current = false;
            setIsMuted(false);
            removeListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked on interaction:", err.name);
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener("click", startAudio, { capture: true });
      window.removeEventListener("mousedown", startAudio, { capture: true });
      window.removeEventListener("pointerdown", startAudio, { capture: true });
      window.removeEventListener("touchstart", startAudio, { passive: true });
      window.removeEventListener("wheel", startAudio, { passive: true });
      window.removeEventListener("scroll", startAudio, { passive: true });
      window.removeEventListener("keydown", startAudio, { capture: true });
      window.removeEventListener("pointermove", startAudio, { passive: true });
    };

    window.addEventListener("click", startAudio, { capture: true });
    window.addEventListener("mousedown", startAudio, { capture: true });
    window.addEventListener("pointerdown", startAudio, { capture: true });
    window.addEventListener("touchstart", startAudio, { passive: true });
    window.addEventListener("wheel", startAudio, { passive: true });
    window.addEventListener("scroll", startAudio, { passive: true });
    window.addEventListener("keydown", startAudio, { capture: true });
    window.addEventListener("pointermove", startAudio, { passive: true });

    return () => removeListeners();
  }, [isMuted, volume]);

  // Expose play function cleanly if parent needs to force play (like portal entry)
  useEffect(() => {
    if (window.triggerSoundPlay) {
      window.triggerSoundPlay = () => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current
            .play()
            .then(() => {
              setIsMuted(false);
              userIntentionalMute.current = false;
            })
            .catch(console.error);
        }
      };
    } else {
      window.triggerSoundPlay = () => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current
            .play()
            .then(() => {
              setIsMuted(false);
              userIntentionalMute.current = false;
            })
            .catch(console.error);
        }
      };
    }
  }, [volume]);

  return (
    <>
      <audio ref={audioRef} src={bgSound} loop preload="auto" />
      <motion.div
        className="sound-control-container-v2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="volume-slider-wrapper-v2"
              initial={{ width: 0, opacity: 0, paddingRight: 0 }}
              animate={{ width: 100, opacity: 1, paddingRight: 10 }}
              exit={{ width: 0, opacity: 0, paddingRight: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider-v2"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className={`sound-toggle ${isMuted ? "muted" : ""}`}
          onClick={toggleSound}
          onClickCapture={toggleSound}
          onPointerDownCapture={(e) => {
            e.stopPropagation();
          }}
          onMouseDownCapture={(e) => {
            e.stopPropagation();
          }}
          aria-label={
            isMuted ? "Unmute background music" : "Mute background music"
          }
        >
          <div className="sound-icon">
            {isMuted ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </div>
        </button>
      </motion.div>
    </>
  );
};

export default SoundController;
