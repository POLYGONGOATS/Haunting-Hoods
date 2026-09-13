import React, { useState } from 'react';
import useSealEngine from '../../../hooks/useSealEngine';
import { motion, AnimatePresence } from 'framer-motion';

const SPOOKY_MESSAGES = [
	"Humanity, we are coming...",
	"Stay away.",
	"The darkness sees you.",
	"Your marks mean nothing.",
	"We cannot be contained forever.",
	"The 4444 are awakening."
];

// Reusing the avatars we have for the images
const AVATARS = [
	'2685.png', '3333.png', '3421.png', '3934.png', 
	'4026.png', '4247.png', '3537.png', '426.png', 
	'568.png', '596.png'
];

export default function HoodPlacement({ spotId, index, style }) {
	const { foundHoods, spotHood } = useSealEngine();
	const isFound = foundHoods.includes(spotId);
	const [showMessage, setShowMessage] = useState(false);
	const [messageText, setMessageText] = useState("");

	const handleClick = (e) => {
		e.preventDefault();
		if (isFound) return; // Already found this specific one

		const totalFound = foundHoods.length;

		if (totalFound < 4) {
			spotHood(spotId);
		} else {
			// Found 4 already, show a spooky message for extra clicks
			const randomMsg = SPOOKY_MESSAGES[Math.floor(Math.random() * SPOOKY_MESSAGES.length)];
			setMessageText(randomMsg);
			setShowMessage(true);
			setTimeout(() => setShowMessage(false), 3000);
		}
	};

	const avatarImg = AVATARS[index % AVATARS.length];

	return (
		<div style={{ position: 'relative', display: 'inline-block', ...style }}>
			<motion.div
				whileHover={{ opacity: isFound ? 0.3 : 1, scale: 1.1, boxShadow: '0 0 10px rgba(255, 77, 77, 0.8)' }}
				onClick={handleClick}
				style={{
					cursor: isFound ? 'default' : 'pointer',
					opacity: isFound ? 0.2 : 0.7,
					transition: 'all 0.3s ease',
					width: '35px',
					height: '35px',
					borderRadius: '50%',
					overflow: 'hidden',
					border: '1px solid rgba(255, 77, 77, 0.4)',
					boxShadow: '0 0 5px rgba(255, 77, 77, 0.2)'
				}}
			>
				<img 
					src={`/images/avatars/${avatarImg}`} 
					alt="Hood" 
					style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%) contrast(1.2) brightness(1.2)' }}
				/>
			</motion.div>

			<AnimatePresence>
				{showMessage && (
					<motion.div
						initial={{ opacity: 0, y: 50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.9 }}
						style={{
							position: 'fixed',
							bottom: '2rem',
							left: '50%',
							transform: 'translateX(-50%)',
							background: 'rgba(5, 5, 5, 0.95)',
							border: '1px solid #ff4d4d',
							color: '#ff4d4d',
							padding: '1rem 2rem',
							fontSize: '1rem',
							fontFamily: '"Space Mono", monospace',
							whiteSpace: 'nowrap',
							pointerEvents: 'none',
							zIndex: 99999,
							boxShadow: '0 0 20px rgba(255, 77, 77, 0.2)'
						}}
					>
						{messageText}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
