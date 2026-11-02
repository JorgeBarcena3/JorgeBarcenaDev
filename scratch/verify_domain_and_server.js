const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

const criticalFiles = [
  'server.js',
  'sitemap.xml',
  'robots.txt',
  'site.webmanifest',
  'package.json',
  'index.html',
  'privacidad.html',
  'aviso-legal.html',
  'cookies.html',
  'README.md',
  '.env.example'
];

const errors = [];

for (const file of criticalFiles) {
  const filePath = path.join(repoRoot, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing critical file: ${file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('dev.jorgebarcena.es')) {
    errors.push(`${file} still contains 'dev.jorgebarcena.es'`);
  }
}

// Verificar server.js contiene tech.jorgebarcena.es
const serverJs = fs.readFileSync(path.join(repoRoot, 'server.js'), 'utf-8');
if (!serverJs.includes('tech.jorgebarcena.es')) {
  errors.push(`server.js does not reference 'tech.jorgebarcena.es'`);
}

// Verificar sitemap.xml contiene https://tech.jorgebarcena.es/
const sitemapXml = fs.readFileSync(path.join(repoRoot, 'sitemap.xml'), 'utf-8');
if (!sitemapXml.includes('https://tech.jorgebarcena.es/')) {
  errors.push(`sitemap.xml does not reference 'https://tech.jorgebarcena.es/'`);
}

// Verificar robots.txt contiene https://tech.jorgebarcena.es
const robotsTxt = fs.readFileSync(path.join(repoRoot, 'robots.txt'), 'utf-8');
if (!robotsTxt.includes('https://tech.jorgebarcena.es/sitemap.xml')) {
  errors.push(`robots.txt does not reference 'https://tech.jorgebarcena.es/sitemap.xml'`);
}

if (errors.length > 0) {
  console.error('FAIL - Domain & Server verification failed:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('PASS - Domain migration and server configuration verified successfully');
}

