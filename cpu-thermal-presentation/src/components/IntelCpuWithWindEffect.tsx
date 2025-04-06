import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const IntelCpuWithWindEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Wind particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      
      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 2 + 2;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speed;
        if (canvas && this.x > canvas.width) {
          this.x = 0;
          this.y = Math.random() * (canvas.height || 0);
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 204, 255, ${this.opacity})`;
        ctx.lineWidth = this.size / 3;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.speed * 5, this.y);
        ctx.stroke();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50;
    
    if (canvas) {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
      }
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the Intel CPU
      const cpuSize = Math.min(canvas.width, canvas.height) * 0.4;
      const cpuX = canvas.width / 2 - cpuSize / 2;
      const cpuY = canvas.height / 2 - cpuSize / 2;
      
      // Draw CPU background
      ctx.fillStyle = '#1E3A5F';
      ctx.fillRect(cpuX, cpuY, cpuSize, cpuSize);
      
      // Draw CPU border
      ctx.strokeStyle = '#00CCFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(cpuX, cpuY, cpuSize, cpuSize);
      
      // Draw Intel logo text
      ctx.font = `bold ${cpuSize * 0.2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#00CCFF';
      ctx.fillText('intel', canvas.width / 2, canvas.height / 2);
      
      // Draw glow effect around CPU
      const glow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, cpuSize * 0.5,
        canvas.width / 2, canvas.height / 2, cpuSize
      );
      glow.addColorStop(0, 'rgba(0, 204, 255, 0.1)');
      glow.addColorStop(1, 'rgba(0, 204, 255, 0)');
      
      ctx.fillStyle = glow;
      ctx.fillRect(cpuX - cpuSize * 0.5, cpuY - cpuSize * 0.5, cpuSize * 2, cpuSize * 2);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  return (
    <Container>
      <Canvas ref={canvasRef} />
      <CPUHeatEffect />
    </Container>
  );
};

const pulseAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;

const windAnimation = keyframes`
  0% { transform: translateX(-100%); opacity: 0.8; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000814;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const CPUHeatEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35%;
  height: 35%;
  border-radius: 0;
  background: radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0) 70%);
  animation: ${pulseAnimation} 3s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: -200%;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 204, 255, 0) 0%, rgba(0, 204, 255, 0.3) 50%, rgba(0, 204, 255, 0) 100%);
    animation: ${windAnimation} 3s linear infinite;
  }
`;

export default IntelCpuWithWindEffect; 