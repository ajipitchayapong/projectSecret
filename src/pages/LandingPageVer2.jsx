import { motion } from "framer-motion";
import { ANIMALS } from "../data/animalConfig";
import "./LandingPageVer2.css";
import topSceneOverlay from "/src/assets/top-scene.svg";
import middleSceneOverlay from "/src/assets/middle-scene.svg";
import middleLeftSceneOverlay from "../assets/middle-left-scene.svg";
import middleRightSceneOverlay from "../assets/middle-right-scene.svg";
import bottomLeftSceneOverlay from "../assets/bottom-left-scene.svg";
import bottomRightSceneOverlay from "../assets/bottom-right-scene.svg";

const LandingPageVer2 = () => {
  return (
    <div className="landing-page-v2">
      <div className="underwater-effects-container">
        <div className="bubbles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="bubble-v2"></span>
          ))}
        </div>
      </div>

      <div className="global-scene-layer-v2">
        {/* Place continuous background scene images here */}
      </div>

      <section className="section-1-v2">
        <motion.div className="content-v2">
          <div className="header-text-v2">
            <h1 className="title-v2">Low-Poly Ocean</h1>
            <p className="subtitle-v2">โลกในอีกมุมที่คุณไม่เคยเห็น</p>
          </div>

          <div className="scroll-indicator-v2">
            <div className="mouse-v2">
              <div className="wheel-v2"></div>
            </div>
            <div className="arrow-down-v2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M12 19L19 12M12 19L5 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>
        <motion.img
          src={topSceneOverlay}
          className="top-scene-overlay-v2"
          alt=""
        />
      </section>

      <section className="section-dolphin-v2">
        <div className="irrawaddy-dolphin-v2">
          <div className="dolphin-wrapper-v2">
            {ANIMALS.find((a) => a.id === "irrawaddyDolphin")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-dolphin-standard-v2">
        <div className="dolphin-standard-v2">
          <div className="dolphin-wrapper-standard-v2">
            {ANIMALS.find((a) => a.id === "dolphin")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-stingray-v2">
        <div className="stingray-v2">
          <div className="stingray-wrapper-v2">
            {ANIMALS.find((a) => a.id === "stingray")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-dugong-v2">
        <div className="dugong-v2">
          <div className="dugong-wrapper-v2">
            {ANIMALS.find((a) => a.id === "dugong")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-middle-scene-v2">
        <motion.img
          src={middleSceneOverlay}
          className="middle-scene-overlay-v2"
          alt=""
        />
        <div className="turtle-v2">
          <div className="turtle-wrapper-v2">
            {ANIMALS.find((a) => a.id === "turtle")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-ronin-v2">
        <img
          src={middleLeftSceneOverlay}
          className="mid-left-scene-v2"
          alt=""
        />
        <img
          src={middleRightSceneOverlay}
          className="mid-right-scene-v2"
          alt=""
        />
        <div className="ronin-v2">
          <div className="ronin-wrapper-v2">
            {ANIMALS.find((a) => a.id === "ronin")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>

        <div className="sawfishes-v2">
          <div className="sawfishes-wrapper-v2">
            {ANIMALS.find((a) => a.id === "sawfishes")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-orca-v2">
        <div className="orca-v2">
          <div className="orca-wrapper-v2">
            {ANIMALS.find((a) => a.id === "orca")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-sperm-whale-v2">
        <div className="sperm-whale-v2">
          <div className="sperm-whale-wrapper-v2">
            {ANIMALS.find((a) => a.id === "spermWhale")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-blue-whale-v2">
        <div className="blue-whale-v2">
          <div className="blue-whale-wrapper-v2">
            {ANIMALS.find((a) => a.id === "blueWhale")?.shards.map(
              (shard, index) => (
                <div
                  key={index}
                  className="shard"
                  style={{
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-bottom-scene-v2">
        <img
          src={bottomLeftSceneOverlay}
          className="bottom-left-scene-v2"
          alt=""
        />
        <img
          src={bottomRightSceneOverlay}
          className="bottom-right-scene-v2"
          alt=""
        />
      </section>
    </div>
  );
};

export default LandingPageVer2;
