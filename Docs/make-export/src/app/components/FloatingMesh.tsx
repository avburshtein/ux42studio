import { useEffect, useRef } from 'react';

interface FloatingMeshProps {
  dotColor?: string;
  gridSize?: number;
  spacing?: number;
}

export function FloatingMesh({ 
  dotColor = '#0b6e4f', 
  gridSize = 20, 
  spacing = 40 
}: FloatingMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  // Helper function to interpolate between two colors
  const lerpColor = (color1: string, color2: string, factor: number) => {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    
    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;
    
    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      
      // Calculate mouse position relative to canvas
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      
      // Compensation for rotateX(65deg) visual shift
      // The rotation makes points appear ~300px lower than their actual canvas position
      const rotationCompensation = 600;
      
      mouseRef.current = {
        x: canvasX,
        y: canvasY + rotationCompensation,
      };
      
      // Debug: log coordinates
      if (Math.random() < 0.05) {
        console.log('Screen:', e.clientX, e.clientY, '| Canvas:', canvasX, canvasY, '| Adjusted:', canvasX, canvasY + rotationCompensation);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);

    const dots: { x: number; y: number; z: number; baseX: number; baseY: number }[] = [];
    
    // Create grid of dots
    const cols = Math.ceil(canvas.width / spacing);
    const rows = Math.ceil(canvas.height / spacing);
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * spacing + spacing / 2;
        const y = i * spacing + spacing / 2;
        dots.push({ x, y, z: 0, baseX: x, baseY: y });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      timeRef.current += 0.02;
      
      // Debug: log canvas size once
      if (timeRef.current < 0.1) {
        console.log('Canvas size:', canvas.width, canvas.height);
        console.log('Total dots:', dots.length);
        console.log('First dot position:', dots[0]?.baseX, dots[0]?.baseY);
      }
      
      let dotsNearMouse = 0;
      
      dots.forEach((dot, index) => {
        // 2D wave movements (XY plane only)
        const waveX = Math.sin(timeRef.current + dot.baseY * 0.01) * 8;
        const waveY = Math.cos(timeRef.current + dot.baseX * 0.01) * 8;
        
        // Mouse parallax effect
        const dx = mouseRef.current.x - dot.baseX;
        const dy = mouseRef.current.y - dot.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300; // Increased even more
        
        if (distance < maxDistance) {
          dotsNearMouse++;
        }
        
        let mouseOffsetX = 0;
        let mouseOffsetY = 0;
        let mouseOffsetZ = 0;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          // Much stronger movement for visibility
          mouseOffsetX = -Math.cos(angle) * force * 30; // Negative to repel, increased strength
          mouseOffsetY = -Math.sin(angle) * force * 30; // Negative to repel, increased strength
        }
        
        // Apply Z offset from mouse only (no wave Z)
        const finalZ = mouseOffsetZ;
        
        // Calculate perspective scale based on Z position
        const perspective = 800;
        const scale = perspective / (perspective + finalZ);
        
        // Combine wave and mouse effects with perspective
        const targetX = (dot.baseX + waveX + mouseOffsetX) * scale;
        const targetY = (dot.baseY + waveY + mouseOffsetY) * scale;
        
        // Smooth transition
        dot.x += (targetX - dot.x) * 0.15;
        dot.y += (targetY - dot.y) * 0.15;
        
        // Calculate fade based on Y position (depth/distance)
        const fadeStart = canvas.height * 0.3;
        const fadeEnd = canvas.height * 0.05;
        const distanceFromTop = dot.y;
        
        let opacityY = 1;
        if (distanceFromTop < fadeStart) {
          opacityY = Math.max(0, (distanceFromTop - fadeEnd) / (fadeStart - fadeEnd));
        }
        
        // Calculate fade based on X position (left and right edges)
        const fadeEdgeWidth = canvas.width * 0.2;
        const distanceFromLeft = dot.x;
        const distanceFromRight = canvas.width - dot.x;
        
        let opacityX = 1;
        if (distanceFromLeft < fadeEdgeWidth) {
          opacityX = Math.min(opacityX, distanceFromLeft / fadeEdgeWidth);
        }
        if (distanceFromRight < fadeEdgeWidth) {
          opacityX = Math.min(opacityX, distanceFromRight / fadeEdgeWidth);
        }
        
        // Z-based opacity (dots closer are brighter)
        const zOpacity = Math.max(0.2, Math.min(1.2, 1 - (finalZ / 300)));
        
        // Combine all fade effects
        const opacity = opacityY * opacityX * zOpacity;
        
        // Calculate dot size based on perspective and Z position
        const baseSizeScale = 1 + (distanceFromTop / canvas.height) * 1.5;
        const zSizeScale = scale * 1.2; // Dots further away (negative Z) are smaller
        const dotSize = 1.5 * baseSizeScale * zSizeScale;
        
        // Calculate color based on mouse proximity
        const colorChangeDistance = 250; // Distance at which color starts changing
        let currentColor = dotColor;
        
        if (distance < colorChangeDistance) {
          const colorFactor = Math.pow(1 - (distance / colorChangeDistance), 1.5); // Adjusted power for better visibility
          currentColor = lerpColor(dotColor, '#c084fc', colorFactor); // #c084fc is even brighter purple
        }
        
        // Draw dot with fade
        if (opacity > 0.01 && dotSize > 0.1) {
          ctx.fillStyle = `${currentColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dotColor, spacing]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }}
    />
  );
}