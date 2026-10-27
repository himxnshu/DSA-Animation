/**
 * Ambient Sparks Background Engine for DSAbyHimanshu
 * Runs smoothly on top of NewVideo.mp4 background.
 * Crown animation in front of the character has been removed as requested.
 */

class Background3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.particles = [];
    this.initParticles();

    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(35, Math.floor(window.innerWidth / 40));
    const colors = [
      "rgba(245, 158, 11, ",   // warm amber gold
      "rgba(250, 204, 21, ",   // classic gold
      "rgba(217, 119, 6, ",    // dark bronze gold
      "rgba(202, 138, 4, "     // deep dark gold
    ];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vy: -(Math.random() * 0.32 + 0.10),
        vx: (Math.random() - 0.5) * 0.20,
        size: Math.random() * 2.2 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.35 + 0.12
      });
    }
  }

  animate() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle ambient floating sparks only - NO crown drawn in front of character
    this.particles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }

      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(this.animate);
  }
}

// Auto-initialize if canvas is present
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("bg-3d-canvas")) {
    new Background3D("bg-3d-canvas");
  }
});
