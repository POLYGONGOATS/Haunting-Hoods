import React from 'react';
import MarkVerification from './Interface/Whitelist/MarkVerification';
import './LandingPage.css';

export default function WhitelistPage() {
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
				<MarkVerification />
			</main>
		</div>
	);
}
