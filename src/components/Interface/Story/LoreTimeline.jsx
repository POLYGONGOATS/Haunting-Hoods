import React, { useState, useEffect, useRef } from 'react';
import './LoreTimeline.css';

const LORE_DATA = [
	{
		title: "The Beginning",
		content: [
			"4,444 Hoods.",
			"One weakened Seal.",
			"One world waiting to fall.",
			"Haunting Hoods is not designed to be just another NFT collection.",
			"The 4,444 Hoods are the beginning of an evolving world, one that starts with the breach of a Seal, moves through the destruction of humanity, and eventually becomes a living ecosystem built around Factions, competition, an on-chain economy, and future projects under the Haunting Hoods IP.",
			"The story begins at the moment of mint.",
			"And once the first Hood enters the world, everything changes."
		]
	},
	{
		title: "The Seal Breaks",
		content: [
			"For centuries, something has been holding them back.",
			"A Seal.",
			"But the Seal is weakening.",
			"Mint is the signal.",
			"When the 4,444 Hoods are minted, it represents the moment they have finally managed to weaken the Seal enough to enter our world.",
			"4,444 Hoods have escaped.",
			"And they did not come here to coexist.",
			"They came for revenge.",
			"They came to destroy the world."
		]
	},
	{
		title: "The Reckoning Quests",
		content: [
			"Once the Hoods enter the world, every Hood receives its own set of [REDACTED] Reckoning Quests.",
			"These quests are directly connected to the lore and the Hoods' mission to bring about the destruction of the world.",
			"The exact quests, requirements and numbers remain [REDACTED].",
			"There is no deadline.",
			"But speed matters.",
			"Every Hood that completes its Reckoning Quests is one step closer to completing its purpose, and the earlier a Hood completes them, the greater its potential edge when the first season begins.",
			"The first Hood to complete its entire set of Reckoning Quests triggers something much bigger."
		]
	},
	{
		title: "The Apocalypse",
		content: [
			"The moment the first Hood completes its mission, The Apocalypse begins.",
			"And with The Apocalypse comes the next phase of Haunting Hoods.",
			"The Haunting Hoods token launches.",
			"Staking begins.",
			"The world has fallen into chaos.",
			"Now the Hoods have to decide what comes next."
		]
	},
	{
		title: "The New World",
		content: [
			"The Apocalypse marks the end of the beginning.",
			"With humanity erased from the picture, the Hoods begin dividing the world among themselves.",
			"The 4,444 Hoods will be divided into 11 Factions, with exactly 404 Hoods in each Faction.",
			"But not everyone gets to choose whenever they want.",
			"The order matters.",
			"The faster a Hood completes its Reckoning Quests, the earlier its holder gets the opportunity to choose their Faction.",
			"11 Factions. 404 Hoods each. 4,444 Hoods total.",
			"Once a Faction is filled, the choice is gone.",
			"Your speed during the Reckoning could determine where your Hood belongs when the new world is formed."
		]
	},
	{
		title: "The Factions",
		content: [
			"Every Faction becomes its own community within the Haunting Hoods ecosystem.",
			"Each Faction has: 1 General, 2 Wardens.",
			"The General is the holder with the highest number of Hoods from that specific Faction at the seasonal snapshot.",
			"The second-highest holder becomes a Warden.",
			"The third-highest holder becomes the other Warden.",
			"These positions are not permanent. Every season brings a new snapshot. Every season can create new leaders.",
			"Ownership, participation and strategy can change the balance of power.",
			"The General and Wardens will help represent their Faction, coordinate its members and play a role in its competitive journey.",
			"More information about their responsibilities and additional mechanics will be revealed when the time comes."
		]
	},
	{
		title: "The Seasons Begin",
		content: [
			"After The Apocalypse, Haunting Hoods enters its recurring competitive phase.",
			"Each season is a fresh battle between the 11 Factions.",
			"A seasonal reward pool will be distributed in the Haunting Hoods token.",
			"The exact reward pool, ranking system, distribution mechanics and activities required to achieve those rankings remain: [REDACTED]",
			"What we can reveal is simple:",
			"Your Faction's performance matters. And so does your Hood's participation."
		]
	},
	{
		title: "Your Hood Must Participate",
		content: [
			"Simply owning a Hood will not automatically make it eligible for seasonal rewards.",
			"At the beginning of each season, holders will need to activate their Hood for that season.",
			"This requires staking the Hood and burning a specified amount of Haunting Hoods tokens.",
			"Once activated, the Hood can participate in the seasonal Faction Wars.",
			"The activities required during those wars remain: [REDACTED]",
			"But participation will require additional token expenditure through the season.",
			"Tokens will be used. Tokens will be burned. Hoods will compete.",
			"And the final performance of each Faction will determine its position on the seasonal leaderboard."
		]
	},
	{
		title: "The Reward System",
		content: [
			"At the end of each season, eligible holders receive their share of the seasonal reward pool.",
			"The amount a holder receives will depend on the final Faction ranking and their individual activity, with the exact calculation remaining: [REDACTED]",
			"There is also a minimum participation threshold required for a Hood to qualify for that season's rewards.",
			"Certain states make a Hood ineligible. A Hood that is listed at the snapshot will not be eligible. A Hood that is unstaked at the snapshot will not be eligible. A Hood that is inactive at the snapshot will not be eligible.",
			"A Hood must participate in the Faction Wars and meet the required participation threshold to qualify.",
			"Then the season ends. Rewards are distributed. The leaderboard resets. And the next season begins.",
			"SEASON 1 → RESET → SEASON 2 → RESET → SEASON 3 → ...",
			"Every season creates another opportunity to change the balance of power."
		]
	},
	{
		title: "Ownership Changes Everything",
		content: [
			"A Hood changing hands also changes its seasonal status.",
			"Whenever a Hood is transferred to a new holder, it becomes inactive.",
			"The new holder must activate the Hood again for the relevant season if they want to participate.",
			"However, the original Reckoning Quest activation is permanent.",
			"The initial questline only needs to be completed once.",
			"After that, the Hood remains part of the ecosystem, while seasonal activation is handled separately."
		]
	},
	{
		title: "A Full Token Economy",
		content: [
			"Haunting Hoods is designed around a complete economic loop.",
			"The token isn't simply something to hold. It can be: Earned. Spent. Burned. Bought. Sold. Used. Recycled back into the ecosystem.",
			"Seasonal activation. Faction participation. Competitive mechanics. Rewards. Future utilities.",
			"And additional ecosystem systems can all create reasons for the token to move through the economy.",
			"The exact token supply, quantities, fees and additional mechanics remain: [REDACTED]",
			"The goal is not to create a token simply because an ecosystem has one.",
			"The goal is to build an economy where the token has reasons to exist."
		]
	},
	{
		title: "Buybacks",
		content: [
			"A portion of eligible royalties generated by Haunting Hoods will be used toward token buybacks.",
			"And Haunting Hoods is not planning to stop at the original collection.",
			"As new projects, products and experiences are developed under the Haunting Hoods IP, a portion of revenue generated by those future ventures will also contribute toward token buybacks.",
			"The exact structure remains: [REDACTED]",
			"The important part is the bigger picture.",
			"The value generated by the ecosystem is designed to flow back into the ecosystem."
		]
	},
	{
		title: "More Than An NFT Project",
		content: [
			"The 4,444 Hoods are the foundation. They are not the entire destination.",
			"Haunting Hoods is being built as an IP and ecosystem with plans for multiple future projects, products, experiences and protocols.",
			"Some will connect directly to the Hoods.",
			"Some may introduce completely new ways to interact with the Haunting Hoods universe.",
			"Some may create new economic activity within the ecosystem.",
			"And some of what is being planned remains: [REDACTED]",
			"More will be revealed when the time is right."
		]
	},
	{
		title: "Rewards Beyond The Wars",
		content: [
			"The seasonal Faction ranking system will not necessarily be limited to the core Haunting Hoods reward pool.",
			"Future benefits from Haunting Hoods-based projects, partner projects and collaborations can also be distributed through the same competitive structure.",
			"This can include: Whitelist spots, Allocations, Partner NFTs, Early access, Special benefits, Future ecosystem rewards, Other opportunities.",
			"The principle remains simple: The better your Faction performs, the better the potential rewards.",
			"The exact benefits, distribution mechanics and future partnerships remain: [REDACTED]"
		]
	},
	{
		title: "The Roadmap Is Not Static",
		content: [
			"Haunting Hoods is not being built around a roadmap that ends once every box is checked.",
			"The ecosystem is designed to evolve.",
			"As Haunting Hoods grows, the roadmap will grow with it.",
			"Faction Wars can evolve. Token utility can expand. New mechanics can be introduced. New products can be launched. New experiences can be created. New ways to use your Hood can emerge.",
			"The systems described today are the foundation, not the ceiling.",
			"Some future mechanics are already planned. Some are still being developed.",
			"And some remain: [REDACTED]"
		]
	},
	{
		title: "From The Seal To The New World",
		content: [
			"The journey of Haunting Hoods can be understood in a simple progression:",
			"THE SEAL WEAKENS ↓ MINT ↓ 4,444 HOODS ENTER THE WORLD ↓ THE RECKONING QUESTS ↓ THE FIRST HOOD COMPLETES ITS QUESTS ↓ THE APOCALYPSE ↓ TOKEN LAUNCH + STAKING ↓ 11 FACTIONS ↓ FACTION WARS ↓ SEASONAL RANKINGS ↓ REWARDS ↓ RESET ↓ A NEW SEASON BEGINS",
			"And this cycle continues as the ecosystem expands."
		]
	},
	{
		title: "But There Are Still Questions",
		content: [
			"Everything above explains what Haunting Hoods is becoming. It doesn't explain why any of this is happening.",
			"Because before the Factions, before the token, before The Apocalypse... There is a story.",
			"And most of it hasn't been told yet.",
			"How did the Seal break?",
			"What was the Seal actually holding back?",
			"Why do the Hoods want an Apocalypse?",
			"What happened to the Hoods before they entered our world?",
			"Where did the 4,444 Hoods come from?",
			"Why exactly are there 4,444?",
			"What was that photograph?",
			"Who, or what, took it?",
			"Why was it connected to the Hoods?",
			"How do the Hoods actually look?",
			"What happened on the other side of the Seal?",
			"And what exactly are the Hoods coming back for?",
			"There are answers. Every one of these questions has a story behind it.",
			"But those answers belong to the lore. And the lore has only just begun to surface.",
			"Some things have already been shown. Some things are still hidden.",
			"And some things should probably remain [REDACTED]... for now.",
			"The ecosystem is what comes after. The story is what explains why it all began."
		]
	},
	{
		title: "This Is Only The Beginning",
		content: [
			"Haunting Hoods starts with 4,444 beings escaping a weakened Seal.",
			"It continues with The Reckoning. Then comes The Apocalypse. Then the formation of 11 Factions. Then competition. Then an economy. Then an ecosystem.",
			"The 4,444 Hoods are the foundation of everything that follows.",
			"The lore brings them into the world. The Reckoning gives them purpose. The Apocalypse changes the world. The Factions give holders identity. The seasons create competition. The token creates an economy. And the ecosystem gives Haunting Hoods somewhere to go next.",
			"Haunting Hoods won't just be an NFT project.",
			"It's the beginning of an ecosystem built around an IP designed to keep expanding.",
			"But before we reach the new world... We need to understand what happened to the old one.",
			"THE SEAL BROKE. THE HOODS ENTERED. THE WORLD FELL. NOW THE NEW WORLD BEGINS."
		]
	}
];

