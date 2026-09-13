import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSealEngine from "../../../hooks/useSealEngine";

export default function DispenseSequence() {
	const { isBroken, machineState } = useSealEngine();
	const [phase, setPhase] = useState('shake');

	useEffect(() => {
		// Shake phase lasts 2 seconds, then text phase
		const t1 = setTimeout(() => {
			setPhase('text');
		}, 2000);

		return () => clearTimeout(t1);
	}, []);

	return (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 9999,
				backgroundColor: 'rgba(5, 5, 5, 0.95)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: '"Space Mono", monospace'
			}}
		>
			<AnimatePresence mode="wait">
				{phase === 'shake' && (
					<motion.div
						key="shake"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ 
							scale: [0.8, 1, 1], 
							opacity: 1,
							x: [0, -10, 10, -10, 10, -5, 5, 0],
							y: [0, 10, -10, 5, -5, 10, -10, 0]
						}}
						exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
						transition={{ 
							duration: 1.5, 
							times: [0, 0.2, 0.9],
							x: { duration: 0.5, repeat: 3 },
							y: { duration: 0.5, repeat: 3 }
						}}
						style={{
							width: '200px',
							height: '200px',
							borderRadius: '50%',
							background: 'radial-gradient(circle, #ff4d4d 0%, transparent 70%)',
							filter: 'blur(20px)'
						}}
					/>
				)}

				{phase === 'text' && (
					<motion.div
						key="text"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, type: "spring" }}
						style={{ textAlign: 'center' }}
					>
						<div style={{ color: '#aaa', letterSpacing: '0.4em', fontSize: '0.8rem', marginBottom: '2rem' }}>
							CONTRIBUTION
						</div>
						
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: phase === 'text' ? 1 : 0, y: phase === 'text' ? 0 : 20 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							style={{ 
								fontSize: 'clamp(2rem, 5vw, 4rem)', 
								color: '#fff', 
								letterSpacing: '2px',
								textShadow: '0 0 20px rgba(255, 77, 77, 0.5)'
							}}
						>
							MARKS ACCEPTED.
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
