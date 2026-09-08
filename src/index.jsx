import './utils/consoleLogger';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import UtilityPage from './components/Interface/Utility/UtilityPage';
import { LORE_DATA } from './data/lore';
import { UTILITY_DATA } from './data/utility';
import { ROADMAP_DATA } from './data/roadmap';
import './style.css';
import BugReport from './components/Interface/BugReport/BugReport';
import UnsupportedGPU from './components/Interface/UnsupportedGPU';
import { checkGPUSupport, isWebGLError } from './utils/gpuDetection';
import { getConsoleMessages } from './utils/consoleLogger';
import useWhitelist from './hooks/useWhitelist';

useWhitelist.getState().init();

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

const isInfoRoute = isLoreRoute || isUtilityRoute || isRoadmapRoute;
const isLandingMode = !isGameRoute;

document.documentElement.classList.toggle('landing-mode', isLandingMode);
document.body.classList.toggle('landing-mode', isLandingMode);
document.querySelector('#root').classList.toggle('landing-mode', isLandingMode);

root.render(
	<React.StrictMode>
		<ErrorBoundary>
			{isGameRoute && <App />}
			{isLoreRoute && <InfoPage data={LORE_DATA} />}
			{isUtilityRoute && <UtilityPage />}
			{isRoadmapRoute && <InfoPage data={ROADMAP_DATA} />}
			{!isGameRoute && !isInfoRoute && <LandingPage />}
		</ErrorBoundary>
	</React.StrictMode>
);
