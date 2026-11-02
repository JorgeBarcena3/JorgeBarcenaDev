const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf-8');
const sitemapXml = fs.readFileSync(path.join(repoRoot, 'sitemap.xml'), 'utf-8');
const robotsTxt = fs.readFileSync(path.join(repoRoot, 'robots.txt'), 'utf-8');

console.log('===============================================================');
console.log('   AUDITORÍA INTEGRAL DE SUPER-OPTIMIZACIÓN SEO & RENDIMIENTO  ');
console.log('   Sitio Web: tech.jorgebarcena.es                             ');
console.log('===============================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const report = [];

function check(category, name, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    report.push(`[PASS] [${category}] ${name}${details ? ' -> ' + details : ''}`);
    return true;
  } else {
    report.push(`[FAIL] [${category}] ${name}${details ? ' -> ' + details : ''}`);
    return false;
  }
}

// -------------------------------------------------------------
// 1. HTML BÁSICO & METADATOS PRINCIPALES
// -------------------------------------------------------------
check('Meta', 'Idioma HTML declarado', indexHtml.includes('<html lang="es"'), 'lang="es" presente');
check('Meta', 'Charset UTF-8 declarado', indexHtml.includes('<meta charset="UTF-8"'), 'charset="UTF-8"');
check('Meta', 'Viewport responsive declarado', indexHtml.includes('name="viewport" content="width=device-width, initial-scale=1.0"'), 'width=device-width, initial-scale=1.0');

// Título
const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1].trim() : '';
const titleLen = title.length;
check('Meta', 'Etiqueta <title> presente', titleLen > 0, `"${title}" (${titleLen} caracteres)`);
check('Meta', 'Longitud de <title> óptima (30-65 caracteres)', titleLen >= 30 && titleLen <= 65, `${titleLen} chars (Google SERPs desktop & mobile friendly)`);

// Meta Description
const descMatch = indexHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/);
const desc = descMatch ? descMatch[1].trim() : '';
const descLen = desc.length;
check('Meta', 'Meta Description presente', descLen > 0, `${descLen} caracteres`);
check('Meta', 'Longitud Meta Description óptima (120-165 caracteres)', descLen >= 120 && descLen <= 165, `${descLen} chars (evita truncado en Google)`);

// Canonical URL
const canonicalMatch = indexHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
const canonical = canonicalMatch ? canonicalMatch[1] : '';
check('Meta', 'Canonical URL canónica absoluta', canonical === 'https://tech.jorgebarcena.es/', canonical);

// Robots Meta
const robotsMatch = indexHtml.match(/<meta\s+name="robots"\s+content="([^"]+)"/);
const robotsContent = robotsMatch ? robotsMatch[1] : '';
check('Meta', 'Robots meta tag index, follow', robotsContent.includes('index') && robotsContent.includes('follow') && robotsContent.includes('max-image-preview:large'), robotsContent);

// Cero referencias huérfanas al dominio anterior
check('Dominio', 'Sin referencias a dev.jorgebarcena.es en index.html', !indexHtml.includes('dev.jorgebarcena.es'), '100% limpio');

// -------------------------------------------------------------
// 2. SOCIAL MEDIA & OPEN GRAPH & TWITTER CARDS
// -------------------------------------------------------------
const ogTitle = indexHtml.includes('property="og:title"');
const ogDesc = indexHtml.includes('property="og:description"');
const ogUrl = indexHtml.includes('property="og:url" content="https://tech.jorgebarcena.es/"');
const ogImage = indexHtml.includes('property="og:image" content="https://tech.jorgebarcena.es/assets/images/jorge.png"');
const ogType = indexHtml.includes('property="og:type" content="website"');
const ogLocale = indexHtml.includes('property="og:locale" content="es_ES"');

check('OpenGraph', 'og:title configurado', ogTitle);
check('OpenGraph', 'og:description configurado', ogDesc);
check('OpenGraph', 'og:url apunta a tech.jorgebarcena.es', ogUrl);
check('OpenGraph', 'og:image apunta a tech.jorgebarcena.es/assets/images/jorge.png', ogImage);
check('OpenGraph', 'og:type website y og:locale es_ES', ogType && ogLocale);

const twCard = indexHtml.includes('name="twitter:card" content="summary_large_image"');
const twImage = indexHtml.includes('name="twitter:image" content="https://tech.jorgebarcena.es/assets/images/jorge.png"');
check('Twitter', 'Twitter Card summary_large_image configurada', twCard && twImage);

// Comprobar existencia física de og:image en disco
const ogImagePath = path.join(repoRoot, 'assets/images/jorge.png');
check('Recursos', 'Imagen social og:image existe en disco', fs.existsSync(ogImagePath), ogImagePath);

// -------------------------------------------------------------
// 3. DATOS ESTRUCTURADOS (SCHEMA.ORG JSON-LD)
// -------------------------------------------------------------
const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let schemaValid = false;
let hasWebSite = false;
let hasPerson = false;
let hasService = false;

if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    schemaValid = true;
    if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
      hasWebSite = parsed['@graph'].some(item => item['@type'] === 'WebSite' && item['@id']?.includes('tech.jorgebarcena.es'));
      hasPerson = parsed['@graph'].some(item => item['@type'] === 'Person' && item['@id']?.includes('tech.jorgebarcena.es'));
      hasService = parsed['@graph'].some(item => item['@type'] === 'ProfessionalService' && item['@id']?.includes('tech.jorgebarcena.es'));
    }
  } catch (e) {
    schemaValid = false;
  }
}

