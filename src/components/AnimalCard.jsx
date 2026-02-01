import React from 'react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transform: isHovered ? 'translateY(-10px)' : 'none',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)' 
      : '0 4px 6px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #fff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
    textAlign: 'center'
  };

  const infoStyle = {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '1.5rem',
  };

  const circleStyle = {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  };

  return (
    <Link to="/detail" style={{ textDecoration: 'none' }}>
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={circleStyle}>
           {/* Placeholder Icon based on first letter */}
           {animal.name.charAt(0)}
        </div>
        <div style={titleStyle}>{animal.name}</div>
        <div style={infoStyle}>{animal.shards.length} Shards</div>
        
        {isHovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(99,102,241,0.15), transparent 70%)',
            pointerEvents: 'none'
          }} />
        )}
      </div>
    </Link>
  );
};

export default AnimalCard;
