import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ANIMALS } from '../data/animalConfig';
import PreviewStage from '../components/PreviewStage';
import oceanBg from '../assets/ocean_bg.png';
import Button from '../components/Button';

import decoration1 from '../assets/decoration_1.svg';
import decoration2 from '../assets/decoration_2.svg';
import decoration3 from '../assets/decoration_3.svg';
import decoration4 from '../assets/decoration_4.svg';
import decoration5 from '../assets/decoration_5.svg';

const LandingPage = () => {
  const getAnimal = (id) => ANIMALS.find(a => a.id === id);
  const turtle = ANIMALS.find(a => a.id === 'turtle') || ANIMALS[0];
  
  // Mapped from animalConfig.js
  const orca = getAnimal('orca') || turtle; 
  const manatee = getAnimal('dugong') || turtle; // Config uses 'dugong' for Manatee
  
  // Fallbacks if not found (Figma requires these specifically)
  // If 'dolphin' or 'jellyfish' are not in ANIMALS, we might need placeholders or re-use existing ones.
  // Assuming 'dolphin' and 'jellyfish' might be in the config or user wants to visualize positions.
  const dolphin = getAnimal('dolphin') || orca; 
  const jellyfish = getAnimal('jellyfish') || turtle; 

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#051120', // Darker deep ocean blue
      backgroundImage: `url(${oceanBg})`,
      backgroundSize: '100% auto',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top center',
      fontFamily: "'Prompt', 'Outfit', sans-serif",
      color: '#fff',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600&family=Outfit:wght@400;700&display=swap');
        
        .glow-text {
          text-shadow: 0 0 20px rgba(50, 150, 255, 0.6), 0 0 40px rgba(50, 150, 255, 0.3);
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        `}
      </style>

      {/* Background Decorations (SVGs) */}
      <img src={decoration1} alt="" style={{ position: 'absolute', top: '12%', right: '10%', width: '40%', zIndex: 1, opacity: 0.8 }} />
      <img src={decoration2} alt="" style={{ position: 'absolute', top: '45%', left: '-5%', width: '20%', zIndex: 1, opacity: 0.6 }} />
      
      {/* Small Vertical Accents */}
      <img src={decoration3} alt="" style={{ position: 'absolute', top: '25%', right: '0', width: '90px', zIndex: 1, opacity: 0.5 }} />
      <img src={decoration4} alt="" style={{ position: 'absolute', top: '75%', right: '0', width: '90px', zIndex: 1, opacity: 0.5 }} />
      <img src={decoration5} alt="" style={{ position: 'absolute', top: '90%', left: '0', width: '90px', zIndex: 1, opacity: 0.5 }} />

      {/* Main Scroll Container */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        height: '3311px', // Exact Figma height matching
        overflow: 'hidden' 
      }}>

        {/* --- HEADER --- */}
        <header style={{
            position: 'absolute',
            top: '145px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '100%',
            zIndex: 10
        }}>
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '96px',
                fontWeight: '700',
                margin: 0,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A5C0FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25))'
            }}>
                Low-Poly Ocean
            </h1>
            <p style={{
                fontFamily: "'Prompt', sans-serif",
                fontSize: '24px',
                fontWeight: '300',
                marginTop: '16px',
                color: '#B0C4DE'
            }}>
                โลกในอีกมุมที่คุณไม่เคยเห็น
            </p>
            <div style={{ marginTop: '48px' }}>
                <Link to="/detail">
                    <Button variant="primary" style={{ 
                        padding: '16px 48px', 
                        fontSize: '20px',
                        borderRadius: '50px',
                        background: 'linear-gradient(90deg, #FF7E5F 0%, #FEB47B 100%)',
                        boxShadow: '0px 10px 30px rgba(233, 76, 33, 0.3)'
                    }}>
                    Start Journey
                    </Button>
                </Link>
            </div>
        </header>

        {/* --- ORCA (Top Right) --- */}
        <div style={{
            position: 'absolute',
            top: '550px',
            right: '-100px',
            width: '1000px',
            height: '600px',
            zIndex: 5,
            pointerEvents: 'none' // Let clicks pass through if needed
        }}>
            <PreviewStage animal={orca} autoRotate={true} />
        </div>

        {/* --- JELLYFISH (Middle Left) --- */}
        <div className="floating" style={{
            position: 'absolute',
            top: '1300px',
            left: '-50px',
            width: '600px',
            height: '600px',
            zIndex: 6
        }}>
             <PreviewStage animal={jellyfish} autoRotate={true} />
             {/* Text Label */}
             <div style={{
                 position: 'absolute',
                 top: '50%',
                 left: '100%',
                 width: '400px',
                 transform: 'translateY(-50%)',
                 textAlign: 'left',
                 paddingLeft: '40px'
             }}>
                 <h2 style={{ fontSize: '48px', margin: 0, color: '#FFD700', fontFamily: "'Outfit', sans-serif" }}>Jellyfish</h2>
                 <p style={{ fontSize: '20px', opacity: 0.8 }}>ความเงียบสงบแห่งท้องทะเล</p>
             </div>
        </div>

        {/* --- DOLPHIN (Lower Right) --- */}
        <div style={{
            position: 'absolute',
            top: '2100px',
            right: '50px',
            width: '700px',
            height: '500px',
            zIndex: 5
        }}>
             <PreviewStage animal={dolphin} autoRotate={true} />
             {/* Text Label */}
             <div style={{
                 position: 'absolute',
                 top: '50%',
                 right: '100%',
                 width: '400px',
                 transform: 'translateY(-50%)',
                 textAlign: 'right',
                 paddingRight: '40px'
             }}>
                 <h2 style={{ fontSize: '48px', margin: 0, color: '#00FFFF', fontFamily: "'Outfit', sans-serif" }}>Dolphin</h2>
                 <p style={{ fontSize: '20px', opacity: 0.8 }}>นักสำรวจผู้ร่าเริง</p>
             </div>
        </div>

        {/* --- MANATEE (Bottom Center) --- */}
        <div style={{
            position: 'absolute',
            top: '2800px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            zIndex: 5
        }}>
             <PreviewStage animal={manatee} autoRotate={true} />
             <div style={{
                 position: 'absolute',
                 bottom: '-50px',
                 width: '100%',
                 textAlign: 'center'
             }}>
                  <h2 style={{ fontSize: '48px', margin: 0, color: '#FFB6C1', fontFamily: "'Outfit', sans-serif" }}>Manatee</h2>
                  <p style={{ fontSize: '20px', opacity: 0.8 }}>ยักษ์ใหญ่ใจดี</p>
             </div>
        </div>

      </div>

      {/* Footer Gradient Fade */}
      <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '150px',
          background: 'linear-gradient(to top, rgba(5,17,32,1) 0%, transparent 100%)',
          zIndex: 20,
          pointerEvents: 'none'
      }} />

    </div>
  );
};

export default LandingPage;
