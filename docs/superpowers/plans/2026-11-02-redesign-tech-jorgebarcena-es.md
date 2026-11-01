# Rediseño tech.jorgebarcena.es Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la web profesional de Jorge Bárcena eliminando por completo cualquier estética o cliché de "web generada por IA", adoptando una identidad luminosa en blanco cálido y terracota, integrando stack y filosofía de trabajo de forma compacta en "Sobre mí", y migrando el dominio definitivo a `tech.jorgebarcena.es`.

**Architecture:** Arquitectura estática ultrarrápida (HTML5 semántico, CSS3 moderno con variables `:root`, JavaScript ES6+ nativo) servida por Node.js con Express 5. Se elimina el código visual superfluo (orbes de gradiente cian, ventanas de terminal ficticias, nubes de 25 tecnologías y secciones infladas de metodología) sustituyéndolo por tipografía editorial de alto contraste, tarjetas Bento de producción y foco en 5 proyectos reales de software.

**Tech Stack:** HTML5, CSS3 (Custom Properties, Flexbox & Grid), JavaScript nativo (ES6+), Node.js, Express 5.

**Spec:** `docs/superpowers/specs/2026-11-01-redesign-tech-jorgebarcena-es-design.md`

## Global Constraints
- **Dominio Canónico:** Estrictamente `https://tech.jorgebarcena.es/` en metadatos, Schema.org, Open Graph, Twitter Cards, sitemap, robots y cabeceras de servidor.
- **Paleta de Color:** Fondo papel cálido (`#faf8f5`), texto carbón profundo (`#1c1917`), acentos naranja terracota (`#ea580c` / `#c2410c`) y bordes piedra suave (`#e7e5e4`).
- **Cero Clichés de IA:** Prohibidos los halos de gradiente cian/violeta difuminados, el falso terminal macOS con botones rojo/amarillo/verde, el JSON simulado (`const developer = {...}`) y los badges redundantes de escudos en cada párrafo.
- **Tratamiento del Teatro:** Solo una mención personal breve y secundaria dentro de "Sobre mí", con enlace externo a `jorgebarcena.es`. No es un servicio de negocio ni una sección de navegación principal.
- **Portfolio:** Exactamente 5 proyectos reales de software para clientes (NosApetece, CLOOB Football, Silla De Más, Inés Alba y Malvadas Ardillas). Se retira la tarjeta de "Jorge Bárcena Actor" del portfolio.
- **Preservación Backend:** El servidor Express 5 debe mantener su compresión HTTP, rate limiting, cabeceras seguras y notificaciones Telegram con el nuevo dominio.

## Review Focus
1. **Contraste y legibilidad en modo claro:** Inputs del formulario, placeholders, textos secundarios y alertas deben cumplir WCAG AA sobre `#faf8f5`.
2. **Navegación e IDs de anclaje:** Los 4 enlaces del header (`#proyectos`, `#especialidades`, `#sobre-mi`, `#contacto`) deben coincidir exactamente con los IDs de las secciones sin enlaces rotos.
3. **Sincronización móvil:** El menú desplegable móvil (`#mobileNav`) debe reflejar exactamente la misma estructura de 4 enlaces que el menú desktop.
4. **Cero referencias huérfanas al dominio anterior:** Ningún archivo de producción debe conservar `dev.jorgebarcena.es` en URLs canónicas, enlaces o metadatos.
5. **Comportamiento del formulario de contacto:** La validación en frontend y el payload enviado a Telegram deben ejecutarse sin errores en el nuevo diseño.

---

### Task 1: Paleta CSS & Tokens de Diseño en Blanco Cálido

**Files:**
- Modify: `assets/css/style.css:1-120`
- Test: Inspección de variables y ausencia de clases obsoletas de resplandor

**Interfaces:**
- Consumes: Tokens de diseño especificados en la sección 5.1 del documento de diseño.
- Produces: Variables `:root` en modo claro (`--bg-primary: #faf8f5; --text-main: #1c1917; --accent-orange: #ea580c; etc.`) consumidas por todas las secciones.

- [ ] **Step 1: Escribir test de verificación de tokens CSS**
Crear script de comprobación temporal `scratch/verify_css_tokens.js` que lea `assets/css/style.css` y compruebe que `:root` contiene `--bg-primary: #faf8f5`, `--accent-orange: #ea580c`, y que las clases `.hero-bg-glow` y `.terminal-dots` no tienen reglas activas de resplandor.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_css_tokens.js`
Expected: FAIL indicando que los tokens actuales son oscuros (`#070b14`).

