import './LandingPage.css';

const GAME_PATH = '/game';
const characterAsset = '/images/haunting-hoods-main-character.png';

const stats = [
	['4444', 'HOODS'],
	['11', 'CLANS'],
	['50+', 'MISSIONS'],
	['∞', 'POSSIBILITIES'],
];

const hoods = [
	['ASH HOOD', 'CLAN ASHEN', 'ash'],
	['DROWNED HOOD', 'CLAN ABYSS', 'drowned'],
	['LIGHTNING HOOD', 'CLAN STORM', 'lightning'],
	['VOID HOOD', 'CLAN VOID', 'void'],
];

const utilities = [
	['✧', 'REVENUE NETWORK', 'Ecosystem revenue flows back to activated Hoods.'],
	['♢', 'CLAN SYSTEM', 'Join a clan. Complete missions. Earn your place.'],
	['◇', 'PARTNER ACCESS', 'Unlock future drops, collabs and exclusive opportunities.'],
	['◯', 'FUTURE ECOSYSTEM', 'Games, experiences, and utilities — the journey begins.'],
];

export default function LandingPage() {
	return (
		<div className="landing-page">
			<header className="landing-nav">
				<a className="landing-brand" href="/">
					<img src="/images/favicon.svg" alt="" /> HAUNTING HOODS
				</a>
				<nav className="landing-links">
					<a href="#story">STORY</a>
					<a href={GAME_PATH}>WHITELIST</a>
					<a href="#roadmap">ROADMAP</a>
					<a href="#community">ART CONTEST</a>
				</nav>
				<button className="menu-button" aria-label="Open menu">☰</button>
			</header>

			<main>
				<section className="landing-hero" id="story">
					<div className="hero-copy">
						<div className="hero-rule" />
						<p className="hero-kicker">THE SEAL IS BROKEN <span>•</span></p>
						<h1>HAUNTING<br />HOODS</h1>
						<p className="hero-description">4444 entities were sealed away<br />to keep the balance. They return.</p>
						<a className="primary-button" href={GAME_PATH}>ENTER THE DARKNESS <span>✦</span></a>
						<div className="hero-scroll">↓ <span>SCROLL TO EXPLORE</span></div>
					</div>
					<div className="hero-art">
						<img src={characterAsset} alt="Haunting Hoods main character" />
					</div>
				</section>

				<section className="stats-section" aria-label="Haunting Hoods statistics">
					{stats.map(([number, label]) => (
						<div className="stat" key={label}>
							<strong>{number}</strong>
							<span>✦ &nbsp;{label}</span>
						</div>
					))}
				</section>

				<section className="collection-section" id="roadmap">
					<div className="collection-intro">
						<p className="eyebrow">THE COLLECTION</p>
						<h2>EACH HOOD<br />HAS A PAST</h2>
						<p>Different origins. Different powers.<br />One darkness.</p>
						<a className="text-link" href={GAME_PATH}>EXPLORE THE HOODS <span>→</span></a>
					</div>
					<div className="hood-track">
						{hoods.map(([name, clan, tone]) => (
							<a className={`hood-card ${tone}`} href={GAME_PATH} key={name}>
								<img src={characterAsset} alt={name} />
								<strong>{name}</strong>
								<span>• &nbsp;{clan}&nbsp; •</span>
							</a>
						))}
						<button className="track-next" aria-label="Next hood">›</button>
					</div>
				</section>

				<section className="ecosystem-section" id="community">
					<div className="ecosystem-intro">
						<p className="eyebrow">THE ECOSYSTEM</p>
						<h2>BUILT FOR<br />ETERNITY</h2>
						<p>More than an NFT collection.<br />A living, growing universe.</p>
						<a className="text-link" href={GAME_PATH}>LEARN MORE <span>→</span></a>
					</div>
					<div className="utility-list">
						{utilities.map(([icon, title, description]) => (
							<div className="utility-item" key={title}>
								<div className="utility-icon">{icon}</div>
								<h3>{title}</h3>
								<p>{description}</p>
							</div>
						))}
					</div>
				</section>

			</main>

			<footer>
				<span>© 2026 HAUNTING HOODS. ALL RIGHTS RESERVED.</span>
				<span>X (TWITTER)　　DISCORD　　INSTAGRAM</span>
				<span>TERMS　　PRIVACY</span>
			</footer>
		</div>
	);
}
