import React, { useState, useEffect } from 'react';
import ScrollTimeline from './Interface/Story/ScrollTimeline';
import './LandingPage.css';

export default function InfoPage({ data }) {
	const [showComingSoon, setShowComingSoon] = useState(false);

	const handleComingSoon = (e) => {
		e.preventDefault();
		setShowComingSoon(true);
	};

	useEffect(() => {
		if (showComingSoon) {
			const t = setTimeout(() => setShowComingSoon(false), 2800);
			return () => clearTimeout(t);
		}
	}, [showComingSoon]);

	useEffect(() => {
		// Handle hash scroll if there's a hash in the URL (like #roadmap)
		if (window.location.hash) {
			setTimeout(() => {
				const element = document.querySelector(window.location.hash);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		} else {
			window.scrollTo(0, 0);
		}
	}, []);

	return (
		<div className="info-page">
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="/">← RETURN TO HOME</a>
				</nav>
			</header>

			<main>
				<ScrollTimeline data={data} />
			</main>

			{showComingSoon && (
				<div className="coming-soon-overlay" onClick={() => setShowComingSoon(false)}>
					<div className="coming-soon-modal">
						<p className="coming-soon-eyebrow">THE SEAL IS NOT READY</p>
						<h2>COMING SOON</h2>
						<p>This chapter has not yet been unsealed.</p>
					</div>
				</div>
			)}
		</div>
	);
}
