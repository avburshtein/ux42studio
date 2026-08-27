import { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
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
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Color palette - темно-зеленый и фиолетовые акценты
    const colors = [
      '#0b6e4f',
      '#0b6e4f',
      '#0b6e4f',
      '#a29ffe',
      '#c084fc',
      '#ccff00',
    ];

    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

    // Create floating elements
    const elementCount = count;
    elementsRef.current = [];

    for (let i = 0; i < elementCount; i++) {
      elementsRef.current.push({
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
      });
    }

    // Mouse move handler
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
      elementsRef.current.forEach((element) => {
        // Update position
        element.x += element.speedX;
        element.y += element.speedY;

        // Wrap around edges
        if (element.x < -10) element.x = 110;
        if (element.x > 110) element.x = -10;
        if (element.y < -10) element.y = 110;
        if (element.y > 110) element.y = -10;

        // Update rotation
        element.rotation += element.rotationSpeed;

        // Mouse parallax effect
        const dx = mouseRef.current.x - element.x;
        const dy = mouseRef.current.y - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 30) {
          const force = (30 - distance) / 30;
          element.x -= (dx / distance) * force * 0.5;
          element.y -= (dy / distance) * force * 0.5;
        }
      });

      // Re-render
      if (container) {
        container.innerHTML = '';
        elementsRef.current.forEach((element) => {
          const el = document.createElement('div');
          el.className = 'absolute transition-all duration-300 ease-out';
          el.style.left = `${element.x}%`;
          el.style.top = `${element.y}%`;
          el.style.width = `${element.size}px`;
          el.style.height = `${element.size}px`;
          el.style.opacity = `${element.opacity}`;
          el.style.transform = `translate(-50%, -50%) rotate(${element.rotation}deg)`;
          el.style.filter = `blur(${element.blur}px)`;
          el.style.pointerEvents = 'none';

          // Different shapes
          if (element.shape === 'circle') {
            el.style.borderRadius = '50%';
            el.style.background = element.color;
          } else if (element.shape === 'square') {
            el.style.borderRadius = '12px';
            el.style.background = `linear-gradient(135deg, ${element.color}, transparent)`;
          } else if (element.shape === 'triangle') {
            el.style.width = '0';
            el.style.height = '0';
            el.style.borderLeft = `${element.size / 2}px solid transparent`;
            el.style.borderRight = `${element.size / 2}px solid transparent`;
            el.style.borderBottom = `${element.size}px solid ${element.color}`;
            el.style.background = 'none';
          }

          container.appendChild(el);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [count, minBlur, maxBlur]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}