check('Schema.org', 'JSON-LD sintácticamente válido', schemaValid);
check('Schema.org', 'Schema WebSite configurado para tech.jorgebarcena.es', hasWebSite);
check('Schema.org', 'Schema Person configurado para Jorge Bárcena', hasPerson);
check('Schema.org', 'Schema ProfessionalService con ofertas configuradas', hasService);

// -------------------------------------------------------------
// 4. JERARQUÍA SEMÁNTICA DE ENCABEZADOS
// -------------------------------------------------------------
const h1Matches = indexHtml.match(/<h1[\s>]/g) || [];
check('Semántica', 'Exactamente 1 único <h1> en el documento', h1Matches.length === 1, `Total <h1> encontrados: ${h1Matches.length}`);

const h2Matches = indexHtml.match(/<h2[\s>]/g) || [];
check('Semántica', 'Secciones principales estructuradas con <h2>', h2Matches.length >= 3, `Total <h2> encontrados: ${h2Matches.length}`);

// -------------------------------------------------------------
// 5. ACCESIBILIDAD Y CORE WEB VITALS EN IMÁGENES
// -------------------------------------------------------------
const imgRegex = /<img\s+([^>]+)>/g;
let match;
let allImgsHaveAlt = true;
let allImgsHaveDimensions = true;
let totalImgs = 0;
let imgsWithoutAlt = [];
let imgsWithoutDims = [];

while ((match = imgRegex.exec(indexHtml)) !== null) {
  totalImgs++;
  const attrs = match[1];
  const hasAlt = /alt="[^"]*"/.test(attrs);
  const hasWidth = /width="\d+"/.test(attrs);
  const hasHeight = /height="\d+"/.test(attrs);

  if (!hasAlt) {
    allImgsHaveAlt = false;
    imgsWithoutAlt.push(match[0].slice(0, 50));
  }
  if (!hasWidth || !hasHeight) {
    allImgsHaveDimensions = false;
    imgsWithoutDims.push(match[0].slice(0, 50));
  }
}

check('Imágenes/CWV', 'Todas las imágenes tienen atributo alt', allImgsHaveAlt, `${totalImgs} imágenes analizadas`);
check('Imágenes/CWV', 'Todas las imágenes declaran width y height (previene CLS)', allImgsHaveDimensions, allImgsHaveDimensions ? 'Sin saltos de maquetación' : `${imgsWithoutDims.length} sin dimensiones`);

// -------------------------------------------------------------
// 6. FUENTES Y RENDIMIENTO DE RED
// -------------------------------------------------------------
const hasFontPreconnect = indexHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"') &&
                          indexHtml.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin');
check('Rendimiento', 'Preconnect para Google Fonts configurado', hasFontPreconnect);

const hasFontDisplaySwap = indexHtml.includes('display=swap');
check('Rendimiento', 'Google Fonts usa display=swap (evita FOIT)', hasFontDisplaySwap);

// -------------------------------------------------------------
// 7. RASTREABILIDAD: ROBOTS.TXT Y SITEMAP.XML
// -------------------------------------------------------------
check('Rastreo', 'robots.txt permite rastreo (Allow: /)', robotsTxt.includes('Allow: /'));
check('Rastreo', 'robots.txt enlaza sitemap https://tech.jorgebarcena.es/sitemap.xml', robotsTxt.includes('Sitemap: https://tech.jorgebarcena.es/sitemap.xml'));
check('Rastreo', 'sitemap.xml tiene https://tech.jorgebarcena.es/', sitemapXml.includes('https://tech.jorgebarcena.es/'));
check('Rastreo', 'sitemap.xml no contiene dominios obsoletos', !sitemapXml.includes('dev.jorgebarcena.es'));

// -------------------------------------------------------------
// 8. ENLACES INTERNOS EN INDEX.HTML
// -------------------------------------------------------------
const internalAnchorRegex = /href="#([a-zA-Z0-9_-]+)"/g;
let anchorMatch;
let brokenAnchors = [];
while ((anchorMatch = internalAnchorRegex.exec(indexHtml)) !== null) {
  const targetId = anchorMatch[1];
  if (!indexHtml.includes(`id="${targetId}"`)) {
    brokenAnchors.push(targetId);
  }
}

check('Navegación', 'Todos los enlaces internos (#) apuntan a IDs existentes', brokenAnchors.length === 0, brokenAnchors.length > 0 ? `IDs rotos: ${brokenAnchors.join(', ')}` : 'Todos resuelven');

// -------------------------------------------------------------
// RESULTADO FINAL
// -------------------------------------------------------------
console.log(report.join('\n'));
console.log('\n---------------------------------------------------------------');
console.log(`PUNTUACIÓN SEO: ${passedChecks} de ${totalChecks} comprobaciones aprobadas (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('---------------------------------------------------------------');

if (passedChecks === totalChecks) {
  console.log('✅ ESTADO: SUPER MEGA OPTIMIZADO PARA MOTORES DE BÚSQUEDA.');
  process.exit(0);
} else {
  console.error(`❌ ESTADO: Se encontraron ${totalChecks - passedChecks} puntos de mejora.`);
  process.exit(1);
}