export default function LoreTimeline() {
	const sectionRef = useRef(null);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return;
			
			const { top, height } = sectionRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			
			// Calculate how far we've scrolled through this section
			let progress = ((windowHeight - top) / height) * 100;
			progress = Math.max(0, Math.min(100, progress));
			setScrollProgress(progress);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.15 }
		);

		const chapters = document.querySelectorAll('.lore-chapter');
		chapters.forEach(chapter => observer.observe(chapter));

		return () => chapters.forEach(chapter => observer.unobserve(chapter));
	}, []);

	// Helper to render text with glitches
	const renderTextWithGlitch = (text) => {
		if (!text.includes('[REDACTED]')) return text;
		
		const parts = text.split('[REDACTED]');
		return parts.map((part, index) => (
			<React.Fragment key={index}>
				{part}
				{index < parts.length - 1 && <span className="glitch-redacted">[REDACTED]</span>}
			</React.Fragment>
		));
	};

	return (
		<section className="lore-section" id="story" ref={sectionRef}>
			{/* Pulsating blood vignette overlay */}
			<div className="blood-vignette" />

			<div className="lore-progress-bar" style={{ height: `${scrollProgress}%` }}>
				<div className="blood-drip" />
			</div>
			
			<div className="lore-container">
				{LORE_DATA.map((chapter, index) => (
					<div className="lore-chapter" key={index} id={index === 14 ? 'roadmap' : ''}>
						<h3 className="lore-chapter-title">{chapter.title}</h3>
						<div className="lore-chapter-text">
							{chapter.content.map((paragraph, pIdx) => (
								<p key={pIdx}>{renderTextWithGlitch(paragraph)}</p>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
