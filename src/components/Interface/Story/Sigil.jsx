import { useRef } from 'react';
import gsap from 'gsap';
import useSigils from '../../../hooks/useSigils';

export default function Sigil({ id, symbol, style = {} }) {
	const sigilRef = useRef(null);
	const { collectedSigils, collectSigil } = useSigils();
	const isCollected = collectedSigils.includes(id);

	const handleClick = () => {
		if (isCollected) return;

		// Cinematic GSAP flash animation
		gsap.timeline()
			.to(sigilRef.current, { 
				color: '#ff4d4d',
				scale: 1.5,
				textShadow: '0 0 20px rgba(255, 77, 77, 0.8)',
				duration: 0.1, 
				ease: 'power2.out' 
			})
			.to(sigilRef.current, {
				opacity: 0,
				scale: 2,
				duration: 0.5,
				ease: 'power2.inOut',
				onComplete: () => {
					collectSigil(id);
				}
			});
	};

	if (isCollected) return null;

	return (
		<div
			ref={sigilRef}
			onClick={handleClick}
			style={{
				display: 'inline-flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: 'clamp(1rem, 2vw, 1.5rem)',
				opacity: 0.25,
				cursor: 'pointer',
				transition: 'all 0.3s ease',
				userSelect: 'none',
				zIndex: 50,
				color: '#747474',
				...style
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.opacity = '1';
				e.currentTarget.style.transform = 'scale(1.15)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.opacity = '0.25';
				e.currentTarget.style.transform = 'scale(1)';
			}}
		>
			{symbol}
		</div>
	);
}
