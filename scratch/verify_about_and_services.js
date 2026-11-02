const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const errors = [];

// 1. Check no standalone obsolete sections
if (html.includes('id="stack"') || html.includes('class="stack-section"')) {
  errors.push("Obsolete standalone #stack section still present");
}

if (html.includes('id="proceso"') || html.includes('class="process-section"')) {
  errors.push("Obsolete standalone #proceso section still present");
}

if (html.includes('metrics-strip') || html.includes('metrics-grid')) {
  errors.push("Obsolete metrics strip still present");
}

if (html.includes('id="doble-faceta"') || html.includes('dual-identity-section')) {
  errors.push("Obsolete standalone #doble-faceta section still present");
}

// 2. Check #especialidades section with 4 services
if (!html.includes('id="especialidades"')) {
  errors.push("Missing section id='especialidades'");
}

const serviceCardMatches = html.match(/<article class="service-card/g) || [];
if (serviceCardMatches.length !== 4) {
  errors.push(`Expected 4 service cards in especialidades, found ${serviceCardMatches.length}`);
}

// 3. Check #sobre-mi section
if (!html.includes('id="sobre-mi"')) {
  errors.push("Missing section id='sobre-mi'");
}

if (!html.includes('Más Allá del Código') && !html.includes('Más allá del código')) {
  errors.push("Missing discreet personal note 'Más Allá del Código' in sobre-mi");
}

if (!html.includes('https://jorgebarcena.es')) {
  errors.push("Missing link to jorgebarcena.es in personal note");
}

// 4. Check sequence: hero -> proyectos -> especialidades -> sobre-mi -> contacto
const heroPos = html.indexOf('id="hero"');
const proyectosPos = html.indexOf('id="proyectos"');
const especialidadesPos = html.indexOf('id="especialidades"');
const sobreMiPos = html.indexOf('id="sobre-mi"');
const contactoPos = html.indexOf('id="contacto"');

if (proyectosPos < heroPos || especialidadesPos < proyectosPos || sobreMiPos < especialidadesPos || contactoPos < sobreMiPos) {
  errors.push(`Section order mismatch: expected hero(${heroPos}) -> proyectos(${proyectosPos}) -> especialidades(${especialidadesPos}) -> sobre-mi(${sobreMiPos}) -> contacto(${contactoPos})`);
}

if (errors.length > 0) {
  console.error("FAIL - About and Services verification failed:\n" + errors.join('\n'));
  process.exit(1);
} else {
  console.log("PASS - Streamlined Especialidades and Sobre mí sections verified");
  process.exit(0);
}

