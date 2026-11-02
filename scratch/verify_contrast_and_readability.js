const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const cssPath = path.join(repoRoot, 'assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf-8');

const errors = [];

// 1. experience-pill no debe tener fondo oscuro
if (css.includes('.experience-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  background: rgba(30, 41, 59') ||
    css.includes('.experience-pill') && css.match(/\.experience-pill\s*\{[^}]*background:\s*rgba\(30,\s*41,\s*59/)) {
  errors.push('.experience-pill has dark background rgba(30, 41, 59)');
}

// 2. copy-email-btn no debe tener fondo oscuro
if (css.match(/\.copy-email-btn\s*\{[^}]*background:\s*rgba\(30,\s*41,\s*59/)) {
  errors.push('.copy-email-btn has dark background rgba(30, 41, 59)');
}

// 3. section-badge no debe tener cian oscuro ni opaco
if (css.match(/\.section-badge\s*\{[^}]*color:\s*var\(--accent-cyan\)/)) {
  errors.push('.section-badge has accent-cyan instead of accent-orange');
}

// 4. social-link en footer no debe tener fondo oscuro
if (css.match(/\.social-link\s*\{[^}]*background:\s*rgba\(30,\s*41,\s*59/)) {
  errors.push('.social-link has dark background rgba(30, 41, 59)');
}

// 5. form-privacy-note no debe tener fondo oscuro
if (css.match(/\.form-privacy-note\s*\{[^}]*background:\s*rgba\(15,\s*23,\s*42/)) {
  errors.push('.form-privacy-note has dark background rgba(15, 23, 42)');
}

// 6. cookie-banner no debe tener fondo oscuro
if (css.match(/\.cookie-banner\s*\{[^}]*background:\s*rgba\(10,\s*16,\s*30/)) {
  errors.push('.cookie-banner has dark background rgba(10, 16, 30)');
}

// 7. cookie-modal no debe tener fondo oscuro
if (css.match(/\.cookie-modal\s*\{[^}]*background:\s*#0d1527/)) {
  errors.push('.cookie-modal has dark background #0d1527');
}

// 8. cookie-pref-item no debe tener fondo oscuro
if (css.match(/\.cookie-pref-item\s*\{[^}]*background:\s*rgba\(15,\s*23,\s*42/)) {
  errors.push('.cookie-pref-item has dark background rgba(15, 23, 42)');
}

// 9. site-footer no debe tener fondo oscuro
if (css.match(/\.site-footer\s*\{[^}]*background:\s*#04070e/)) {
  errors.push('.site-footer has dark background #04070e');
}

if (errors.length > 0) {
  console.error('FAIL - Readability and contrast issues detected:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('PASS - All readability and contrast checks passed');
}
