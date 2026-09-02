'use client';

import { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  rotation: number; rotationSpeed: number;
  opacity: number; color: string;
  shape: 'circle' | 'square' | 'triangle';
  blur: number;
}

interface FloatingElementsProps {
  count?: number;
  minBlur?: number;
  maxBlur?: number;
}

export function FloatingElements({ count = 20, minBlur = 0, maxBlur = 20 }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<FloatingElement[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Проверка prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Палитра: зелёный (бренд), лаванда, фиолетовый, кислотно-жёлтый
    const colors = [
      '#0b6e4f', '#0b6e4f', '#0b6e4f',
      '#a29ffe',
      '#c084fc',
      '#ccff00',
    ];
    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

    // Инициализация
    elementsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 80,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      opacity: 0.1 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      blur: Math.random() * (maxBlur - minBlur) + minBlur,
    }));

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      elementsRef.current.forEach((el) => {
        el.x += el.speedX;
        el.y += el.speedY;
        el.rotation += el.rotationSpeed;

        if (el.x < -10) el.x = 110;
        if (el.x > 110) el.x = -10;
        if (el.y < -10) el.y = 110;
        if (el.y > 110) el.y = -10;

        // Parallax-отталкивание от курсора
        const dx = mouseRef.current.x - el.x;
        const dy = mouseRef.current.y - el.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          const force = (30 - dist) / 30;
          el.x -= (dx / dist) * force * 0.5;
          el.y -= (dy / dist) * force * 0.5;
        }
      });

      // DOM render
      container.innerHTML = '';
      elementsRef.current.forEach((el) => {
        const div = document.createElement('div');
        div.style.cssText = `
          position: absolute; pointer-events: none;
          left: ${el.x}%; top: ${el.y}%;
          width: ${el.size}px; height: ${el.size}px;
          opacity: ${el.opacity};
          transform: translate(-50%, -50%) rotate(${el.rotation}deg);
          filter: blur(${el.blur}px);
        `;

        if (el.shape === 'circle') {
          div.style.borderRadius = '50%';
          div.style.background = el.color;
        } else if (el.shape === 'square') {
          div.style.borderRadius = '12px';
          div.style.background = `linear-gradient(135deg, ${el.color}, transparent)`;
        } else {
          div.style.width = '0';
          div.style.height = '0';
          div.style.borderLeft = `${el.size / 2}px solid transparent`;
          div.style.borderRight = `${el.size / 2}px solid transparent`;
          div.style.borderBottom = `${el.size}px solid ${el.color}`;
          div.style.background = 'none';
        }
        container.appendChild(div);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [count, minBlur, maxBlur]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
