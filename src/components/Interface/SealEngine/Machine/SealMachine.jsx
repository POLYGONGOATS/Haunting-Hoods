import React from 'react';
import { motion } from 'framer-motion';
import useSealEngine from '../../../../hooks/useSealEngine';

const RINGS = [
	{ radius: 280, strokeWidth: 1, duration: 120, dash: "4 8", reverse: false },
	{ radius: 260, strokeWidth: 10, duration: 60, dash: "20 40 100 40", reverse: true },
	{ radius: 240, strokeWidth: 2, duration: 80, dash: "2 4", reverse: false },
	{ radius: 200, strokeWidth: 40, duration: 200, dash: "40 120", reverse: true },
	{ radius: 150, strokeWidth: 4, duration: 40, dash: "10 20", reverse: false },
];

export default function SealMachine() {
	const { totalMarksFed, targetMarks, machineState, isBroken } = useSealEngine();

	// Calculate integrity based on marks
	const sealIntegrity = Math.max(0, 100 - ((totalMarksFed / targetMarks) * 100));

	// Calculate color and intensity based on integrity
	const integrityScale = sealIntegrity / 100;
	// When integrity is 100, color is calm dark grey/red. When 0, it's bright corrupted red.
	const r = Math.floor(255 * (1 - integrityScale * 0.5));
	const g = Math.floor(50 * integrityScale);
	const b = Math.floor(50 * integrityScale);
	const primaryColor = `rgb(${r}, ${g}, ${b})`;
	const glowColor = `rgba(${r}, 0, 0, ${0.3 + (1 - integrityScale)*0.5})`;

	// Machine state modifiers
	const speedMultiplier = machineState === 'feeding' ? 5 : machineState === 'dispensing' ? 10 : 1;
	const isShaking = machineState === 'feeding' || machineState === 'dispensing';

	return (
		<div className={`seal-machine-container ${isShaking ? 'engine-shaking' : ''}`} style={{
			position: 'relative',
			width: '80vmin',
			height: '80vmin',
			maxWidth: '800px',
			maxHeight: '800px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			{/* SVG Machine Mechanics */}
			<svg width="100%" height="100%" viewBox="0 0 600 600" style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 0 20px ${glowColor})` }}>
				<defs>
					<filter id="corruption-glow">
						<feGaussianBlur stdDeviation="8" result="coloredBlur"/>
						<feMerge>
							<feMergeNode in="coloredBlur"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>

				{/* Center Core */}
				<circle cx="300" cy="300" r="140" fill="#030303" stroke={primaryColor} strokeWidth="2" filter="url(#corruption-glow)" />

				{/* Concentric Rings */}
				{RINGS.map((ring, i) => (
					<motion.circle
						key={i}
						cx="300"
						cy="300"
						r={ring.radius}
						fill="none"
						stroke={primaryColor}
						strokeWidth={ring.strokeWidth}
						strokeDasharray={ring.dash}
						initial={{ rotate: 0 }}
						animate={{ rotate: ring.reverse ? -360 : 360 }}
						transition={{
							repeat: Infinity,
							duration: ring.duration / speedMultiplier,
							ease: "linear"
						}}
						style={{ transformOrigin: "300px 300px" }}
						opacity={0.3 + (1 - integrityScale) * 0.4}
					/>
				))}

				{/* Structural Beams */}
				{[0, 60, 120, 180, 240, 300].map(angle => (
					<line 
						key={angle}
						x1="300" y1="160" 
						x2="300" y2="290" 
						stroke={primaryColor} 
						strokeWidth="4" 
						opacity="0.2"
						transform={`rotate(${angle} 300 300)`}
					/>
				))}
			</svg>

			{/* Center HUD */}
			<div style={{
				position: 'absolute',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 2,
				color: primaryColor,
				textShadow: `0 0 10px ${glowColor}`,
				textAlign: 'center'
			}}>
				<div style={{ fontSize: '0.8rem', letterSpacing: '0.4em', marginBottom: '0.5rem', opacity: 0.8 }}>
					SEAL INTEGRITY
				</div>
				<div style={{ 
					fontSize: '4.5rem', 
					fontWeight: 'bold', 
					lineHeight: 1, 
					letterSpacing: '-2px',
					fontVariantNumeric: 'tabular-nums' 
				}}>
					{sealIntegrity.toFixed(1)}%
				</div>
			</div>
		</div>
	);
}
