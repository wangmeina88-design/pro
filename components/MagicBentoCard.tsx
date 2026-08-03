"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type MagicBentoCardProps = {
  children: ReactNode;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export default function MagicBentoCard({ children, active, onActivate, onDeactivate }: MagicBentoCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLSpanElement[]>([]);

  function clearParticles() {
    particlesRef.current.forEach((particle) => {
      particle.getAnimations().forEach((animation) => animation.cancel());
      particle.animate(
        [{ transform: particle.style.transform || "scale(1)", opacity: 0.85 }, { transform: "scale(0)", opacity: 0 }],
        { duration: 200, easing: "ease-out", fill: "forwards" },
      ).finished.finally(() => particle.remove());
    });
    particlesRef.current = [];
  }

  function showParticles() {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearParticles();
    for (let index = 0; index < 8; index += 1) {
      const particle = document.createElement("span");
      particle.className = "bento-particle";
      particle.style.left = `${10 + Math.random() * 80}%`;
      particle.style.top = `${12 + Math.random() * 76}%`;
      card.appendChild(particle);
      particlesRef.current.push(particle);
      const x = (Math.random() - 0.5) * 44;
      const y = (Math.random() - 0.5) * 30;
      particle.animate(
        [{ transform: "translate(0, 0) scale(0)", opacity: 0 }, { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0.85 }],
        { duration: 1400 + Math.random() * 1000, delay: index * 35, direction: "alternate", iterations: Infinity, easing: "ease-in-out" },
      );
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
    const rotateX = ((y - rect.height / 2) / rect.height) * -2;
    const rotateY = ((x - rect.width / 2) / rect.width) * 2;
    const translateX = ((x - rect.width / 2) / rect.width) * 3;
    card.style.transform = `perspective(1000px) translateX(${translateX}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleEnter() {
    onActivate();
    showParticles();
  }

  function handleLeave() {
    onDeactivate();
    clearParticles();
    if (cardRef.current) cardRef.current.style.transform = "perspective(1000px) translateX(0) rotateX(0) rotateY(0)";
  }

  useEffect(() => () => clearParticles(), []);

  return (
    <article
      ref={cardRef}
      className={`experience-bento ${active ? "is-open" : ""}`}
      data-magic-bento="experience"
      data-hover-details="true"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocusCapture={handleEnter}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) handleLeave();
      }}
      onPointerMove={handlePointerMove}
    >
      {children}
    </article>
  );
}
