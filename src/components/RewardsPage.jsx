import React from 'react';
import RaffleRewardChecker from './Interface/Raffle/RaffleRewardChecker';
import './LandingPage.css';

export default function RewardsPage() {
	return (
		<div className="info-page" style={{ 
			minHeight: '100vh', 
			backgroundColor: '#050505',
			backgroundImage: 'radial-gradient(circle at center, transparent 0%, #000000 100%), url("/images/carousel/hood-7.jpg")',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundBlendMode: 'multiply',
			backgroundAttachment: 'fixed',
			position: 'relative'
		}}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.85)', zIndex: 0 }}></div>
			<div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(138, 3, 3, 0.15) 0%, transparent 60%)', zIndex: 1 }}></div>
			
			<header className="landing-nav" style={{ position: 'relative', zIndex: 10 }}>
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="/">← ESCAPE TO HOME</a>
				</nav>
			</header>

			<main style={{ paddingTop: '100px', position: 'relative', zIndex: 10 }}>
				<RaffleRewardChecker />
			</main>
		</div>
	);
}
