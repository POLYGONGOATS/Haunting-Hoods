import React from 'react';
import RaffleRewardChecker from './Interface/Raffle/RaffleRewardChecker';
import './LandingPage.css';

export default function RewardsPage() {
	return (
		<div className="info-page" style={{ minHeight: '100vh', background: '#020202' }}>
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="/">← RETURN TO HOME</a>
				</nav>
			</header>

			<main style={{ paddingTop: '80px' }}>
				<RaffleRewardChecker />
			</main>
		</div>
	);
}