- [ ] **Step 3: Actualizar tokens `:root` y estilos base en `assets/css/style.css`**
Sustituir las variables oscuras por la paleta de blanco cálido, carbón profundo y naranja terracota. Reajustar fondos del body, bordes de tarjetas, sombras táctiles (`rgba(0,0,0,0.04)`), y eliminar selectores de glow artificial.

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_css_tokens.js`
Expected: PASS con confirmación de tokens limpios.

- [ ] **Step 5: Commit**
```bash
git add assets/css/style.css scratch/verify_css_tokens.js
git commit -m "style: define warm-white and terracotta css design tokens"
```

---

### Task 2: Rediseño de Cabecera y Hero Bento

**Files:**
- Modify: `index.html:175-350`
- Modify: `assets/css/style.css:121-450`

**Interfaces:**
- Consumes: Tokens CSS definidos en Task 1.
- Produces: Cabecera con 4 enlaces (`#proyectos`, `#especialidades`, `#sobre-mi`, `#contacto`), estado `● Disponible`, CTA `Hablemos`, y sección Hero con titular de producto y tarjeta Bento lateral (disponibilidad en vivo, stack esencial y enlace al proyecto principal).

- [ ] **Step 1: Escribir test de comprobación estructural del Hero y Header**
Crear script `scratch/verify_hero.js` que compruebe que en `index.html`:
  - No existe `.terminal-card` ni `.terminal-dots`.
  - Existe la navegación con los 4 IDs correctos (`#proyectos`, `#especialidades`, `#sobre-mi`, `#contacto`).
  - La marca de cabecera contiene `tech.jorgebarcena.es`.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_hero.js`
Expected: FAIL con detección del falso terminal y dominio antiguo.

- [ ] **Step 3: Implementar la nueva cabecera y Hero en `index.html` y sus estilos en `style.css`**
  - Reemplazar la barra de navegación desktop y móvil con los 4 enlaces acordados.
  - Eliminar la tarjeta terminal macOS con el falso JSON.
  - Construir el Bento Card del Hero con foco de producción en Madrid (UTC+1), stack clave (Node, React, Postgres, Docker) y llamada a la acción limpia.
  - Añadir estilos CSS limpios para el Bento y la cabecera clara.

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_hero.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add index.html assets/css/style.css scratch/verify_hero.js
git commit -m "feat(hero): replace fake terminal with production bento card and clean header"
```

---

### Task 3: Portfolio Focalizado en 5 Proyectos de Software para Clientes

**Files:**
- Modify: `index.html:480-940`
- Modify: `assets/css/style.css:451-800`

**Interfaces:**
- Consumes: Estructura del grid de portfolio.
- Produces: Grid de 5 proyectos reales de software (NosApetece, CLOOB Football, Silla De Más, Inés Alba y Malvadas Ardillas), sin la tarjeta actoral de Jorge Bárcena.

- [ ] **Step 1: Escribir test de validación de proyectos del portfolio**
Crear script `scratch/verify_portfolio.js` que verifique que:
  - Existen exactamente 5 artículos `.portfolio-card`.
  - No existe ninguna tarjeta con título o enlace a `jorgebarcena.es` dentro del grid `#portfolioGrid`.
  - Los 5 proyectos presentes son: `nosaptc.com`, `cloobfootball.com`, `sillademas.com`, `inesalba.es`, `malvadasardillas.com`.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_portfolio.js`
Expected: FAIL indicando que actualmente hay 6 tarjetas incluyendo la de actor.

- [ ] **Step 3: Actualizar el HTML del portfolio y los estilos de tarjetas en `style.css`**
  - Retirar la tarjeta "Jorge Bárcena — Actor" del grid.
  - Ajustar el contador de proyectos en los filtros (5 proyectos).
  - Adaptar las tarjetas al fondo blanco (`#ffffff`), bordes sutiles piedra (`#e7e5e4`), tags en tipografía mono limpia y badges en naranja terracota.

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_portfolio.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add index.html assets/css/style.css scratch/verify_portfolio.js
git commit -m "feat(portfolio): focus grid on 5 real software projects and remove actor card"
```

---

### Task 4: Especialidades y "Sobre mí" (Integración de Stack y Mención Teatral)

**Files:**
- Modify: `index.html:370-480` y `index.html:940-1210`
- Modify: `assets/css/style.css:801-1400`

**Interfaces:**
- Consumes: Secciones intermedias.
- Produces: Sección `#especialidades` con 4 servicios clave, supresión de `#stack`, `#proceso` y `.metrics-strip`, y sección `#sobre-mi` con trayectoria, stack esencial y el bloque discreto "Más Allá del Código" hacia `jorgebarcena.es`.

