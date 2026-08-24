Floating Elements — Agent Spec
Что это
Анимированный canvas-слой с геометрическими фигурами (circle, square, triangle), которые плавают по экрану и реагируют на движение мыши (parallax-отталкивание). Реализован через requestAnimationFrame + прямое DOM-манипулирование (без SVG и Canvas API) в React-компоненте.

Архитектура компонента
FloatingElements
├── containerRef      — div-контейнер, в котором рендерятся элементы
├── elementsRef       — массив FloatingElement (состояние анимации, не React-стейт)
├── animationFrameRef — ID текущего RAF для cleanup
└── mouseRef          — координаты курсора (0–100 в % от контейнера)
Критически важно: анимационное состояние (elementsRef) хранится в useRef, не в useState. React перерисовка не используется — вместо этого на каждом кадре вызывается container.innerHTML = '' и DOM перестраивается с нуля. Это даёт 60fps без лишних re-render.

Интерфейс
interface FloatingElement {
  x: number;           // позиция X в % (0–100)
  y: number;           // позиция Y в % (0–100)
  size: number;        // px, 20–100
  speedX: number;      // скорость X, ±0.3 px/frame
  speedY: number;      // скорость Y, ±0.3 px/frame
  rotation: number;    // текущий угол, deg
  rotationSpeed: number; // скорость вращения, ±0.5 deg/frame
  opacity: number;     // 0.1–0.4
  color: string;       // hex
  shape: 'circle' | 'square' | 'triangle';
  blur: number;        // px, задаётся через minBlur/maxBlur props
}

interface FloatingElementsProps {
  count?: number;      // кол-во элементов, default 20
  minBlur?: number;    // default 0
  maxBlur?: number;    // default 20
}
Полный код компонента
// src/app/components/FloatingElements.tsx
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
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── 1. Цветовая палитра ───────────────────────────────────────────
    const colors = [
      '#0b6e4f', '#0b6e4f', '#0b6e4f', // тройной вес = чаще зелёный
      '#a29ffe',  // light lavender
      '#c084fc',  // purple
      '#ccff00',  // кислотно-жёлтый акцент
    ];
    const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

    // ── 2. Инициализация элементов ────────────────────────────────────
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

    // ── 3. Mouse parallax ─────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── 4. Animation loop ─────────────────────────────────────────────
    const animate = () => {
      elementsRef.current.forEach((el) => {
        el.x += el.speedX;
        el.y += el.speedY;
        el.rotation += el.rotationSpeed;

        // Зацикливание по краям (wrap-around)
        if (el.x < -10) el.x = 110;
        if (el.x > 110) el.x = -10;
        if (el.y < -10) el.y = 110;
        if (el.y > 110) el.y = -10;

        // Parallax-отталкивание от курсора (radius 30%)
        const dx = mouseRef.current.x - el.x;
        const dy = mouseRef.current.y - el.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          const force = (30 - dist) / 30;
          el.x -= (dx / dist) * force * 0.5;
          el.y -= (dy / dist) * force * 0.5;
        }
      });

      // ── 5. DOM render ──────────────────────────────────────────────
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
          // triangle через CSS border trick
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

  return <div ref={containerRef} className="absolute inset-0" style={{ pointerEvents: 'none' }} />;
}
Использование в Hero-секции
Обязательные требования к родительскому контейнеру:

// ✅ Правильно — relative + overflow-hidden
<section className="relative overflow-hidden min-h-screen">
  <FloatingElements count={20} minBlur={0} maxBlur={20} />
  <div className="relative z-10"> {/* контент поверх */}
    <h1>Заголовок</h1>
  </div>
</section>

// ❌ Неправильно — без relative и overflow-hidden
<section>
  <FloatingElements />
</section>
Рекомендованные пресеты:

Контекст	count	minBlur	maxBlur
Hero (полный экран)	20	0	20
Section background	12	8	24
Card / modal	6	4	12
Subtle ambient	15	12	30
Как адаптировать цвета под дизайн-систему
Единственное место для изменения палитры — массив colors. Используй повторы для веса:

// Пример: синяя система с фиолетовым акцентом
const colors = [
  '#1565C0', '#1565C0', '#1565C0', // основной — 50% вероятность
  '#7C3AED',  // фиолетовый акцент
  '#EC4899',  // розовый акцент
  '#F59E0B',  // жёлтый акцент
];
Производительность и ограничения
Аспект	Решение
DOM-rebuild каждый кадр	Неизбежно при текущей архитектуре. Для 20 элементов — норма. Свыше 50 — использовать Canvas API
Cleanup	Обязательно cancelAnimationFrame и removeEventListener в return useEffect
SSR	Не работает на сервере (useEffect запускается только в браузере)
Reduced motion	Добавить проверку window.matchMedia('(prefers-reduced-motion: reduce)')
z-index	Контент над FloatingElements должен иметь relative z-10 или выше
Pointer events	pointerEvents: 'none' на контейнере и всех элементах — кликабельность контента не нарушается
Опциональное улучшение: prefers-reduced-motion
useEffect(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // не запускаем анимацию
  // ... остальной код
}, [count, minBlur, maxBlur]);
