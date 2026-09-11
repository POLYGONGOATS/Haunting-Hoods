import { useState, useEffect } from 'react';
import useWhitelist from '../../../hooks/useWhitelist';
import SigilPlacement from '../Story/SigilPlacement';
import './WhitelistApplication.css';

const tasks = [
	{ id: 1, title: 'Follow us', description: '@Haunting_Hoods', action: 'FOLLOW', url: 'https://x.com/intent/follow?screen_name=Haunting_Hoods' },
	{ id: 2, title: 'Like the pinned post', description: 'One tap', action: 'LIKE', url: 'https://x.com/intent/like?tweet_id=2098467154169393290' },
	{ id: 3, title: 'Repost', description: 'Spread the word', action: 'REPOST', url: 'https://x.com/intent/retweet?tweet_id=2098467154169393290' },
	{ id: 4, title: 'Leave a comment', description: 'Say which clan you seek', action: 'REPLY', url: 'https://x.com/intent/post?in_reply_to=2098467154169393290' },
	{ id: 5, title: 'Quote tweet', description: 'Tag humans you\'d drag into the darkness', action: 'QUOTE', url: 'https://x.com/intent/retweet?tweet_id=2098467154169393290' },
	{ id: 6, title: 'Join our Discord', description: 'Enter the Sanctum', action: 'JOIN', url: 'https://discord.gg/hauntinghoods' },
];

export default function WhitelistApplication() {
	const [completedTasks, setCompletedTasks] = useState([]);
	
	const {
		user, 
		connectTwitter, 
		walletAddress, 
		setWalletAddress, 
		discordUser,
		setDiscordUser,
		quoteTweetLink,
		setQuoteTweetLink,
		submitClaim, 
		claiming, 
		alreadyClaimed,
		claimResult,
		claimError
	} = useWhitelist();

	useEffect(() => {
		if (alreadyClaimed) {
			setCompletedTasks(tasks.map(t => t.id));
		}
	}, [alreadyClaimed]);

	const handleTaskClick = (id, url) => {
		if (url) window.open(url, '_blank', 'noopener,noreferrer');
		if (!completedTasks.includes(id)) {
			setCompletedTasks([...completedTasks, id]);
		}
	};

	return (
		<section className="wl-application-section" id="whitelist">
			<div className="wl-app-container">
				<div className="wl-app-header">
					<SigilPlacement spotId="whitelist-form" style={{position: 'absolute', top: '1rem', right: '1rem'}} />
					<p className="eyebrow">APPLICATION</p>
					<h2>SECURE YOUR SPOT.</h2>
					<p className="wl-app-subtitle">
						Four tasks on X, then drop your details. Spots are limited — finishing<br/>the tasks puts you on the list.
					</p>
				</div>

				<div className="wl-tasks-section">
					<div className="wl-tasks-header">
						<span>TASKS</span>
						<span className="wl-tasks-count"><span className="highlight">{completedTasks.length}</span> OF {tasks.length}</span>
					</div>
					
					<div className="wl-connect-twitter">
						<button 
							className={`wl-connect-btn ${user ? 'connected' : ''}`}
							onClick={user ? undefined : connectTwitter}
							disabled={user !== null}
						>
							{user 
								? `CONNECTED: @${user.user_metadata?.user_name || user.user_metadata?.preferred_username || user.user_metadata?.name || 'USER'}` 
								: 'CONNECT X (TWITTER)'
							}
						</button>
						{user && (
							<button 
								className="wl-disconnect-btn" 
								onClick={() => {
									useWhitelist.getState().disconnect();
									setCompletedTasks([]);
									setWalletAddress('');
									setDiscordUser('');
									if (setQuoteTweetLink) setQuoteTweetLink('');
								}}
								style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: '0.6rem', marginTop: '0.5rem', cursor: 'pointer', textDecoration: 'underline' }}
							>
								SIGN OUT
							</button>
						)}
					</div>

					<div className="wl-tasks-list">
						{tasks.map((task) => {
							const isCompleted = completedTasks.includes(task.id);
							return (
								<div className={`wl-task-item ${isCompleted ? 'completed' : ''}`} key={task.id}>
									<div className="wl-task-info">
										<h4>{task.title}</h4>
										<p>{task.description}</p>
									</div>
									{task.id === 5 ? (
										<div className="wl-quote-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
											{!isCompleted && user && (
												<button className="wl-task-btn" onClick={() => window.open(task.url, '_blank', 'noopener,noreferrer')}>QUOTE</button>
											)}
											<div style={{ display: 'flex', gap: '0.5rem' }}>
												<input 
													type="text" 
													className="wl-address-input" 
													style={{ padding: '0.5rem', minWidth: '200px', fontSize: '0.8rem' }}
													placeholder={user ? "Paste quote link..." : "Connect X first"}
													value={quoteTweetLink || ''}
													onChange={(e) => setQuoteTweetLink(e.target.value)}
													disabled={isCompleted || !user}
												/>
												{!isCompleted && user && (
													<button 
														className="wl-task-btn" 
														onClick={() => {
															if (quoteTweetLink && (quoteTweetLink.includes('x.com/') || quoteTweetLink.includes('twitter.com/'))) {
																setCompletedTasks([...completedTasks, task.id]);
															}
														}}
														disabled={!quoteTweetLink || !quoteTweetLink.trim()}
													>
														VERIFY
													</button>
												)}
												{isCompleted && (
													<button className="wl-task-btn done" disabled>DONE</button>
												)}
											</div>
										</div>
									) : (
										<button 
											className={`wl-task-btn ${isCompleted ? 'done' : ''}`}
											onClick={() => handleTaskClick(task.id, task.url)}
											disabled={isCompleted || !user}
										>
											{isCompleted ? 'DONE' : (user ? task.action : 'CONNECT X FIRST')}
										</button>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className="wl-details-section">
					<div className="wl-details-header">
						<span>YOUR DETAILS</span>
					</div>
					
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '0', borderTop: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<div>
							<div className="wl-address-label" style={{ marginBottom: '0.5rem' }}>
								<strong>DISCORD USERNAME</strong>
								<span>Enter the Sanctum</span>
							</div>
							<input 
								type="text" 
								className="wl-address-input" 
								placeholder={completedTasks.length < tasks.length ? "Complete tasks first..." : "e.g. hauntinghood#1234"} 
								value={discordUser}
								onChange={(e) => setDiscordUser(e.target.value)}
								disabled={alreadyClaimed || claiming || completedTasks.length < tasks.length || !user}
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
								placeholder={completedTasks.length < tasks.length ? "Complete tasks first..." : "Submit your ETH address..."} 
								value={walletAddress}
								onChange={(e) => setWalletAddress(e.target.value)}
								disabled={alreadyClaimed || claiming || completedTasks.length < tasks.length || !user}
							/>
						</div>
					</div>
				</div>

				{claimError && <div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>{claimError}</div>}
				
				{alreadyClaimed ? (
					<button className="wl-submit-btn claimed" disabled>
						APPLICATION SUBMITTED <span>✓</span>
					</button>
				) : (
					<button 
						className="wl-submit-btn" 
						disabled={completedTasks.length < tasks.length || !user || !walletAddress.trim() || !discordUser.trim() || claiming}
						onClick={() => submitClaim(null)}
					>
						{claiming ? 'SUBMITTING...' : 'APPLY FOR WHITELIST'} <span>✦</span>
					</button>
				)}
				<SigilPlacement spotId="whitelist-footer" style={{marginTop: '2rem', display: 'block', textAlign: 'center'}} />
			</div>
		</section>
	);
}
