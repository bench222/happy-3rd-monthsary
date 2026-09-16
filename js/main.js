// ===========================
// Show Letter & Start Clock
// ===========================

function showLoveLetter() {
  const letter = document.getElementById("letter");
  typewriter(letter);
}

// ===========================
// Main Initialization
// ===========================

async function startApp() {
  initContent(CONFIG);

  const staticCanvas = initCanvas("static-canvas");
  const groundCanvas = initCanvas("ground-canvas");
  const dynamicCanvas = initCanvas("canvas");

  const tree = new Tree(
    staticCanvas,
    dynamicCanvas,
    groundCanvas,
    StageConfig.width,
    StageConfig.height,
    TreeShape,
    CONFIG
  );
  const { seed, footer } = tree;

  scaleContent();

  seed.draw();

  await waitForUserClick(seed, dynamicCanvas);
  await animateSeedShrink(seed);
  await animateSeedMove(seed, footer);
  await animateTreeGrow(tree);
  await animateFlowerBloom(tree);
  tree.resetFallingBlooms();

  footer.draw();
  await animateTreeMove(staticCanvas);

  showLoveLetter();
  startHeartJumpAnimation(tree);
}

document.addEventListener("DOMContentLoaded", startApp);