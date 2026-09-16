// ===========================
// Responsive Scaling
// ===========================

function scaleContent() {
  const viewport = document.getElementById("viewport");
  const main = document.getElementById("main");

  function resize() {
    const scale = Math.min(
      window.innerWidth / StageConfig.width,
      window.innerHeight / StageConfig.height,
      1
    );
    viewport.style.width = `${StageConfig.width * scale}px`;
    viewport.style.height = `${StageConfig.height * scale}px`;
    main.style.transform = `scale(${scale})`;
  }

  resize();
  window.addEventListener("resize", resize);
}

// ===========================
// Content Initialization
// ===========================

function initContent(config) {
  const letter = document.getElementById("letter");
  letter.textContent = "";

  function addParagraph(lines) {
    lines.forEach(line => {
      const p = document.createElement("p");
      p.textContent = line;
      letter.appendChild(p);
    });
  }

  const paragraphs = Object.values(config.letter);
  paragraphs.forEach((lines, index) => {
    if (index > 0) letter.appendChild(document.createElement("br"));
    addParagraph(lines);
  });
}

// ===========================
// Canvas Initialization
// ===========================

function initCanvas(id) {
  const canvas = document.getElementById(id);
  const { width: w, height: h } = StageConfig;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d").scale(dpr, dpr);
  return canvas;
}