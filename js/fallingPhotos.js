// ===========================
// Falling Photos — polaroid-style images drifting down the side margins
// ===========================

function fpRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

class FallingPhoto {
  constructor(canvasWidth, canvasHeight, image) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image = image;
    this.reset(true);
  }

  reset(initial = false) {
    this.size = fpRandomFloat(70, 110);
    const half = this.size / 2;
    const maxX = Math.max(half, this.canvasWidth - half);
    this.baseX = fpRandomFloat(half, maxX);
    this.x = this.baseX;
    this.y = initial ? fpRandomFloat(-this.canvasHeight, this.canvasHeight) : -this.size;
    this.vy = fpRandomFloat(0.35, 0.75);
    this.angle = fpRandomFloat(-0.3, 0.3);
    this.spin = fpRandomFloat(-0.004, 0.004);
    this.swing = fpRandomFloat(0.01, 0.02);
    this.swingAmp = fpRandomFloat(10, 25);
    this.phase = fpRandomFloat(0, Math.PI * 2);
  }

  update(dt) {
    const f = dt / 16;
    this.y += this.vy * f;
    this.phase += this.swing * f;
    this.x = this.baseX + Math.sin(this.phase) * this.swingAmp;
    this.angle += this.spin * f;

    if (this.y - this.size > this.canvasHeight) {
      this.reset(false);
    }
  }

  draw(ctx) {
    const frame = this.size;
    const photo = this.size * 0.82;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // White polaroid-style frame with a soft shadow
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(-frame / 2, -frame / 2, frame, frame * 1.15);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      ctx.drawImage(this.image, -photo / 2, -frame / 2 + frame * 0.06, photo, photo);
    }
    ctx.restore();
  }
}

function fpSetupSide(canvasId, images) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !images.length) return;

  const ctx = canvas.getContext("2d");
  let width = 0, height = 0;
  let photos = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, width * dpr);
    canvas.height = Math.max(1, height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function populate() {
    if (width <= 0) return;
    const count = Math.max(2, Math.round(width / 90));
    photos = Array.from({ length: count }, () =>
      new FallingPhoto(width, height, images[Math.floor(Math.random() * images.length)])
    );
  }

  resize();
  populate();

  window.addEventListener("resize", () => {
    resize();
    if (!photos.length) populate();
  });

  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    photos.forEach((p) => {
      p.update(dt);
      p.draw(ctx);
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function initFallingPhotos(config) {
  const urls = (config && config.fallingPhotos) || [];
  if (!urls.length) return;

  const images = urls.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  fpSetupSide("photos-left-canvas", images);
  fpSetupSide("photos-right-canvas", images);
}
