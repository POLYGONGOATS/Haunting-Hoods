import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelTransition from '../PixelTransition/PixelTransition';
import './HoodCarousel.css';

export default function HoodCarousel({ hoods }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % hoods.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + hoods.length) % hoods.length);
    };

    const getCardStyle = (index) => {
        const diff = index - activeIndex;
        // Handle wrapping for infinite feel
        let normalizedDiff = diff;
        if (diff > hoods.length / 2) normalizedDiff -= hoods.length;
        if (diff < -hoods.length / 2) normalizedDiff += hoods.length;

        const isCenter = normalizedDiff === 0;
        
        let x = normalizedDiff * 140; // horizontal spacing
        let z = Math.abs(normalizedDiff) * -120; // push back
        let rotateY = normalizedDiff * -25; // angle towards center
        let opacity = 1 - Math.abs(normalizedDiff) * 0.25;
        if (opacity < 0) opacity = 0;

        return {
            x,
            z,
            rotateY,
            scale: isCenter ? 1 : 0.8,
            opacity: opacity,
            zIndex: hoods.length - Math.abs(normalizedDiff),
        };
    };

    return (
        <div className="hood-carousel-container">
            <div className="carousel-nav">
                <button className="carousel-arrow" onClick={handlePrev} aria-label="Previous">‹</button>
                <button className="carousel-arrow" onClick={handleNext} aria-label="Next">›</button>
            </div>
            
            {hoods.map(([name, clan, imageSrc], index) => {
                const styleProps = getCardStyle(index);
                const isActive = index === activeIndex;
                
                return (
                    <motion.div
                        key={name}
                        className={`carousel-card-wrapper ${isActive ? 'active' : ''}`}
                        initial={false}
                        animate={{
                            x: styleProps.x,
                            z: styleProps.z,
                            rotateY: styleProps.rotateY,
                            scale: styleProps.scale,
                            opacity: styleProps.opacity,
                            zIndex: styleProps.zIndex,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        onClick={() => setActiveIndex(index)}
                    >
                        <div className="carousel-card">
                            <PixelTransition
                                firstContent={
                                    <img src={imageSrc} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                                }
                                secondContent={
                                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', backgroundColor: '#050505' }}>
                                    </div>
                                }
                                gridSize={9}
                                pixelColor="#111111"
                                animationStepDuration={0.4}
                                aspectRatio="0%"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
