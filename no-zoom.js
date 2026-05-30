// Verhindert Pinch-Zoom und Double-Tap-Zoom auf iOS Safari
// (viewport user-scalable=no wird seit iOS 10 oft ignoriert)
document.addEventListener('gesturestart',  e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend',    e => e.preventDefault());
document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });
let __lastTap = 0;
document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - __lastTap < 300) e.preventDefault();
    __lastTap = now;
}, { passive: false });
