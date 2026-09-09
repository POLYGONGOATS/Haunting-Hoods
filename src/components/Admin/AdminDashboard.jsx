import React, { useState, useEffect } from 'react';
import { getAllVerifications, updateVerificationStatus } from '../../firebase/whitelistService';

export default function AdminDashboard() {
	const [verifications, setVerifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (authorized) {
			fetchVerifications();
		}
	}, [authorized]);

	const fetchVerifications = async () => {
		setLoading(true);
		try {
			const data = await getAllVerifications();
			setVerifications(data);
		} catch (e) {
			console.error(e);
		}
		setLoading(false);
	};

	const handleStatusChange = async (markCode, newStatus) => {
		try {
			await updateVerificationStatus(markCode, newStatus);
			setVerifications(verifications.map(v => 
				v.id === markCode ? { ...v, status: newStatus } : v
			));
		} catch (e) {
			alert('Failed to update status.');
		}
	};

	if (!authorized) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#020202', color: '#ff4d4d', fontFamily: '"Space Mono", monospace' }}>
				<h2>ADMIN ACCESS</h2>
				<input 
					type="password" 
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="Enter secret"
					style={{ padding: '0.5rem', background: '#111', border: '1px solid #333', color: '#fff', marginTop: '1rem', textAlign: 'center' }}
					onKeyDown={e => {
						if (e.key === 'Enter' && password === 'haunting123') {
							setAuthorized(true);
						}
					}}
				/>
			</div>
		);
	}

	return (
		<div style={{ padding: '2rem', background: '#020202', minHeight: '100vh', color: '#f5f5f5', fontFamily: '"Space Mono", monospace' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
				<h1 style={{ color: '#ff4d4d', margin: 0 }}>THE MARK: VERIFICATIONS</h1>
				<a href="/" style={{ color: '#777', textDecoration: 'none' }}>← RETURN TO HOME</a>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : verifications.length === 0 ? (
				<p>No verifications submitted yet.</p>
			) : (
				<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
					<thead>
						<tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#777' }}>
							<th style={{ padding: '1rem' }}>MARK CODE</th>
							<th style={{ padding: '1rem' }}>DISCORD</th>
							<th style={{ padding: '1rem' }}>X (TWITTER)</th>
							<th style={{ padding: '1rem' }}>TWEET URL</th>
							<th style={{ padding: '1rem' }}>STATUS</th>
							<th style={{ padding: '1rem' }}>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{verifications.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)).map((v) => (
							<tr key={v.id} style={{ borderBottom: '1px solid #222' }}>
								<td style={{ padding: '1rem', color: '#ff4d4d' }}>{v.markCode}</td>
								<td style={{ padding: '1rem' }}>{v.discordUser}</td>
								<td style={{ padding: '1rem' }}>@{v.twitterHandle}</td>
								<td style={{ padding: '1rem' }}><a href={v.tweetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#55aaff' }}>View Tweet</a></td>
								<td style={{ padding: '1rem' }}>
									<span style={{ 
										padding: '0.2rem 0.5rem', 
										background: v.status === 'APPROVED' ? '#1a4a1a' : v.status === 'REJECTED' ? '#4a1a1a' : '#333',
										color: v.status === 'APPROVED' ? '#55ff55' : v.status === 'REJECTED' ? '#ff5555' : '#ccc',
										borderRadius: '4px'
									}}>
										{v.status}
									</span>
								</td>
								<td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
									<button 
										onClick={() => handleStatusChange(v.id, 'APPROVED')}
										style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: '1px solid #55ff55', color: '#55ff55', cursor: 'pointer' }}
									>
										APPROVE
									</button>
									<button 
										onClick={() => handleStatusChange(v.id, 'REJECTED')}
										style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: '1px solid #ff5555', color: '#ff5555', cursor: 'pointer' }}
									>
										REJECT
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
