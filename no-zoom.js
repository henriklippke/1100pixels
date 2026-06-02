// Verhindert Pinch-Zoom und Double-Tap-Zoom auf iOS Safari (und Trackpad-Zoom)
// (viewport user-scalable=no wird seit iOS 10 oft ignoriert)

// iOS Safari gesture events (Pinch)
const stopGesture = e => { e.preventDefault(); e.stopPropagation(); return false; };
document.addEventListener('gesturestart',  stopGesture, { passive: false, capture: true });
document.addEventListener('gesturechange', stopGesture, { passive: false, capture: true });
document.addEventListener('gestureend',    stopGesture, { passive: false, capture: true });

// Multi-Touch (2+ Finger) blockieren
document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false, capture: true });
document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false, capture: true });

// Double-Tap-Zoom blockieren
let __lastTap = 0;
document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - __lastTap < 350) {
        e.preventDefault();
    }
    __lastTap = now;
}, { passive: false, capture: true });

// Trackpad / Ctrl+Scroll Pinch-Zoom auf Desktop-Safari
document.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
}, { passive: false, capture: true });

// Ctrl/Cmd + +/- Tasten-Zoom
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
    }
}, { passive: false, capture: true });

// CSS-Fallback: touch-action auf body setzen
if (document.body) {
    document.body.style.touchAction = 'manipulation';
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.touchAction = 'manipulation';
    });
}
