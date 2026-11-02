const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf-8');
const privacidadHtml = fs.readFileSync(path.join(repoRoot, 'privacidad.html'), 'utf-8');
const avisoLegalHtml = fs.readFileSync(path.join(repoRoot, 'aviso-legal.html'), 'utf-8');
const cookiesHtml = fs.readFileSync(path.join(repoRoot, 'cookies.html'), 'utf-8');

const errors = [];

// 1. Verificar opciones de select projectType en index.html
if (!indexHtml.includes('value="webapp"') || !indexHtml.includes('value="backend"') || !indexHtml.includes('value="automation"') || !indexHtml.includes('value="consulting"')) {
  errors.push('index.html: select #projectType must have options for webapp, backend, automation, and consulting');
}

// 2. Footer de index.html debe incluir tech.jorgebarcena.es y año 2026
if (!indexHtml.includes('tech.jorgebarcena.es')) {
  errors.push('index.html: must reference tech.jorgebarcena.es');
}

if (!indexHtml.includes('2026')) {
  errors.push('index.html: footer must reference year 2026');
}

// 3. Ningún archivo legal o index debe tener dev.jorgebarcena.es
const files = [
  { name: 'index.html', content: indexHtml },
  { name: 'privacidad.html', content: privacidadHtml },
  { name: 'aviso-legal.html', content: avisoLegalHtml },
  { name: 'cookies.html', content: cookiesHtml }
];

for (const file of files) {
  if (file.content.includes('dev.jorgebarcena.es')) {
    errors.push(`${file.name}: still contains dev.jorgebarcena.es`);
  }
}

// 4. Archivos legales deben referenciar tech.jorgebarcena.es
for (const file of [files[1], files[2], files[3]]) {
  if (!file.content.includes('tech.jorgebarcena.es')) {
    errors.push(`${file.name}: should reference tech.jorgebarcena.es`);
  }
}

if (errors.length > 0) {
  console.error('FAIL - Contact and Legal verification failed:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('PASS - Contact and Legal pages verified successfully');
}

