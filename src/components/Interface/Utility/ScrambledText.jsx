import React, { useEffect, useRef } from 'react';
import './ScrambledText.css';

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const containerRef = useRef(null);
  const text = typeof children === 'string' ? children : String(children);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';
    const spanElements = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'char';
      span.dataset.original = char;
      // Handle spaces correctly so they don't collapse
      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }
      el.appendChild(span);
      return span;
    });

    const handleMove = (e) => {
      spanElements.forEach(span => {
        // Don't scramble spaces
        if (span.dataset.original === ' ') return;

        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (dist < radius) {
          if (Math.random() < speed) {
            span.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            // Optionally clear a timeout to revert it if mouse stops moving
            if (span.revertTimeout) clearTimeout(span.revertTimeout);
            span.revertTimeout = setTimeout(() => {
              span.textContent = span.dataset.original;
            }, duration * 1000);
          }
        } else {
          span.textContent = span.dataset.original;
        }
      });
    };

    window.addEventListener('pointermove', handleMove);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      spanElements.forEach(span => {
        if (span.revertTimeout) clearTimeout(span.revertTimeout);
      });
    };
  }, [text, radius, speed, scrambleChars, duration]);

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline', ...style }}></span>
  );
};

export default ScrambledText;
