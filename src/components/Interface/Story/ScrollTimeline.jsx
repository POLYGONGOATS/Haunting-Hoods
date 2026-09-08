import React, { useState, useEffect, useRef } from 'react';
import './LoreTimeline.css';

export default function ScrollTimeline({ data }) {
	const sectionRef = useRef(null);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return;
			
			const { top, height } = sectionRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			
			let progress = ((windowHeight - top) / height) * 100;
			progress = Math.max(0, Math.min(100, progress));
			setScrollProgress(progress);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.15 }
		);

		const chapters = document.querySelectorAll('.lore-chapter');
		chapters.forEach(chapter => observer.observe(chapter));

		return () => chapters.forEach(chapter => observer.unobserve(chapter));
	}, [data]);

	const renderTextWithGlitch = (text) => {
		if (!text.includes('[REDACTED]')) return text;
		
		const parts = text.split('[REDACTED]');
		return parts.map((part, index) => (
			<React.Fragment key={index}>
				{part}
				{index < parts.length - 1 && <span className="glitch-redacted">[REDACTED]</span>}
			</React.Fragment>
		));
	};

	if (!data || data.length === 0) return null;

	return (
		<section className="lore-section" ref={sectionRef}>
			<div className="blood-vignette" />

			<div className="lore-progress-bar" style={{ height: `${scrollProgress}%` }}>
			</div>
			
			<div className="lore-container">
				{data.map((chapter, index) => (
					<div className="lore-chapter" key={index}>
						<h3 className="lore-chapter-title">{chapter.title}</h3>
						<div className="lore-chapter-text">
							{chapter.content.map((paragraph, pIdx) => (
								<p key={pIdx}>{renderTextWithGlitch(paragraph)}</p>
							))}
						</div>
						{chapter.video && (
							<div className="lore-chapter-image">
								<video
									src={chapter.video}
									autoPlay
									loop
									muted
									playsInline
								/>
							</div>
						)}
						{chapter.image && (
							<div className="lore-chapter-image">
								<img src={chapter.image} alt={chapter.title} />
							</div>
						)}
						{chapter.images && (
							<div className="lore-chapter-images">
								{chapter.images.map((src, i) => (
									<img key={i} src={src} alt={`${chapter.title} ${i + 1}`} />
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
