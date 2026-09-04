import { useState, useEffect } from 'react';
import useWhitelist from '../../../hooks/useWhitelist';
import './WhitelistApplication.css';

const tasks = [
	{ id: 1, title: 'Follow us', description: '@Haunting_Hoods', action: 'FOLLOW', url: 'https://x.com/intent/follow?screen_name=Haunting_Hoods' },
	{ id: 2, title: 'Like the pinned post', description: 'One tap', action: 'LIKE', url: 'https://x.com/intent/like?tweet_id=2095494665466237398' },
	{ id: 3, title: 'Leave a comment', description: 'Say which clan you seek', action: 'REPLY', url: 'https://x.com/intent/post?in_reply_to=2095494665466237398' },
	{ id: 4, title: 'Quote tweet', description: 'Tag humans you\'d drag into the darkness', action: 'QUOTE', url: 'https://x.com/intent/retweet?tweet_id=2095494665466237398' },
];

export default function WhitelistApplication() {
	const [completedTasks, setCompletedTasks] = useState([]);
	
		user, 
		connectTwitter, 
		walletAddress, 
		setWalletAddress, 
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
					<p className="eyebrow">APPLICATION</p>
					<h2>SECURE YOUR SPOT.</h2>
					<p className="wl-app-subtitle">
						Four tasks on X, then drop your details. Spots are limited — finishing<br/>the tasks puts you on the list.
					</p>
				</div>

				<div className="wl-tasks-section">
					<div className="wl-tasks-header">
						<span>TASKS</span>
						<span className="wl-tasks-count"><span className="highlight">{completedTasks.length}</span> OF 4</span>
					</div>
					
					<div className="wl-connect-twitter">
						<button 
							className={`wl-connect-btn ${user ? 'connected' : ''}`}
							onClick={user ? undefined : connectTwitter}
							disabled={user !== null}
						>
							{user 
								? `CONNECTED: @${user.reloadUserInfo?.screenName || user.displayName || 'USER'}` 
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
									{task.id === 4 ? (
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
					
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '0', borderTop: 'none' }}>
						<div className="wl-address-label">
							<strong>WALLET ADDRESS</strong>
							<span>where we drop the spoils</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder={completedTasks.length < 4 ? "Complete tasks first..." : "Submit your ETH address..."} 
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							disabled={alreadyClaimed || claiming || completedTasks.length < 4 || !user}
						/>
					</div>
				</div>

				{claimError && <div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>{claimError}</div>}
				
				{alreadyClaimed ? (
					<button className="wl-submit-btn claimed" disabled>
						APPLICATION SUBMITTED {claimResult && `(#${claimResult.claimNumber})`} <span>✓</span>
					</button>
				) : (
					<button 
						className="wl-submit-btn" 
						disabled={completedTasks.length < 4 || !user || !walletAddress.trim() || claiming}
						onClick={() => submitClaim(null)}
					>
						{claiming ? 'SUBMITTING...' : 'APPLY FOR WHITELIST'} <span>✦</span>
					</button>
				)}
			</div>
		</section>
	);
}
