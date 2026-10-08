'use strict';

const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 6688;
const isProd = process.env.NODE_ENV === 'production';

// ============================================
// Compresión HTTP (Gzip/Brotli) para Optimización Core Web Vitals
// ============================================
app.use(compression());

// ============================================
// Cabeceras de Seguridad y SEO
// ============================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  }
  next();
});

// ============================================
// Redirecciones Canónicas (SEO 301)
// ============================================
app.use((req, res, next) => {
  if (req.path === '/index.html') {
    return res.redirect(301, '/');
  }
  if (req.path === '/privacidad.html') {
    return res.redirect(301, '/privacidad');
  }
  if (req.path === '/aviso-legal.html') {
    return res.redirect(301, '/aviso-legal');
  }
  if (req.path === '/cookies.html') {
    return res.redirect(301, '/cookies');
  }
  next();
});

// ============================================
// Rutas SEO Especiales (Robots, Sitemap, Manifest)
// ============================================
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/site.webmanifest', (req, res) => {
  res.type('application/manifest+json');
  res.setHeader('Cache-Control', 'public, max-age=604800');
  res.sendFile(path.join(__dirname, 'site.webmanifest'));
});

// ============================================
// Parseo de Body
// ============================================
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// ============================================
// Archivos Estáticos con Cache-Control Inteligente
// ============================================
app.use(express.static(path.join(__dirname), {
  maxAge: isProd ? '7d' : '0',
  etag: true,
  index: 'index.html',
  dotfiles: 'deny',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', isProd ? 'public, max-age=3600, must-revalidate' : 'no-cache');
    } else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2|woff|ttf)$/)) {
      res.setHeader('Cache-Control', isProd ? 'public, max-age=2592000, immutable' : 'no-cache');
    } else if (filePath.match(/\.(css|js)$/)) {
      res.setHeader('Cache-Control', isProd ? 'public, max-age=604800, stale-while-revalidate=86400' : 'no-cache');
    }
  }
}));

// ============================================
// Rate Limiter para Formulario de Contacto
// ============================================
const contactAttempts = new Map();
const WINDOW_MS = 60_000; // 1 minuto
const MAX_REQ_PER_WINDOW = 4;

const rateLimitContact = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = contactAttempts.get(ip) || { count: 0, start: now };

  if (now - record.start > WINDOW_MS) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }

  contactAttempts.set(ip, record);

  if (record.count > MAX_REQ_PER_WINDOW) {
    return res.status(429).json({
      ok: false,
      error: 'Has enviado demasiadas solicitudes. Por favor, espera un minuto antes de volver a intentarlo.'
    });
  }
  next();
};

// Limpieza de memoria cada 5 minutos
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  contactAttempts.forEach((val, key) => {
    if (val.start < cutoff) contactAttempts.delete(key);
  });
}, 5 * 60_000);

// ============================================
// Endpoint API de Contacto (/contacto)
// ============================================
app.post('/contacto', rateLimitContact, (req, res) => {
  const { name, email, projectType, budget, message, date, privacyConsent } = req.body;

  // Validaciones
  if (!privacyConsent) {
    return res.status(400).json({ ok: false, error: 'Debes aceptar la Política de Privacidad para poder enviar el mensaje.' });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 120) {
    return res.status(400).json({ ok: false, error: 'Por favor, introduce un nombre válido (mínimo 2 caracteres).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email) || email.length > 200) {
    return res.status(400).json({ ok: false, error: 'Por favor, proporciona un correo electrónico válido.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10 || message.length > 3000) {
    return res.status(400).json({ ok: false, error: 'Por favor, detalla tu mensaje (entre 10 y 3000 caracteres).' });
  }

  const cleanProjectType = (projectType && typeof projectType === 'string') ? projectType.slice(0, 80) : 'No especificado';
  const cleanBudget = (budget && typeof budget === 'string') ? budget.slice(0, 80) : 'No especificado';

  // Guardar en directorio 'contacto'
  const dirPath = path.join(__dirname, 'contacto');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const safeEmail = email.replace(/[^a-z0-9]/gi, '_').slice(0, 50);
  const timestamp = Date.now();
  const fileName = `${timestamp}_${safeEmail}.txt`;
  const filePath = path.join(dirPath, fileName);

  const parsedDate = date ? new Date(date) : new Date();
  const dateFormatted = isNaN(parsedDate.getTime())
    ? new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
    : parsedDate.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  const content = [
    '==================================================',
    '        NUEVA SOLICITUD DE PROYECTO - DEV         ',
    '==================================================',
    `Fecha:            ${dateFormatted}`,
    `Nombre:           ${name.trim()}`,
    `Email:            ${email.trim()}`,
    `Tipo de Proyecto: ${cleanProjectType}`,
    `Presupuesto aprox: ${cleanBudget}`,
    `Consentimiento:   Aceptado expresamente (RGPD)`,
    '--------------------------------------------------',
    'DETALLE DE LA SOLICITUD:',
    message.trim(),
    '==================================================',
    ''
  ].join('\n');

  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('[contacto] Error al guardar mensaje:', err);
      return res.status(500).json({ ok: false, error: 'Hubo un error al procesar tu solicitud. Inténtalo más tarde.' });
    }

    console.log(`[contacto] Mensaje guardado correctamente: ${fileName} de ${name.trim()} (${email.trim()})`);
    return res.status(200).json({
      ok: true,
      message: '¡Gracias por tu mensaje! Me pondré en contacto contigo lo antes posible.'
    });
  });
});

// ============================================
// Endpoint de Salud (/health)
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'jorgebarcena-dev',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Rutas de Información Legal
// ============================================
app.get('/aviso-legal', (req, res) => {
  res.sendFile(path.join(__dirname, 'aviso-legal.html'));
});

app.get('/privacidad', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacidad.html'));
});

app.get('/cookies', (req, res) => {
  res.sendFile(path.join(__dirname, 'cookies.html'));
});

// ============================================
// Fallback SPA
// ============================================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// Manejador Global de Errores
// ============================================
app.use((err, req, res, next) => {
  console.error('[error]', err.message);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

// ============================================
// Inicio del Servidor
// ============================================
app.listen(PORT, () => {
  console.log(`✓ Servidor dev.jorgebarcena.es activo en http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`);
});
