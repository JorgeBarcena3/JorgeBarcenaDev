const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

const errors = [];

if (!css.includes('--bg-primary: #faf8f5;') && !css.includes('--bg-primary:#faf8f5;')) {
  errors.push("Missing --bg-primary: #faf8f5 in :root");
}

if (!css.includes('--text-main: #1c1917;') && !css.includes('--text-main:#1c1917;')) {
  errors.push("Missing --text-main: #1c1917 in :root");
}

if (!css.includes('--accent-orange: #ea580c;') && !css.includes('--accent-orange:#ea580c;')) {
  errors.push("Missing --accent-orange: #ea580c in :root");
}

if (!css.includes('--border-subtle: #e7e5e4;') && !css.includes('--border-subtle:#e7e5e4;')) {
  errors.push("Missing --border-subtle: #e7e5e4 in :root");
}

if (css.includes('--accent-cyan: #38bdf8;') && css.includes('radial-gradient')) {
  // Check if hero-bg-glow is still using cyan radial gradient
  if (/hero-bg-glow[\s\S]*?radial-gradient\(circle,[\s\S]*?#38bdf8/.test(css)) {
    errors.push("Obsolete AI glow still present in hero-bg-glow");
  }
}

if (errors.length > 0) {
  console.error("FAIL - CSS tokens verification failed:\n" + errors.join('\n'));
  process.exit(1);
} else {
  console.log("PASS - CSS tokens verified correctly");
  process.exit(0);
}

