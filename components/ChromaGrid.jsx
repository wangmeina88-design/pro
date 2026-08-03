"use client";

import { useRef, useEffect } from 'react';
import './ChromaGrid.css';

export const ChromaGrid = ({
  items,
  className = '',
  columns = 3,
  rows = 2,
}) => {
  const rootRef = useRef(null);
  const primaryGroupRef = useRef(null);
  const isPaused = useRef(false);
  const resumeTimer = useRef(null);

  const demo = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg, #4F46E5, #000)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, #000)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg, #F59E0B, #000)',
      url: 'https://dribbble.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg, #EF4444, #000)',
      url: 'https://kaggle.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=25',
      title: 'Sam Kim',
      subtitle: 'Mobile Developer',
      handle: '@thesamkim',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg, #8B5CF6, #000)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=60',
      title: 'Tyler Rodriguez',
      subtitle: 'Cloud Architect',
      handle: '@tylerrod',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4, #000)',
      url: 'https://aws.amazon.com/'
    }
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const root = rootRef.current;
    const group = primaryGroupRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!root || !group || reducedMotion) return;

    let frameId;
    const tick = () => {
      if (!isPaused.current) {
        root.scrollLeft += 0.35;
        if (root.scrollLeft >= group.scrollWidth) {
          root.scrollLeft -= group.scrollWidth;
        }
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [data.length]);

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  const pause = () => {
    isPaused.current = true;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };

  const resume = () => {
    isPaused.current = false;
  };

  const resumeAfterInteraction = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(resume, 900);
  };

  const handleWheel = e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    pause();
    e.currentTarget.scrollLeft += e.deltaY;
    resumeAfterInteraction();
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const renderCard = (c, i, group) => (
    <article
      key={`${group}-${i}`}
      className="chroma-card"
      onMouseMove={handleCardMove}
      style={{
        '--card-border': c.borderColor || 'transparent',
        '--card-gradient': c.gradient,
        cursor: c.url ? 'pointer' : 'default'
      }}
    >
      <a className="chroma-card-link" href={c.url} tabIndex={group === 'duplicate' ? -1 : 0}>
        <div className="chroma-img-wrapper">
          <img src={c.image} alt={group === 'primary' ? c.title : ''} loading="lazy" />
        </div>
        <footer className="chroma-info">
          <h3 className="name">{c.title}</h3>
          {c.handle && <span className="handle">{c.handle}</span>}
          <p className="role">{c.subtitle}</p>
          {c.location && <span className="location">{c.location}</span>}
        </footer>
      </a>
    </article>
  );

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      data-chroma-grid="horizontal"
      data-auto-scroll="true"
      aria-label="横向浏览精选项目"
      tabIndex={0}
      style={{
        '--cols': columns,
        '--rows': rows
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onPointerDown={pause}
      onPointerUp={resumeAfterInteraction}
      onPointerCancel={resumeAfterInteraction}
      onWheel={handleWheel}
    >
      <div ref={primaryGroupRef} className="chroma-project-group" data-project-group="primary">
        {data.map((c, i) => renderCard(c, i, 'primary'))}
      </div>
      <div className="chroma-project-group" data-project-group="duplicate" aria-hidden="true">
        {data.map((c, i) => renderCard(c, i, 'duplicate'))}
      </div>
    </div>
  );
};

export default ChromaGrid;
