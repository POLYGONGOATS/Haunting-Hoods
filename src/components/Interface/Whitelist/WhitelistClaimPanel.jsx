import { useEffect, useState } from 'react';
import useWhitelist, { CLAIM_ERRORS } from '../../../hooks/useWhitelist';
import './WhitelistClaimPanel.css';

const ERROR_MESSAGES = {
	[CLAIM_ERRORS.ALREADY_CLAIMED]: 'You already claimed a whitelist spot.',
	[CLAIM_ERRORS.CAMPAIGN_INACTIVE]: 'No whitelist hunt is active right now.',
	[CLAIM_ERRORS.SOLD_OUT]: 'All spots for today are gone. Come back tomorrow!',
	[CLAIM_ERRORS.WRONG_CODE]: 'That code is incorrect. Check the wall again.',
	[CLAIM_ERRORS.MISSING_WALLET]: 'Please enter your wallet address.',
	NOT_SIGNED_IN: 'Connect your Twitter/X account first.',
	TWITTER_SIGNIN_FAILED: 'Twitter sign-in failed. Please try again.',
	UNKNOWN: 'Something went wrong. Please try again.',
};

export default function WhitelistClaimPanel() {
	const isOpen = useWhitelist((state) => state.isClaimPanelOpen);
	const closeClaimPanel = useWhitelist((state) => state.closeClaimPanel);
	const user = useWhitelist((state) => state.user);
	const connectTwitter = useWhitelist((state) => state.connectTwitter);
	const walletAddress = useWhitelist((state) => state.walletAddress);
	const setWalletAddress = useWhitelist((state) => state.setWalletAddress);
	const submitClaim = useWhitelist((state) => state.submitClaim);
	const claiming = useWhitelist((state) => state.claiming);
	const claimError = useWhitelist((state) => state.claimError);
	const claimResult = useWhitelist((state) => state.claimResult);
	const campaign = useWhitelist((state) => state.campaign);
	const requiresCode = useWhitelist((state) => state.claimPanelRequiresCode);
	const [code, setCode] = useState('');

	useEffect(() => {
		if (!isOpen) setCode('');
	}, [isOpen]);

	if (!isOpen) return null;

	const slotsRemaining = campaign
		? Math.max((campaign.slotsTotal || 0) - (campaign.claimedCount || 0), 0)
		: 0;

	return (
		<div className="whitelist-panel-overlay" onClick={closeClaimPanel}>
			<div
				className="whitelist-panel"
				onClick={(event) => event.stopPropagation()}
			>
				<button className="whitelist-panel-close" onClick={closeClaimPanel}>
					×
				</button>

				<h2>Claim Your Whitelist Spot</h2>

				{claimResult ? (
					<div className="whitelist-success">
						<p>You're in! 🎉</p>
						<p>
							You are claim #{claimResult.claimNumber} of{' '}
							{claimResult.slotsTotal} today.
						</p>
					</div>
				) : (
					<>
						<p className="whitelist-slots">
							{slotsRemaining} of {campaign?.slotsTotal || 0} spots left today
						</p>

						<div className="whitelist-step">
							<span className="whitelist-step-label">1. Connect Twitter/X</span>
							{user ? (
								<span className="whitelist-connected">
									Connected as @
									{user.reloadUserInfo?.screenName || user.displayName}
								</span>
							) : (
								<button onClick={connectTwitter}>Connect Twitter</button>
							)}
						</div>

						<div className="whitelist-step">
							<span className="whitelist-step-label">2. Wallet address</span>
							<input
								type="text"
								placeholder="0x..."
								value={walletAddress}
								onChange={(event) => setWalletAddress(event.target.value)}
							/>
						</div>

						{requiresCode && (
							<div className="whitelist-step">
								<span className="whitelist-step-label">
									3. Code from the wall
								</span>
								<input
									type="text"
									placeholder="Enter the code you found"
									value={code}
									onChange={(event) => setCode(event.target.value)}
								/>
							</div>
						)}

						{claimError && (
							<p className="whitelist-error">
								{ERROR_MESSAGES[claimError] || ERROR_MESSAGES.UNKNOWN}
							</p>
						)}

						<button
							className="whitelist-submit"
							disabled={claiming || !user}
							onClick={() => submitClaim(code)}
						>
							{claiming ? 'Claiming...' : 'Claim Spot'}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
