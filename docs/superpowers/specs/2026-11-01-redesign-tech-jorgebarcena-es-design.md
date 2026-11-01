# Documento de Diseño: Rediseño de tech.jorgebarcena.es

**Fecha:** 2026-11-01  
**Estado:** Aprobado / Listo para planificación  
**Autor:** Jorge Bárcena & Antigravity  
**Repositorio:** `JorgeBarcenaDev`

---

## 1. Intención y Contexto

El sitio web profesional de Jorge Bárcena pasa de su anterior configuración bajo `dev.jorgebarcena.es` al dominio definitivo:
$$\text{https://tech.jorgebarcena.es}$$

### El problema a resolver
La versión actual presenta varios patrones visuales y de redacción característicos de "plantillas generadas por IA":
- Fondo oscuro saturado con orbes difuminados de gradiente cian y violeta (`hero-bg-glow`, `shadow-glow`).
- Componente simulado de terminal macOS con botones de ventana y bloque JSON estático (`const developer = {...}`).
- Textos clichés (*"soluciones de alto impacto"*, *"necesidades complejas en sistemas robustos"*).
- Iconografía excesiva con escudos y checks en cada viñeta.
- Secciones dilatadas con rellenos genéricos (metodología ágil en 4 fases, nube de 25 tecnologías, métricas infladas).
- La faceta artística (actor e improvisador) tenía una sección protagonista ("Doble Faceta") que diluía el foco comercial y técnico.

### La solución
Rediseñar el sitio hacia un estilo **editorial técnico, luminoso, formal pero juvenil, cercano y creativo**:
- Nueva paleta basada en **Blanco Cálido / Papel** (`#faf8f5`), texto en **Carbón Profundo** (`#1c1917`) y acentos en **Naranja Terracota** (`#ea580c` / `#c2410c`).
- Proyectos reales como protagonistas de primer nivel (5 casos de estudio en producción).
- Eliminación de secciones de relleno corporativo: `#stack`, `#proceso` y métricas se integran de manera sintética y humana en "Sobre mí & Enfoque".
- Mención de la faceta escénica exclusivamente como una breve nota personal de valor (empatía y comunicación con clientes), enlazando externamente a `jorgebarcena.es`.

---

## 2. Metas, No-Metas y Anti-Metas

### Metas (Goals)
1. **Migración Completa de Dominio:** Actualizar todas las etiquetas canónicas, Open Graph, Twitter Cards, JSON-LD Schema.org, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `package.json` y el servidor Express a `tech.jorgebarcena.es`.
2. **Identidad Visual Luminosa y de Autor:** Aplicar la paleta de blanco cálido y naranja terracota sin degradados fluorescentes ni sombras exageradas.
3. **Hero Humano y Creíble:** Reemplazar el falso terminal por un titular claro y un *Bento Card* con datos reales de producción (disponibilidad en vivo, stack esencial y enlace al proyecto principal).
4. **Portfolio de Software Focalizado (5 proyectos):** NosApetece, CLOOB Football, Silla De Más, Inés Alba y Malvadas Ardillas, con capturas reales y enlaces directos a sus webs en vivo.
5. **Especialidades Claras:** 4 servicios esenciales bien explicados (SaaS/Web a medida, Backend & APIs, Integración Stripe, Consultoría/Arquitectura).
6. **"Sobre mí & Enfoque" Compacto:** Filosofía técnica pragmática, stack clave y nota personal discreta sobre el bagaje teatral como herramienta de empatía y resolución de imprevistos.
7. **Formulario de Contacto Funcional:** Mantener el envío seguro con notificación a Telegram, rate limiting y campos limpios.

### Anti-Metas (Anti-Goals)
- **Cero estética de IA:** No incluir falsas consolas de código, resplandores cian/morados, tarjetas con bordes neón ni frases infladas de marketing genérico.
- **No diluir el posicionamiento de ingeniería:** El sitio es estrictamente para servicios y proyectos de tecnología y software; no es una agencia ni un portfolio actoral.

### No-Metas (Non-Goals)
- No cambiar la infraestructura base (continúa sobre Node.js y Express 5 con HTML5 y CSS nativo de máximo rendimiento).
- No añadir frameworks JS pesados que ralenticen la carga o perjudiquen los Core Web Vitals.

---

## 3. Decisiones Tomadas con el Usuario

| Elemento | Decisión Acordada |
|---|---|
| **Nuevo Dominio** | `tech.jorgebarcena.es` |
| **Paleta de Color** | Blanco cálido / papel (`#faf8f5`), carbón profundo (`#1c1917`), naranja terracota (`#ea580c` / `#c2410c`), bordes piedra suave (`#e7e5e4`) |
| **Tono de Voz** | Joven, creativo, técnico, formal pero cercano |
| **Sección "Doble Faceta"** | Eliminada de la navegación y del contenido principal; queda como nota secundaria en "Sobre mí" |
| **Tarjeta "Jorge Bárcena Actor" en Portfolio** | Retirada del grid de proyectos para dejar 5 casos 100% de desarrollo para clientes |
| **Secciones `#stack`, `#proceso` y Métricas** | Eliminadas como secciones independientes; sintetizadas limpiamente en "Sobre mí" |

---

## 4. Arquitectura de Páginas y Secciones

El sitio queda compuesto por una estructura limpia y directa de 5 bloques:

```
[ Header: Logo tech.jorgebarcena.es | Proyectos | Especialidades | Sobre mí | CTA Contacto ]
    ↓
[ Hero: Titular directo + Lead sin humo + CTAs de acción + Bento lateral con datos en vivo ]
    ↓
[ Proyectos Reales: Grid con 5 plataformas en producción (NosApetece, CLOOB, Silla De Más, Inés Alba, Malvadas Ardillas) ]
    ↓
[ Especialidades: 4 servicios concretos (SaaS/Web Apps, APIs/Backend, Stripe/Pagos, Consultoría/Cloud) ]
    ↓
[ Sobre mí & Enfoque: Trayectoria de +6 años, stack esencial y nota discreta "Más Allá del Código" con enlace a jorgebarcena.es ]
    ↓
[ Contacto: Email directo con copiado en 1 clic + Formulario validado con Telegram + Enlace GitHub ]
    ↓
[ Footer: Identidad técnica, enlaces legales actualizados (Aviso, Privacidad, Cookies) y copyright ]
```

---

## 5. Especificaciones Técnicas para la Implementación (Para el Builder)

### 5.1. Variables CSS y Estilos (`assets/css/style.css`)
- Reemplazar las variables oscuras en `:root` por el tema de blanco cálido:
  ```css
  :root {
    --bg-primary: #faf8f5;
    --bg-secondary: #ffffff;
    --bg-card: #ffffff;
    --bg-card-hover: #fdfbf7;
    --bg-subtle: #f5f5f4;
    
    --text-main: #1c1917;
    --text-muted: #57534e;
    --text-dim: #78716c;
    
    --accent-orange: #ea580c;
    --accent-orange-hover: #c2410c;
    --accent-orange-light: #fff7ed;
    --accent-orange-border: #ffedd5;
    
    --border-subtle: #e7e5e4;
    --border-highlight: #d6d3d1;
    --border-active: #ea580c;
    
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
  ```
- Eliminar selectores obsoletos: `.hero-bg-glow`, `.portfolio-card-glow`, `.terminal-card`, `.terminal-dots`, `.gradient-text`, etc.
- Adaptar estilos de inputs del formulario, botones, modales y tarjetas para el contraste sobre fondo claro.

### 5.2. Marcado HTML (`index.html`)
- Actualizar cabecera: `<link rel="canonical" href="https://tech.jorgebarcena.es/">`, Open Graph, Twitter Cards y Schema.org graph con la nueva URL.
- Menú de navegación: solo 4 enlaces (`#proyectos`, `#especialidades`, `#sobre-mi`, `#contacto`).
- Sustituir el markup del Hero terminal por el Bento Card de producción.
- Depurar las secciones `#doble-faceta`, `#proceso`, `#stack` y `.metrics-strip`.
- Añadir en la sección `#sobre-mi` la síntesis del stack técnico esencial y el bloque discreto "Más Allá del Código".

### 5.3. Servidor y Archivos de Configuración
- `server.js`: Actualizar textos de notificaciones a Telegram para reflejar `tech.jorgebarcena.es`.
- `sitemap.xml`: Reemplazar todas las URLs a `https://tech.jorgebarcena.es/`.
- `robots.txt`: Actualizar enlace al sitemap con `https://tech.jorgebarcena.es/sitemap.xml`.
- `package.json` y `site.webmanifest`: Actualizar metadatos del proyecto.
- Páginas legales (`privacidad.html`, `aviso-legal.html`, `cookies.html`): Actualizar referencias de dominio y adaptar el diseño al tema blanco cálido.
