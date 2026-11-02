const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const errors = [];

if (html.includes('terminal-card') || html.includes('terminal-dots')) {
  errors.push("Obsolete fake macOS terminal component still present in index.html");
}

if (!html.includes('tech.jorgebarcena.es')) {
  errors.push("Brand or header does not contain tech.jorgebarcena.es");
}

if (!html.includes('href="#proyectos"') || !html.includes('href="#especialidades"') || !html.includes('href="#sobre-mi"') || !html.includes('href="#contacto"')) {
  errors.push("Navigation links do not match the required 4 sections (#proyectos, #especialidades, #sobre-mi, #contacto)");
}

if (!html.includes('hero-bento-card') && !html.includes('hero-bento')) {
  errors.push("Missing hero bento production card");
}

if (errors.length > 0) {
  console.error("FAIL - Hero and Header verification failed:\n" + errors.join('\n'));
  process.exit(1);
} else {
  console.log("PASS - Hero and Header structure verified");
  process.exit(0);
}

