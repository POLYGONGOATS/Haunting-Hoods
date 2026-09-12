import React, { useState, useEffect } from 'react';
import useMarkVerification from '../../../hooks/useMarkVerification';
import useSigils from '../../../hooks/useSigils';
import './WhitelistApplication.css';

const AVATARS = [
	'2685.png', '3333.png', '3421.png', '3934.png', 
	'4026.png', '4247.png', '3537.png', '426.png', 
	'568.png', '596.png', '982.png', '843.png'
];

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

	const [showAvatarSelection, setShowAvatarSelection] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState(null);

	const hasMark = collectedSigils.length >= 4 && markCode;

	useEffect(() => {
		const START_TIME = new Date('2026-09-11T23:00:00+05:30').getTime();
		const END_TIME = START_TIME + 24 * 60 * 60 * 1000;

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
		const collectedCount = collectedSigils ? Math.min(collectedSigils.length, 4) : 0;
		const progressPercentage = (collectedCount / 4) * 100;
		
		return (
			<section className="wl-application-section" id="whitelist-hunt" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<div className="wl-app-container" style={{ 
					textAlign: 'center', 
					padding: '5rem 2rem', 
					border: '1px solid rgba(255, 77, 77, 0.15)', 
					background: 'radial-gradient(circle at center, rgba(30, 5, 5, 0.8) 0%, rgba(5, 2, 2, 0.95) 100%)',
					boxShadow: '0 0 60px rgba(255, 0, 0, 0.03) inset',
					position: 'relative',
					overflow: 'hidden',
					maxWidth: '800px',
					width: '100%'
				}}>
					<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.02, fontSize: '24rem', pointerEvents: 'none', filter: 'blur(4px)' }}>
						<img src="/images/new-logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
					</div>
					
					<p className="eyebrow" style={{ color: '#ff4d4d', letterSpacing: '4px', marginBottom: '1.5rem', opacity: 0.8 }}>
						FIND AT LEAST 4 HIDDEN SIGILS, THEN THIS WILL BE ACCESSIBLE
					</p>
					
					<h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', textShadow: '0 0 30px rgba(255, 77, 77, 0.15)', letterSpacing: '-1px', color: '#e0e0e0' }}>
						THE SEAL REMAINS.
					</h2>
					
					<div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, #ff4d4d, transparent)', margin: '2.5rem auto', opacity: 0.5 }} />
					
					<p className="wl-app-subtitle" style={{ fontSize: '1.1rem', color: '#888', maxWidth: '500px', margin: '0 auto', lineHeight: '1.8' }}>
						You have not yet been fully marked by the darkness.<br/>
						<span style={{ color: '#aaa' }}>The seal will only break once all fragments are united.</span>
					</p>
					
					<p style={{ marginTop: '1.5rem', color: '#ff4d4d', fontSize: '0.85rem', fontStyle: 'italic', letterSpacing: '1px', opacity: 0.9 }}>
						HINT: Explore every single corner of our realm. You will find them all.
					</p>

					<div style={{ marginTop: '3.5rem', marginBottom: '1rem', maxWidth: '400px', margin: '3.5rem auto 1rem' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#ff4d4d', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>
							<span>SIGILS FOUND</span>
							<span>{collectedCount} / 4</span>
						</div>
						<div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
							<div style={{ 
								height: '100%', 
								width: `${progressPercentage}%`, 
								background: 'linear-gradient(90deg, #8a0303, #ff4d4d)',
								boxShadow: '0 0 10px #ff4d4d',
								transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
							}} />
						</div>
					</div>

					<div style={{ marginTop: '3rem' }}>
						<a href="/utility" style={{
							display: 'inline-block',
							padding: '1rem 2.5rem',
							border: '1px solid rgba(255, 77, 77, 0.4)',
							color: '#ff4d4d',
							textDecoration: 'none',
							fontSize: '0.8rem',
							letterSpacing: '3px',
							transition: 'all 0.3s ease',
							background: 'rgba(255, 77, 77, 0.05)',
							textTransform: 'uppercase'
						}}
						onMouseEnter={(e) => {
							e.target.style.background = 'rgba(255, 77, 77, 0.15)';
							e.target.style.boxShadow = '0 0 20px rgba(255, 77, 77, 0.2)';
						}}
						onMouseLeave={(e) => {
							e.target.style.background = 'rgba(255, 77, 77, 0.05)';
							e.target.style.boxShadow = 'none';
						}}
						>
							RETURN TO HUNT
						</a>
					</div>
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

				<div style={{ marginTop: '2rem', padding: '3rem 2rem', border: '1px solid #ff4d4d', background: 'rgba(255,77,77,0.05)', textAlign: 'center', borderRadius: '4px' }}>
					<h3 style={{ margin: 0, color: '#ff4d4d', letterSpacing: '2px', fontFamily: '"Space Mono", monospace', fontSize: '1.5rem', marginBottom: '1rem' }}>THE RECKONING HAS ENDED</h3>
					<p style={{ color: '#aaa', fontSize: '1rem', lineHeight: '1.8', margin: 0 }}>
						The gates are now closed. The chosen 300 souls will be announced soon.<br /><br />
						Stay vigilant. More hunts are coming.
					</p>
				</div>
			</div>

			{showAvatarSelection && (
				<div style={{
					position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
					background: 'rgba(5, 2, 2, 0.95)', zIndex: 9999, 
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					padding: '2rem'
				}}>
					<div style={{
						background: '#111', border: '1px solid rgba(255, 77, 77, 0.3)', 
						borderRadius: '8px', padding: '2rem', maxWidth: '800px', width: '100%',
						maxHeight: '90vh', overflowY: 'auto',
						boxShadow: '0 0 50px rgba(0,0,0,0.8)'
					}}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
							<div>
								<h3 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.5rem', letterSpacing: '2px', fontFamily: '"Space Mono", monospace' }}>CHOOSE YOUR HOOD</h3>
								<p style={{ margin: 0, color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>Select an avatar to download and use for your profile.</p>
							</div>
							<button onClick={() => setShowAvatarSelection(false)} style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
						</div>
						
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.5rem' }}>
							{AVATARS.map((avatar) => (
								<div 
									key={avatar}
									onClick={() => setSelectedAvatar(avatar)}
									style={{
										border: selectedAvatar === avatar ? '2px solid #ff4d4d' : '2px solid #333',
										borderRadius: '4px', cursor: 'pointer', overflow: 'hidden',
										transition: 'all 0.2s ease', opacity: selectedAvatar === avatar ? 1 : 0.6,
										boxShadow: selectedAvatar === avatar ? '0 0 15px rgba(255, 77, 77, 0.4)' : 'none'
									}}
									onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
									onMouseLeave={(e) => e.currentTarget.style.opacity = selectedAvatar === avatar ? '1' : '0.6'}
								>
									<img src={`/images/avatars/${avatar}`} alt="Hood Avatar" style={{ width: '100%', display: 'block' }} />
								</div>
							))}
						</div>
						
						<div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
							<button 
								onClick={() => setShowAvatarSelection(false)}
								style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid #555', color: '#aaa', cursor: 'pointer', letterSpacing: '1px', fontFamily: '"Space Mono", monospace' }}
							>
								CANCEL
							</button>
							{selectedAvatar && (
								<a 
									href={`/images/avatars/${selectedAvatar}`} 
									download 
									onClick={() => setShowAvatarSelection(false)}
									style={{ padding: '0.8rem 1.5rem', background: '#ff4d4d', border: 'none', color: '#000', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', fontFamily: '"Space Mono", monospace' }}
								>
									DOWNLOAD SELECTED
								</a>
							)}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
