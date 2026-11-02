const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const errors = [];

// Check section ID
if (!html.includes('id="proyectos"')) {
  errors.push("Missing id='proyectos' on portfolio section");
}

// Check exactly 5 portfolio cards
const cardMatches = html.match(/<article class="portfolio-card"/g) || [];
if (cardMatches.length !== 5) {
  errors.push(`Expected 5 portfolio cards, found ${cardMatches.length}`);
}

// Check no jorgebarcena.es actor card inside portfolioGrid
const gridIndex = html.indexOf('id="portfolioGrid"');
const gridEndIndex = html.indexOf('</section>', gridIndex);
const gridHtml = html.slice(gridIndex, gridEndIndex);

if (gridHtml.includes('jorgebarcena.es') || gridHtml.includes('Jorge Bárcena — Actor')) {
  errors.push("Found Jorge Bárcena Actor card inside portfolioGrid");
}

// Check all 5 project domains
const expectedDomains = [
  'nosaptc.com',
  'cloobfootball.com',
  'sillademas.com',
  'inesalba.es',
  'malvadasardillas.com'
];

for (const domain of expectedDomains) {
  if (!gridHtml.includes(domain)) {
    errors.push(`Missing project domain in portfolio: ${domain}`);
  }
}

if (errors.length > 0) {
  console.error("FAIL - Portfolio verification failed:\n" + errors.join('\n'));
  process.exit(1);
} else {
  console.log("PASS - Portfolio with 5 real projects verified");
  process.exit(0);
}

