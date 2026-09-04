import { useState, useEffect } from 'react';
import useWhitelist from '../../../hooks/useWhitelist';
import './WhitelistApplication.css';

const tasks = [
	{ id: 1, title: 'Follow us', description: '@Haunting_Hoods', action: 'FOLLOW', url: 'https://x.com/intent/follow?screen_name=Haunting_Hoods' },
	{ id: 2, title: 'Like the pinned post', description: 'One tap', action: 'LIKE', url: 'https://x.com/intent/like?tweet_id=2095880792765497711' },
	{ id: 3, title: 'Repost', description: 'Spread the word', action: 'REPOST', url: 'https://x.com/intent/retweet?tweet_id=2095880792765497711' },
	{ id: 4, title: 'Leave a comment', description: 'Say which clan you seek', action: 'REPLY', url: 'https://x.com/intent/post?in_reply_to=2095880792765497711' },
	{ id: 5, title: 'Quote tweet', description: 'Tag humans you\'d drag into the darkness', action: 'QUOTE', url: 'https://x.com/intent/retweet?tweet_id=2095880792765497711' },
];

export default function WhitelistApplication() {
	const [completedTasks, setCompletedTasks] = useState([]);
	
	const {
		twitterHandle, 
		setTwitterHandle, 
		walletAddress, 
		setWalletAddress, 
		quoteTweetLink,
		setQuoteTweetLink,
		submitClaim, 
		claiming, 
		claimResult,
		claimError
	} = useWhitelist();

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
						<span className="wl-tasks-count"><span className="highlight">{completedTasks.length}</span> OF 5</span>
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
											{!isCompleted && (
												<button className="wl-task-btn" onClick={() => window.open(task.url, '_blank', 'noopener,noreferrer')}>QUOTE</button>
											)}
											<div style={{ display: 'flex', gap: '0.5rem' }}>
												<input 
													type="text" 
													className="wl-address-input" 
													style={{ padding: '0.5rem', minWidth: '200px', fontSize: '0.8rem' }}
													placeholder="Paste quote link..."
													value={quoteTweetLink || ''}
													onChange={(e) => setQuoteTweetLink(e.target.value)}
													disabled={isCompleted}
												/>
												{!isCompleted && (
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
											disabled={isCompleted}
										>
											{isCompleted ? 'DONE' : task.action}
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
							<strong>TWITTER USERNAME</strong>
							<span>so we can verify your tasks</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder={completedTasks.length < 5 ? "Complete tasks first..." : "@username"} 
							value={twitterHandle}
							onChange={(e) => setTwitterHandle(e.target.value)}
							disabled={claimResult || claiming || completedTasks.length < 5}
						/>
					</div>

					<div className="wl-address-input-group" style={{ borderTop: '1px solid rgba(255, 77, 77, 0.1)', marginTop: '1rem', paddingTop: '1rem' }}>
						<div className="wl-address-label">
							<strong>WALLET ADDRESS</strong>
							<span>where we drop the spoils</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder={completedTasks.length < 5 ? "Complete tasks first..." : "Submit your ETH address..."} 
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							disabled={claimResult || claiming || completedTasks.length < 5}
						/>
					</div>
				</div>

				{claimError && <div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>{claimError}</div>}
				
				{claimResult ? (
					<button className="wl-submit-btn claimed" disabled>
						APPLICATION SUBMITTED <span>✓</span>
					</button>
				) : (
					<button 
						className="wl-submit-btn" 
						disabled={completedTasks.length < 5 || !twitterHandle.trim() || !walletAddress.trim() || claiming}
						onClick={() => submitClaim(null)}
					>
						{claiming ? 'SUBMITTING...' : 'APPLY FOR WHITELIST'} <span>✦</span>
					</button>
				)}
			</div>
		</section>
	);
}
