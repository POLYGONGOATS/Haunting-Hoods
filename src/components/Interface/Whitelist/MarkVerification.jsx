import React from 'react';

export default function MarkVerification() {
	return (
		<section className="wl-application-section" id="whitelist-hunt">
			<div className="wl-app-container">
				<div className="wl-app-header">
					<p className="eyebrow">THE RECKONING</p>
					<h2>CLAIM YOUR MARK</h2>
					<p className="wl-app-subtitle">Only the worthy shall enter the New World.</p>
				</div>
				<div style={{ marginTop: '2rem', padding: '3rem 2rem', border: '1px solid #ff4d4d', background: 'rgba(255,77,77,0.05)', textAlign: 'center', borderRadius: '4px' }}>
					<h3 style={{ margin: 0, color: '#ff4d4d', letterSpacing: '2px', fontFamily: '"Space Mono", monospace', fontSize: '1.5rem', marginBottom: '1rem' }}>THE RECKONING HAS ENDED</h3>
					<p style={{ color: '#aaa', fontSize: '1rem', lineHeight: '1.8', margin: 0, marginBottom: '2rem' }}>
						The gates are now closed. The chosen souls will be announced soon.<br /><br />
						Missed this time? No worries.<br/>
						<strong style={{ color: '#fff', fontSize: '1.2rem', display: 'block', marginTop: '1rem' }}>Another hunt is live. This time, much bigger.</strong>
					</p>
					<a href="/the-seal-engine" className="wl-submit-btn" style={{ display: 'inline-block', textDecoration: 'none', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '1rem 2rem', fontFamily: '"Space Mono", monospace', letterSpacing: '2px', transition: 'all 0.3s ease' }}>
						ENTER THE SEAL ENGINE <span>✦</span>
					</a>
				</div>
			</div>
		</section>
	);
}
