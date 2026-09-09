import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useSigils from '../../../hooks/useSigils';

export default function MarkCinematic() {
	const { cinematicActive, markCode, closeCinematic } = useSigils();
	const containerRef = useRef(null);
	const text1Ref = useRef(null);
	const markRef = useRef(null);

	useEffect(() => {
		if (cinematicActive && containerRef.current) {
			const tl = gsap.timeline();
			
			// Show container
			gsap.set(containerRef.current, { display: 'flex' });
			
			// Background fade in
			tl.to(containerRef.current, { opacity: 1, duration: 2, ease: 'power2.inOut' })
			  
			  // First text fades in
			  .to(text1Ref.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' })
			  
			  // Wait a bit
			  .to({}, { duration: 2 })
			  
			  // First text fades out
			  .to(text1Ref.current, { opacity: 0, y: -20, duration: 1.5, ease: 'power2.in' })
			  
			  // Mark section fades in
			  .to(markRef.current, { opacity: 1, scale: 1, duration: 2, ease: 'back.out(1.5)' });

		} else if (!cinematicActive && containerRef.current) {
			gsap.set(containerRef.current, { display: 'none', opacity: 0 });
			gsap.set(text1Ref.current, { opacity: 0, y: 20 });
			gsap.set(markRef.current, { opacity: 0, scale: 0.9 });
		}
	}, [cinematicActive]);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'fixed',
				inset: 0,
				background: '#020202',
				display: 'none',
				opacity: 0,
				zIndex: 9999,
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: '"Lincoln Road Regular", Arial, sans-serif',
				color: '#ff4d4d',
				textAlign: 'center'
			}}
		>
			<h1 
				ref={text1Ref}
				style={{
					opacity: 0,
					transform: 'translateY(20px)',
					fontSize: 'clamp(2rem, 5vw, 4rem)',
					letterSpacing: '0.1em',
					margin: 0,
					textShadow: '0 0 30px rgba(255, 77, 77, 0.5)'
				}}
			>
				THE DARKNESS HAS TAKEN NOTICE.
			</h1>

			<div 
				ref={markRef}
				style={{
					opacity: 0,
					transform: 'scale(0.9)',
					position: 'absolute',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '2rem'
				}}
			>
				<p style={{
					color: '#f5f5f5',
					fontFamily: '"Space Mono", monospace',
					letterSpacing: '2px',
					margin: 0,
					fontSize: '1rem'
				}}>
					You have uncovered every hidden sigil.
				</p>
				
				<div>
					<p style={{
						color: '#747474',
						fontSize: '0.8rem',
						letterSpacing: '4px',
						margin: '0 0 0.5rem 0'
					}}>YOUR MARK</p>
					<h2 style={{
						fontSize: 'clamp(2.5rem, 6vw, 5rem)',
						margin: 0,
						color: '#ff4d4d',
						letterSpacing: '0.05em',
						textShadow: '0 0 40px rgba(255, 77, 77, 0.8)',
						fontFamily: '"Space Mono", monospace'
					}}>
						{markCode}
					</h2>
				</div>

				<button
					onClick={() => {
						closeCinematic();
						window.location.href = '/whitelist';
					}}
					style={{
						marginTop: '2rem',
						padding: '1rem 2rem',
						background: 'transparent',
						border: '1px solid #ff4d4d',
						color: '#ff4d4d',
						fontFamily: '"Space Mono", monospace',
						letterSpacing: '2px',
						cursor: 'pointer',
						transition: 'all 0.3s ease'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = '#ff4d4d';
						e.currentTarget.style.color = '#020202';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = 'transparent';
						e.currentTarget.style.color = '#ff4d4d';
					}}
				>
					ACCEPT THE MARK
				</button>
			</div>
		</div>
	);
}
