import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, RotateCcw, Home } from "lucide-react";

const NotFoundPage = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Mouse interaction
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 10;
            }
          }
        } else {
          // Return to original position if mouse leaves
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }

        // Auto movement for a bit of life
        this.x += Math.sin(Date.now() * 0.001 + this.density) * 0.1;
        this.y += Math.cos(Date.now() * 0.001 + this.density) * 0.1;

        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 3 + 1;
        // Teal and Slate colors for particles
        const colors = ["rgba(203, 213, 225, 0.5)", "rgba(148, 163, 184, 0.5)", "rgba(45, 212, 191, 0.3)", "rgba(20, 184, 166, 0.3)"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() * 0.4) - 0.2;
        let dy = (Math.random() * 0.4) - 0.2;
        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
            ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = "rgba(148, 163, 184," + opacityValue * 0.2 + ")"; // Slate-400 with opacity
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);

    // Mouse tracking on the window/container
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    }
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    }

    // Attach listeners to window to capture full screen movement
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden font-display">
      {/* Background with Gradient and Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[20px_20px] opacity-40"></div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl px-6 text-center">
        <div className="mb-8 relative inline-block">
          {/* Animated Glow behind 404 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-teal-800 to-slate-900 drop-shadow-sm animate-fade-in-up">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-semibold text-slate-800 mb-4 tracking-tight">
          Page not found
        </h2>

        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Dashboard
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>
      </div>

      {/* Decorative footer elements */}
      <div className="absolute bottom-8 text-slate-400 text-sm">
        AI Learning Assistant
      </div>
    </div>
  );
};

export default NotFoundPage;