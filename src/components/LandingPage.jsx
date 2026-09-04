import { useState, useEffect } from 'react';
import useWhitelist from '../hooks/useWhitelist';
import WhitelistClaimPanel from './Interface/Whitelist/WhitelistClaimPanel';
import WhitelistApplication from './Interface/Whitelist/WhitelistApplication';
import HoodCarousel from './Interface/HoodCarousel/HoodCarousel';
import './LandingPage.css';

const GAME_PATH = '/game';
const characterAsset = '/images/haunting-hoods-main-character.png';

const hoods = [
	['BLOOD HOOD', 'CLAN SANGUINE', '/images/carousel/hood-1.jpg'],
	['LIGHTNING HOOD', 'CLAN STORM', '/images/carousel/hood-2.jpg'],
	['ABYSS HOOD', 'CLAN ABYSS', '/images/carousel/hood-3.jpg'],
	['VOID HOOD', 'CLAN VOID', '/images/carousel/hood-4.jpg'],
	['STATIC HOOD', 'CLAN STATIC', '/images/carousel/hood-5.jpg'],
	['NEON HOOD', 'CLAN NEON', '/images/carousel/hood-6.jpg'],
	['RITUAL HOOD', 'CLAN OCCULT', '/images/carousel/hood-7.jpg'],
	['ASYLUM HOOD', 'CLAN ASYLUM', '/images/carousel/hood-8.jpg'],
	['ECLIPSE HOOD', 'CLAN ECLIPSE', '/images/carousel/hood-9.jpg'],
];

export default function LandingPage() {
	const openClaimPanel = useWhitelist((state) => state.openClaimPanel);
	const [showComingSoon, setShowComingSoon] = useState(false);
	const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

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

	return (
		<div className="landing-page">
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/new-logo.png" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="#story" onClick={handleComingSoon}>STORY</a>
					<a href={isLocalhost ? "/game" : "#game"} onClick={isLocalhost ? undefined : handleComingSoon}>
						WHITELIST HUNT {isLocalhost ? '' : '🔒'}
					</a>
					<a href="#roadmap" onClick={handleComingSoon}>ROADMAP</a>
				</nav>
				<button className="menu-button" aria-label="Open menu">☰</button>
			</header>

			<main>
				<section className="landing-hero" id="story">
					<div className="hero-copy">
						<p className="hero-kicker">THE SEAL IS WEAKENING <span>•</span></p>
						<h1>HAUNTING<br />HOODS</h1>
						<p className="hero-description">4444 entities were sealed away<br />to keep the balance. They will return.</p>
						<a
							className="primary-button"
							style={{ background: '#451717', borderColor: '#ff4d4d', display: 'inline-block', textDecoration: 'none' }}
							href="#whitelist"
						>
							APPLY FOR WHITELIST <span>✦</span>
						</a>
					</div>
					<div className="hero-art">
						<img src={characterAsset} alt="Haunting Hoods main character" />
					</div>
				</section>

				<section className="collection-section" id="roadmap">
					<div className="collection-intro">
						<p className="eyebrow">THE COLLECTION</p>
						<h2>EACH HOOD<br />HAS A PAST</h2>
						<p className="collection-caption" style={{ textAlign: 'center', color: '#b30000', fontSize: '1.2rem', marginTop: '1.5rem', fontWeight: 600 }}>THEIR STORIES WERE SEALED FOR A REASON.</p>
					</div>
					<HoodCarousel hoods={hoods} />
				</section>

				<WhitelistApplication />
			</main>

			<footer>
				<span>© 2026 HAUNTING HOODS. ALL RIGHTS RESERVED.</span>
				<span><a href="https://x.com/Haunting_Hoods" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>X (TWITTER)</a></span>
				<span>TERMS　　PRIVACY</span>
			</footer>
			<WhitelistClaimPanel />

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