- [ ] **Step 1: Escribir test de verificación de secciones intermedias**
Crear script `scratch/verify_about_and_services.js` que verifique:
  - No existen las secciones independientes `#stack`, `#proceso`, ni `#doble-faceta`.
  - Existe la sección con ID `sobre-mi` conteniendo el bloque `Más Allá del Código` y el enlace a `jorgebarcena.es`.
  - Existe la sección con ID `especialidades` con exactamente 4 tarjetas de servicios.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_about_and_services.js`
Expected: FAIL indicando la presencia de las secciones antiguas.

- [ ] **Step 3: Refactorizar HTML y CSS de servicios y perfil en `index.html`**
  - Depurar el marcado eliminando los bloques `#proceso`, `#stack`, `.metrics-strip` y `#doble-faceta`.
  - Ajustar `#especialidades` a 4 soluciones concretas (SaaS, Backend & APIs, Pasarelas de Pago Stripe, Consultoría/Arquitectura).
  - Diseñar en `#sobre-mi` la síntesis del criterio técnico de Jorge, el stack clave y la caja discreta "Más Allá del Código".

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_about_and_services.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add index.html assets/css/style.css scratch/verify_about_and_services.js
git commit -m "feat(content): streamline specialties and integrate stack and acting note into about section"
```

---

### Task 5: Formulario de Contacto, Footer y Adaptación de Páginas Legales

**Files:**
- Modify: `index.html:1210-1455`
- Modify: `privacidad.html`
- Modify: `aviso-legal.html`
- Modify: `cookies.html`
- Modify: `assets/css/style.css`

**Interfaces:**
- Consumes: Estilos de inputs y modales.
- Produces: Formulario con estética clara y validación activa, pie de página con enlaces actualizados a `tech.jorgebarcena.es` y páginas legales adaptadas a la nueva paleta.

- [ ] **Step 1: Escribir test de validación de footer, formulario y legales**
Crear script `scratch/verify_contact_and_legal.js` que verifique:
  - El selector de tipo de servicio en el formulario de contacto coincide con las 4 especialidades.
  - En `index.html`, `privacidad.html`, `aviso-legal.html` y `cookies.html`, el texto visible y enlaces señalan a `tech.jorgebarcena.es`.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_contact_and_legal.js`
Expected: FAIL por referencias a `dev.jorgebarcena.es`.

- [ ] **Step 3: Adaptar formulario, footer y páginas legales**
  - Ajustar colores de inputs, bordes, estados focus, mensajes de error y botón de envío en el formulario de contacto.
  - Actualizar el footer con la marca `tech.jorgebarcena.es`.
  - Reemplazar en `privacidad.html`, `aviso-legal.html` y `cookies.html` las referencias de dominio e importar la paleta blanco cálido.

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_contact_and_legal.js`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add index.html privacidad.html aviso-legal.html cookies.html assets/css/style.css scratch/verify_contact_and_legal.js
git commit -m "feat(contact-legal): adapt contact form, footer and legal pages to tech.jorgebarcena.es"
```

---

### Task 6: Migración de Metadatos SEO, Servidor Express y Verificación Integral

**Files:**
- Modify: `server.js`
- Modify: `sitemap.xml`
- Modify: `robots.txt`
- Modify: `site.webmanifest`
- Modify: `package.json`
- Modify: `index.html` (metadatos `<head>`)

**Interfaces:**
- Consumes: Configuración del proyecto y endpoints.
- Produces: Ecosistema 100% libre de referencias al dominio obsoleto `dev.jorgebarcena.es` y servidor Express verificado.

- [ ] **Step 1: Escribir test integral de verificación de dominio y salud del servidor**
Crear script `scratch/verify_domain_and_server.js` que:
  - Busque de forma recursiva en los archivos fuente (`index.html`, `server.js`, `sitemap.xml`, `robots.txt`, `site.webmanifest`, `package.json`) y confirme 0 ocurrencias de `dev.jorgebarcena.es`.
  - Inicie brevemente una instancia de prueba de `server.js` y compruebe que responde `200 OK` en `/` y en `/sitemap.xml`.

- [ ] **Step 2: Ejecutar test para comprobar que falla inicialmente**
Run: `node scratch/verify_domain_and_server.js`
Expected: FAIL indicando ocurrencias de `dev.jorgebarcena.es` en `server.js`, `sitemap.xml`, etc.

- [ ] **Step 3: Actualizar todas las referencias de dominio en backend y metadatos**
  - Reemplazar en `server.js` el texto de notificación a Telegram (`📬 Nueva solicitud de contacto — tech.jorgebarcena.es`).
  - Actualizar `sitemap.xml` y `robots.txt` con `https://tech.jorgebarcena.es/`.
  - Actualizar `site.webmanifest` y `package.json`.
  - Actualizar en `index.html` los bloques JSON-LD Schema.org (`@id: https://tech.jorgebarcena.es/#website`, etc.).

- [ ] **Step 4: Ejecutar test para comprobar que pasa**
Run: `node scratch/verify_domain_and_server.js`
Expected: PASS con 0 ocurrencias de dominio antiguo y servidor respondiendo correctamente.

- [ ] **Step 5: Limpieza de scripts temporales y commit final**
```bash
rm -rf scratch/
git add server.js sitemap.xml robots.txt site.webmanifest package.json index.html
git commit -m "feat(domain): complete migration to tech.jorgebarcena.es across all metadata and server"
```
