export function createConfetti() {
  const colors = ['#FFD700', '#FF6B35', '#0066FF', '#10B981', '#8B5CF6'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      top: -10px;
      left: ${Math.random() * 100}vw;
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

export function triggerCelebration(message: string = "Success! 🎉") {
  createConfetti();
  
  // Show success message overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    items-center: center;
    justify-content: center;
    z-index: 9998;
    pointer-events: none;
  `;
  
  overlay.innerHTML = `
    <div style="text-center: center; color: white;">
      <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
      <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">${message}</h2>
      <p style="font-size: 1.2rem; opacity: 0.9;">You're one step closer to your dream!</p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.remove();
  }, 3000);
}
