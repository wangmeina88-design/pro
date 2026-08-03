'use client';

import { useEffect, useRef } from 'react';

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  dataAttribute,
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const completeRef = useRef(onLetterAnimationComplete);

  useEffect(() => {
    completeRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !text) return;
    const units = Array.from(element.querySelectorAll('[data-split-unit]'));
    if (!units.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    units.forEach(unit => {
      unit.style.opacity = `${from.opacity ?? 0}`;
      unit.style.transform = `translateY(${from.y ?? 0}px)`;
    });

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const animations = units.map((unit, index) => unit.animate(
        [
          { opacity: from.opacity ?? 0, transform: `translateY(${from.y ?? 0}px)` },
          { opacity: to.opacity ?? 1, transform: `translateY(${to.y ?? 0}px)` }
        ],
        { duration: duration * 1000, delay: index * delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      ));
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => completeRef.current?.());
    }, { threshold, rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, delay, duration, from.opacity, from.y, to.opacity, to.y, threshold, rootMargin]);

  const Tag = tag || 'p';
  return (
    <Tag
      ref={ref}
      data-split-text={dataAttribute}
      className={`split-parent ${className}`}
      aria-label={text}
      style={{
        textAlign,
        overflow: 'hidden',
        display: 'inline-block',
        whiteSpace: 'pre-line',
        wordWrap: 'break-word'
      }}
    >
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-split-unit="true"
          aria-hidden="true"
          className="split-char"
          style={{ display: character === '\n' ? 'block' : 'inline-block', whiteSpace: character === ' ' ? 'pre' : undefined }}
        >
          {character === '\n' ? '' : character}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
