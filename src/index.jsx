import './utils/consoleLogger';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import UtilityPage from './components/Interface/Utility/UtilityPage';
import ArchivePanel from './components/Interface/Story/ArchivePanel';
import MarkCinematic from './components/Interface/Story/MarkCinematic';
import AdminDashboard from './components/Admin/AdminDashboard';
import WhitelistPage from './components/WhitelistPage';
import RewardsPage from './components/RewardsPage';
import { LORE_DATA } from './data/lore';
import { UTILITY_DATA } from './data/utility';
import { ROADMAP_DATA } from './data/roadmap';
import './style.css';
import BugReport from './components/Interface/BugReport/BugReport';
import UnsupportedGPU from './components/Interface/UnsupportedGPU';
import { checkGPUSupport, isWebGLError } from './utils/gpuDetection';
import { getConsoleMessages } from './utils/consoleLogger';
import useWhitelist from './hooks/useWhitelist';



function tryAutoCompatOnce() {
	try {
		const compat = window.compat;
		const mode =
			compat && typeof compat.getMode === 'function'
				? compat.getMode()
				: 'default';
		if (!compat || typeof compat.relaunchGL !== 'function') return;
		if (mode === 'gl') return; // already in compat
		if (localStorage.getItem('compatAutoTried') === '1') return;
		localStorage.setItem('compatAutoTried', '1');
		compat.relaunchGL();
	} catch (_e) {}
}

window.addEventListener(
	'webglcontextlost',
	() => {
		tryAutoCompatOnce();
	},
	true
);

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			showBugReport: false,
			isGPUError: false,
			gpuInfo: null,
			lastErrorMessage: null,
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error('[REACT_ERROR]', error);
		console.error('[REACT_ERROR_INFO]', errorInfo);
		this.setState({ lastErrorMessage: error?.message || String(error) });

		const consoleLogs = getConsoleMessages();
		const hasWebGLError = consoleLogs.some(
			(log) =>
				log.includes('WebGL') ||
				log.includes('context could not be created') ||
				log.includes('Failed to create')
		);

		const isErrorWebGL = isWebGLError(error);

		if (hasWebGLError || isErrorWebGL) {
			tryAutoCompatOnce();
			const gpuCheck = checkGPUSupport();
			if (!gpuCheck.isSupported) {
				this.setState({
					isGPUError: true,
					gpuInfo: gpuCheck,
				});
			}
		}
	}

	render() {
		if (this.state.hasError) {
			if (this.state.isGPUError && this.state.gpuInfo) {
				return (
					<UnsupportedGPU
						reason={this.state.gpuInfo.reason}
						gpuInfo={this.state.gpuInfo.gpuInfo}
					/>
				);
			}

			return (
				<div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
					<h1>Something went wrong</h1>
					{this.state.lastErrorMessage && (
						<p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
							{this.state.lastErrorMessage}
						</p>
					)}
					<p>Please refresh the app or report this issue.</p>
					<button
						onClick={() => this.setState({ showBugReport: true })}
						style={{
							marginTop: '12px',
							padding: '8px 16px',
							backgroundColor: '#4a4a4a',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Report bug
					</button>
					{this.state.showBugReport && (
						<BugReport
							onClose={() => this.setState({ showBugReport: false })}
						/>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}

const root = createRoot(document.querySelector('#root'));
const pathname = window.location.pathname;

const isGameRoute = pathname === '/game';
const isLoreRoute = pathname.startsWith('/lore');
const isUtilityRoute = pathname.startsWith('/utility');
const isRoadmapRoute = pathname.startsWith('/roadmap');
const isAdminRoute = pathname.startsWith('/admin');
const isWhitelistRoute = pathname.startsWith('/whitelist');
const isRewardsRoute = pathname.startsWith('/rewards');

const isInfoRoute = isLoreRoute || isUtilityRoute || isRoadmapRoute || isAdminRoute || isWhitelistRoute || isRewardsRoute;
const isLandingMode = !isGameRoute;

document.documentElement.classList.toggle('landing-mode', isLandingMode);
document.body.classList.toggle('landing-mode', isLandingMode);
document.querySelector('#root').classList.toggle('landing-mode', isLandingMode);

root.render(
	<React.StrictMode>
		<ErrorBoundary>
			{isGameRoute && (
				<div style={{
					position: 'fixed', inset: 0,
					background: '#080808',
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					color: '#f5f5f5',
					fontFamily: "'Lincoln Road Regular', Arial, sans-serif",
					textAlign: 'center',
					gap: '1.5rem',
				}}>
					<div style={{
						position: 'fixed', inset: 0, pointerEvents: 'none',
						background: 'radial-gradient(circle at center, transparent 40%, rgba(138, 3, 3, 0.18) 100%)',
					}} />
					<img src="/images/new-logo.png" alt="Haunting Hoods" style={{
						width: '90px', height: '90px', borderRadius: '50%',
						filter: 'grayscale(1)', opacity: 0.85,
						animation: 'pulse 5s ease-in-out infinite',
					}} />
					<div style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
						🔒
					</div>
					<h1 style={{
						fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 400,
						letterSpacing: '-0.04em', margin: 0,
					}}>THE HUNT IS SEALED.</h1>
					<p style={{ color: '#747474', fontSize: '0.9rem', letterSpacing: '0.1em', margin: 0, maxWidth: '380px', lineHeight: 1.7 }}>
						The Whitelist Hunt will be unsealed when the time comes.<br />Stay tuned.
					</p>
					<a href="/" style={{
						marginTop: '0.5rem', padding: '0.9rem 1.8rem',
						border: '1px solid #3a3a3a', color: '#f5f5f5',
						textDecoration: 'none', fontSize: '0.65rem',
						letterSpacing: '0.15em', transition: 'border-color 0.2s',
					}}
					onMouseEnter={e => e.target.style.borderColor = '#ff4d4d'}
					onMouseLeave={e => e.target.style.borderColor = '#3a3a3a'}
					>← RETURN TO HOME</a>
					<style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.03);opacity:1} }`}</style>
				</div>
			)}
			{isLoreRoute && <InfoPage data={LORE_DATA} />}
			{isUtilityRoute && <UtilityPage />}
			{isRoadmapRoute && <InfoPage data={ROADMAP_DATA} />}
			{isAdminRoute && <AdminDashboard />}
			{isWhitelistRoute && <WhitelistPage />}
			{isRewardsRoute && <RewardsPage />}
			{!isGameRoute && !isInfoRoute && <LandingPage />}
			
			{!isGameRoute && !isAdminRoute && (
				<>
					<ArchivePanel />
					<MarkCinematic />
				</>
			)}
		</ErrorBoundary>
	</React.StrictMode>
);
