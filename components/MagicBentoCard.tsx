"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { gsap } from "gsap";

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
      gsap.to(particle, { scale: 0, opacity: 0, duration: 0.2, onComplete: () => particle.remove() });
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
      gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.3, delay: index * 0.035 });
      gsap.to(particle, { x: (Math.random() - 0.5) * 44, y: (Math.random() - 0.5) * 30, duration: 1.4 + Math.random(), repeat: -1, yoyo: true, ease: "sine.inOut" });
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
    gsap.to(card, {
      rotateX: ((y - rect.height / 2) / rect.height) * -2,
      rotateY: ((x - rect.width / 2) / rect.width) * 2,
      x: ((x - rect.width / 2) / rect.width) * 3,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  }

  function handleEnter() {
    onActivate();
    showParticles();
  }

  function handleLeave() {
    onDeactivate();
    clearParticles();
    if (cardRef.current) gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, x: 0, duration: 0.3 });
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
