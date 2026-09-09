import React, { useState, useEffect } from 'react';
import useMarkVerification from '../../../hooks/useMarkVerification';
import useSigils from '../../../hooks/useSigils';
import './WhitelistApplication.css';

export default function MarkVerification() {
	const { collectedSigils, markCode } = useSigils();
	const {
		submitVerification, 
		claiming, 
		alreadyClaimed,
		submittedAt,
		claimError
	} = useMarkVerification();

	const [timeLeft, setTimeLeft] = useState({ hours: 72, minutes: 0, seconds: 0 });

	const [discordUser, setDiscordUser] = useState('');
	const [twitterHandle, setTwitterHandle] = useState('');
	const [tweetUrl, setTweetUrl] = useState('');
	const [walletAddress, setWalletAddress] = useState('');

	const hasMark = collectedSigils.length === 6 && markCode;

	useEffect(() => {
		const START_TIME = new Date('2026-09-09T20:00:00+05:30').getTime();
		const END_TIME = START_TIME + 72 * 60 * 60 * 1000;

		const interval = setInterval(() => {
			const now = Date.now();
			let targetTime = 0;
			let isPreLaunch = false;

			if (now < START_TIME) {
				targetTime = START_TIME;
				isPreLaunch = true;
			} else if (now < END_TIME) {
				targetTime = END_TIME;
			}

			const diff = targetTime - now;

			if (diff <= 0) {
				setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPreLaunch: false });
				clearInterval(interval);
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft({ hours, minutes, seconds, isPreLaunch });
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const generateTweetIntent = () => {
		const text = encodeURIComponent(`My Mark: ${markCode}\n\nThe Darkness has taken notice.\n\n@Haunting_Hoods`);
		return `https://twitter.com/intent/tweet?text=${text}`;
	};

	if (!hasMark && !alreadyClaimed) {
		return (
			<section className="wl-application-section" id="whitelist-hunt">
				<div className="wl-app-container" style={{ textAlign: 'center', opacity: 0.5 }}>
					<p className="eyebrow">ACCESS DENIED</p>
					<h2>THE SEAL REMAINS.</h2>
					<p className="wl-app-subtitle">
						You have not yet been marked by the darkness.<br/>Seek out the hidden sigils before you present yourself.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="wl-application-section" id="whitelist-hunt">
			<div className="wl-app-container">
				<div className="wl-app-header">
					<p className="eyebrow" style={{ color: '#ff4d4d' }}>VERIFICATION</p>
					<h2>THE DARKNESS ACCEPTS YOU.</h2>
					<p className="wl-app-subtitle" style={{ color: '#aaa' }}>
						You carry the Mark: <span style={{ color: '#ff4d4d', letterSpacing: '2px', fontFamily: '"Space Mono", monospace' }}>{markCode}</span>.<br/>
						Now, prove your allegiance.
					</p>
				</div>

				<div style={{ marginTop: '1rem', marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ff4d4d', background: 'rgba(255,77,77,0.05)', textAlign: 'center', borderRadius: '4px' }}>
					<p className="eyebrow" style={{ color: '#ff4d4d', marginBottom: '1rem' }}>
						{timeLeft.isPreLaunch ? 'THE RECKONING BEGINS IN' : 'THE RECKONING ENDS IN'}
					</p>
					<div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontFamily: '"Space Mono", monospace', fontSize: '2rem', color: '#fff' }}>
						<div>
							<span>{String(timeLeft.hours).padStart(2, '0')}</span>
							<span style={{ fontSize: '0.8rem', color: '#777', display: 'block', textAlign: 'center' }}>HRS</span>
						</div>
						<span>:</span>
						<div>
							<span>{String(timeLeft.minutes).padStart(2, '0')}</span>
							<span style={{ fontSize: '0.8rem', color: '#777', display: 'block', textAlign: 'center' }}>MIN</span>
						</div>
						<span>:</span>
						<div>
							<span>{String(timeLeft.seconds).padStart(2, '0')}</span>
							<span style={{ fontSize: '0.8rem', color: '#777', display: 'block', textAlign: 'center' }}>SEC</span>
						</div>
					</div>
					<p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '1rem', letterSpacing: '1px' }}>
						Out of all who present their mark, 300 souls will be raffled for guaranteed whitelist.
					</p>
				</div>

				{!alreadyClaimed && (
					<div className="wl-tasks-section" style={{ border: '1px solid #333', background: 'rgba(5,5,5,0.6)' }}>
						<div className="wl-tasks-header" style={{ borderBottom: '1px solid #333' }}>
							<span>ALLEGIANCE</span>
						</div>
						
						<div className="wl-tasks-list" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
							<div className="wl-task-item" style={{ border: 'none', padding: 0 }}>
								<div className="wl-task-info">
									<h4 style={{ color: '#fff', fontSize: '1.1rem' }}>1. WEAR THE HOOD</h4>
									<p style={{ color: '#777', fontSize: '0.9rem', marginTop: '0.5rem' }}>Change your X/Twitter profile picture to the official Hood avatar.</p>
								</div>
								<a 
									href="/images/haunting-hoods-main-character.png" 
									download 
									className="wl-task-btn"
									style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
								>
									DOWNLOAD
								</a>
							</div>
							
							<div className="wl-task-item" style={{ border: 'none', padding: 0 }}>
								<div className="wl-task-info">
									<h4 style={{ color: '#fff', fontSize: '1.1rem' }}>2. REVEAL YOUR MARK</h4>
									<p style={{ color: '#777', fontSize: '0.9rem', marginTop: '0.5rem' }}>Announce your arrival. Let the world know you have been chosen.</p>
								</div>
								<a 
									href={generateTweetIntent()} 
									target="_blank" 
									rel="noopener noreferrer" 
									className="wl-task-btn"
									style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
								>
									TWEET
								</a>
							</div>
						</div>
					</div>
				)}

				<div className="wl-details-section" style={{ marginTop: '2rem' }}>
					<div className="wl-details-header">
						<span>YOUR DETAILS</span>
					</div>
					
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '1rem', borderTop: 'none', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
						
						<div>
							<div className="wl-address-label" style={{ marginBottom: '0.5rem' }}>
								<strong>DISCORD USERNAME</strong>
							</div>
							<input 
								type="text" 
								className="wl-address-input" 
								placeholder="e.g. hauntinghood#1234" 
								value={discordUser}
								onChange={(e) => setDiscordUser(e.target.value)}
								disabled={alreadyClaimed || claiming}
							/>
						</div>

						<div>
							<div className="wl-address-label" style={{ marginBottom: '0.5rem' }}>
								<strong>X (TWITTER) HANDLE</strong>
							</div>
							<input 
								type="text" 
								className="wl-address-input" 
								placeholder="@username" 
								value={twitterHandle}
								onChange={(e) => setTwitterHandle(e.target.value)}
								disabled={alreadyClaimed || claiming}
							/>
						</div>

						<div>
							<div className="wl-address-label" style={{ marginBottom: '0.5rem' }}>
								<strong>TWEET URL</strong>
								<span>Proof of your revelation</span>
							</div>
							<input 
								type="url" 
								className="wl-address-input" 
								placeholder="https://x.com/..." 
								value={tweetUrl}
								onChange={(e) => setTweetUrl(e.target.value)}
								disabled={alreadyClaimed || claiming}
							/>
						</div>

						<div>
							<div className="wl-address-label" style={{ marginBottom: '0.5rem' }}>
								<strong>WALLET ADDRESS</strong>
								<span>where we drop the spoils</span>
							</div>
							<input 
								type="text" 
								className="wl-address-input" 
								placeholder="0x..." 
								value={walletAddress}
								onChange={(e) => setWalletAddress(e.target.value)}
								disabled={alreadyClaimed || claiming}
							/>
						</div>

					</div>
				</div>

				{claimError && <div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>{claimError}</div>}
				
				{alreadyClaimed ? (
					<div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #ff4d4d', background: 'rgba(255,77,77,0.05)', textAlign: 'center', borderRadius: '4px' }}>
						<h3 style={{ margin: 0, color: '#ff4d4d', letterSpacing: '2px', fontFamily: '"Space Mono", monospace' }}>VERIFICATION SUBMITTED ✓</h3>
						<p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>
							The Darkness acknowledges you.
						</p>
					</div>
				) : (
					<button 
						className="wl-submit-btn" 
						disabled={!discordUser || !twitterHandle || !tweetUrl || !walletAddress || claiming}
						onClick={() => submitVerification({ discordUser, twitterHandle, tweetUrl, walletAddress, markCode })}
					>
						{claiming ? 'SUBMITTING...' : 'SUBMIT VERIFICATION'} <span>✦</span>
					</button>
				)}
			</div>
		</section>
	);
}
