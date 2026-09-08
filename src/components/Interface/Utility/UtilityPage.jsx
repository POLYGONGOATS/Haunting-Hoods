import React, { useEffect, useState, useRef } from 'react';
import './UtilityPage.css';
import ScrambledText from './ScrambledText';

export default function UtilityPage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    
    // To handle scroll progress bar
    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h > 0) {
                setScrollProgress((window.scrollY / h) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const jumpTo = (i) => {
        if (i === 3) scrollToId('s01');
        else if (i === 5) scrollToId('s02');
        else if (i === 7) scrollToId('s03');
        else if (i === 8) scrollToId('s05');
        else if (i === 9) scrollToId('s06');
        else if (i === 10) scrollToId('s06');
        else if (i === 13) scrollToId('journey');
        else scrollToId('journey');
    };

    // Helper component for expandable sections
    const ExpandableSection = ({ id, number, eyebrow, title, children }) => {
        const [isOpen, setIsOpen] = useState(false);
        
        return (
            <article className={`section ${isOpen ? 'open' : ''}`} id={id}>
                <div className="section-head">
                    <span className="number">{number}</span>
                    <div>
                        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
                        <h2>{title}</h2>
                    </div>
                </div>
                <div className="section-body">
                    {children}
                </div>
            </article>
        );
    };

    return (
        <div className="utility-page-wrapper">
            <nav>
                <div className="navin">
                    <a href="/" className="brand">
                        <img src="/images/new-logo.png" alt="Haunting Hoods" />
                        HAUNTING HOODS
                    </a>
                    <div className="progress">
                        <div className="bar" style={{ width: `${scrollProgress}%` }}></div>
                    </div>
                    <a href="/" style={{color: 'white', textDecoration: 'none', fontSize: '12px', fontFamily: '"Space Mono", monospace', fontWeight: 'bold'}}>← RETURN TO HOME</a>
                </div>
            </nav>

            <main className="wrap">
                <section className="hero">
                    <img className="hero-logo" src="/images/new-logo.png" alt="Hero Logo" />
                    <div className="kicker">UTILITY</div>
                    <h1>THE NEW WORLD<br/>BEGINS.</h1>
                    <p>4444 Hoods. One broken Seal. An evolving ecosystem built around lore, competition, Factions, an on-chain economy and future projects under the Haunting Hoods IP.</p>
                    <button className="cta" onClick={() => scrollToId('utility')}>ENTER</button>
                </section>

                <section id="utility">
                    <div className="utility-intro">
                        <div className="section">
                            <div className="section-head">
                                <span className="number">HH</span>
                                <div>
                                    <h2>HAUNTING HOODS</h2>
                                </div>
                            </div>
                            <div className="section-body">
                                <p><strong>4444 HOODS</strong><br/><strong>ONE BROKEN SEAL</strong><br/><strong>ONE WORLD WAITING TO FALL</strong></p>
                                <p>Haunting Hoods is not designed to be just another NFT collection.</p>
                                <p>The 4444 Hoods are the foundation of an evolving world built around lore, competition, Factions, an on-chain economy and future projects under the Haunting Hoods IP.</p>
                                <p><strong>YOUR HOOD IS YOUR ENTRY INTO THE WORLD.</strong></p>
                            </div>
                        </div>
                    </div>

                    <ExpandableSection id="s01" number="01" title="THE RECKONING">
                        <p>Once the Hoods enter the world, every Hood will receive its own set of Reckoning Quests.</p>
                        <p>The quests are directly connected to the lore and the Hoods' mission to bring about the destruction of the world.</p>
                        <p>QUESTS: <ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText><br/>REQUIREMENTS: <ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText><br/>REWARDS: <ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>There is no deadline.</p>
                        <p>But speed matters.</p>
                        <p>The earlier a Hood completes its Reckoning, the greater its potential edge when the New World begins.</p>
                        <p>And there is one final objective:</p>
                        <p>THE FIRST HOOD TO COMPLETE<br/>ITS ENTIRE RECKONING WILL TRIGGER</p>
                        <p>☠️ THE APOCALYPSE.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s02" number="02" title="THE APOCALYPSE">
                        <p>The Apocalypse marks the end of the beginning.</p>
                        <p>Once the first Hood completes its mission, the next phase of Haunting Hoods begins.</p>
                        <p>THE TOKEN LAUNCHES.<br/>STAKING BEGINS.<br/>THE NEW WORLD FORMS.</p>
                        <p>The old world falls.</p>
                        <p>The Hoods are no longer prisoners.</p>
                        <p>They are now free to decide<br/>what comes next.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s03" number="03" title="THE FACTIONS">
                        <p>The 4444 Hoods will be divided into:</p>
                        <p>11 FACTIONS<br/>404 HOODS PER FACTION</p>
                        <p>But not everyone gets to choose whenever they want.</p>
                        <p>The order matters.</p>
                        <p>The faster your Hood completes its Reckoning, the earlier your opportunity to choose your Faction.</p>
                        <p>Once a Faction reaches 404 Hood:</p>
                        <p>THE CHOICE IS GONE.</p>
                        <p>Choose carefully.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s04" number="04" title="FACTION LEADERSHIP">
                        <p>Every Faction will have:</p>
                        <p>01 GENERAL<br/>02 WARDENS</p>
                        <p>The holder with the highest number of Hoods from that Faction at the seasonal snapshot becomes General.</p>
                        <p>The second-highest becomes a Warden.</p>
                        <p>The third-highest becomes the other Warden.</p>
                        <p>But leadership is never permanent.</p>
                        <p>Every season brings a new snapshot.</p>
                        <p>Every season can create new leaders.</p>
                        <p>OWNERSHIP.<br/>PARTICIPATION.<br/>STRATEGY.</p>
                        <p>THE BALANCE CAN ALWAYS CHANGE.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s05" number="05" title="OG PASS">
                        <p>Not everyone entered this world with the same clearance.</p>
                        <p>OG Pass holders will carry their own place within the Faction system.</p>
                        <p>OG CLEARANCE: ACTIVE<br/>FACTION AUTHORITY: <ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText><br/>OG POWERS: <ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>The full extent of the OG Pass will be revealed when the Factions form.</p>
                        <p>For now, one thing is confirmed:</p>
                        <p>THE OG PASS WILL HAVE A ROLE<br/>IN THE NEW WORLD.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s06" number="06" title="FACTION WARS">
                        <p>Once the Factions are formed, the competition begins.</p>
                        <p>Each season becomes a new battle between the 11 Factions.</p>
                        <p>Your Faction's performance matters.</p>
                        <p>Your Hood's participation matters.</p>
                        <p>Simply owning a Hood will not automatically make it eligible for seasonal rewards.</p>
                        <p>To participate, your Hood must be activated for the relevant season.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s07" number="07" title="SEASONAL ACTIVATION">
                        <p>To activate your Hood:</p>
                        <p>◆ STAKE YOUR HOOD<br/>◆ BURN THE REQUIRED AMOUNT OF<br/>   HAUNTING HOODS TOKENS</p>
                        <p>Once activated, your Hood can participate in the Faction Wars.</p>
                        <p>The activities, requirements and exact amounts will be revealed when the system goes live.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s08" number="08" title="SEASONS & REWARDS">
                        <p>At the end of every season, the 11 Factions are ranked.</p>
                        <p>A seasonal reward pool will be distributed in the Haunting Hoods token.</p>
                        <p>Your Faction's final ranking matters.</p>
                        <p>Your individual activity matters.</p>
                        <p>The exact reward calculation:</p>
                        <p><ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>The minimum participation threshold:</p>
                        <p><ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>Certain states make a Hood ineligible.</p>
                        <p>LISTED: INELIGIBLE<br/>UNSTAKED: INELIGIBLE<br/>INACTIVE: INELIGIBLE</p>
                        <p>Then:</p>
                        <p>REWARDS ARE DISTRIBUTED.<br/>THE LEADERBOARD RESETS.<br/>THE NEXT SEASON BEGINS.</p>
                        <p>SEASON 01<br/>↓<br/>RESET<br/>↓<br/>SEASON 02<br/>↓<br/>RESET<br/>↓<br/>SEASON 03<br/>↓<br/>...</p>
                        <p>EVERY SEASON IS ANOTHER CHANCE<br/>TO CHANGE THE BALANCE OF POWER.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s09" number="09" title="THE HOODS ECONOMY">
                        <p>The Haunting Hoods token is designed to power the ecosystem.</p>
                        <p>It isn't simply something to hold.</p>
                        <p>It can be:</p>
                        <p>EARNED.<br/>SPENT.<br/>BURNED.<br/>BOUGHT.<br/>SOLD.<br/>USED.</p>
                        <p>Token utility can connect to:</p>
                        <p>◆ Hood activation<br/>◆ Staking<br/>◆ Faction participation<br/>◆ Competitive mechanics<br/>◆ Seasonal rewards<br/>◆ Future utilities<br/>◆ Additional ecosystem systems</p>
                        <p>THE EXACT SUPPLY.<br/>THE EXACT QUANTITIES.<br/>THE EXACT FEES.</p>
                        <p><ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                    </ExpandableSection>

                    <ExpandableSection id="s10" number="10" title="BUYBACKS">
                        <p>A portion of eligible royalties generated by Haunting Hoods will contribute toward token buybacks.</p>
                        <p>And the original collection is only the beginning.</p>
                        <p>As new projects, products, experiences and ventures are developed under the Haunting Hoods IP, future revenue may also contribute toward token buybacks.</p>
                        <p>THE EXACT STRUCTURE:</p>
                        <p><ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>The goal is simple:</p>
                        <p>VALUE GENERATED BY THE ECOSYSTEM<br/>FLOWS BACK INTO THE ECOSYSTEM.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s11" number="11" title="OWNERSHIP">
                        <p>A Hood changing hands changes its seasonal status.</p>
                        <p>When a Hood is transferred, it becomes inactive.</p>
                        <p>The new holder must activate the Hood again for the relevant season if they want to participate.</p>
                        <p>But the Reckoning is different.</p>
                        <p>Once the Reckoning Questline has been completed, it is permanent.</p>
                        <p>THE QUEST IS COMPLETED ONCE.</p>
                        <p>SEASONAL ACTIVATION IS SEPARATE.</p>
                    </ExpandableSection>

                    <ExpandableSection id="s12" number="12" title="THE FUTURE">
                        <p>The 4444 Hoods are the foundation.</p>
                        <p>They are not the destination.</p>
                        <p>Haunting Hoods is being built as an IP and ecosystem designed to keep expanding.</p>
                        <p>Future projects, products, experiences, collaborations and additional mechanics may introduce new ways to interact with the Haunting Hoods universe.</p>
                        <p>Future opportunities may include:</p>
                        <p>◆ Whitelist spots<br/>◆ Allocations<br/>◆ Partner NFTs<br/>◆ Early access<br/>◆ Special benefits<br/>◆ Future ecosystem rewards</p>
                        <p>The exact benefits and mechanics:</p>
                        <p><ScrambledText scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120}>[ REDACTED ]</ScrambledText></p>
                        <p>THE ROADMAP IS NOT STATIC.</p>
                        <p>The systems introduced today are the foundation, not the ceiling.</p>
                    </ExpandableSection>
                </section>

                <section className="map" id="journey">
                    <div className="map-title">THE JOURNEY</div>
                    <div className="flow">
                        <button className="flow-node" onClick={() => jumpTo(0)}><span>01</span>THE SEAL WEAKENS</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(1)}><span>02</span>MINT</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(2)}><span>03</span>4444 HOODS ENTER THE WORLD</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(3)}><span>04</span>THE RECKONING</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(4)}><span>05</span>FIRST HOOD COMPLETES ITS MISSION</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(5)}><span>06</span>THE APOCALYPSE</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(6)}><span>07</span>TOKEN + STAKING</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(7)}><span>08</span>11 FACTIONS</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(8)}><span>09</span>FACTION WARS</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(9)}><span>10</span>SEASONAL RANKINGS</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(10)}><span>11</span>REWARDS</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(11)}><span>12</span>RESET</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(12)}><span>13</span>A NEW SEASON</button>
                        <div className="flow-line"></div>
                        <button className="flow-node" onClick={() => jumpTo(13)}><span>14</span>THE ECOSYSTEM EXPANDS</button>
                    </div>
                </section>

                <section className="final">
                    <img className="hero-logo" src="/images/new-logo.png" alt="Logo" />
                    <h3>🔒 REDACTED</h3>
                    <p>Certain mechanics, requirements, quantities, rewards and additional utilities have intentionally been kept REDACTED.</p>
                    <div className="redacted">
                        <ScrambledText className="scrambled-redacted" scrambleChars="█▓▒░#$%" speed={0.4} duration={1.5} radius={120} style={{ margin: 0, maxWidth: '100%', fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit' }}>
                            These details will be revealed once the mint is complete and the relevant systems are ready. Nothing is being rushed. The world will reveal itself one phase at a time.
                        </ScrambledText>
                    </div>
                    <div className="closing">
                        <p>THE SEAL BROKE.</p>
                        <p>THE HOODS EMERGED.</p>
                        <p>THE WORLD FELL.</p>
                        <p>NOW</p>
                        <h3>THE NEW WORLD BEGINS.</h3>
                    </div>
                </section>

            </main>
        </div>
    );
}
