'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
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
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
      return;
    }
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || animationCompletedRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animationCompletedRef.current = true;
        return;
      }

      const el = ref.current;
      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign = marginValue === 0 ? '' : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;

      let targets;
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: self => {
          if (splitType.includes('chars') && self.chars.length) targets = self.chars;
          if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
          if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
          if (!targets) targets = self.chars || self.words || self.lines;

          return gsap.fromTo(targets, { ...from }, {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start: `top ${startPct}%${sign}`,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              onCompleteRef.current?.();
            },
            willChange: 'transform, opacity',
            force3D: true
          });
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === el) trigger.kill();
        });
        splitInstance.revert();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const Tag = tag || 'p';
  return (
    <Tag
      ref={ref}
      data-split-text={dataAttribute}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: 'hidden',
        display: 'inline-block',
        whiteSpace: 'pre-line',
        wordWrap: 'break-word',
        willChange: 'transform, opacity'
      }}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
