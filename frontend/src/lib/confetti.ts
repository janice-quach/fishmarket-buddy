const COLORS = ["#f582ae", "#8bd3dd", "#f3d2c1", "#8ac926", "#ffbe0b", "#ff006e"];

export function spawnConfetti(): void {
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("div");
    piece.style.cssText = `
      position: fixed; width: 8px; height: 8px; pointer-events: none; z-index: 200;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      left: ${Math.random() * 100}vw; top: -10px;
    `;
    document.body.appendChild(piece);

    const destX = (Math.random() - 0.5) * 200;
    const destY = window.innerHeight + 20;
    const dur = 800 + Math.random() * 1200;

    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration: dur, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }
    );
    setTimeout(() => piece.remove(), dur);
  }
}
