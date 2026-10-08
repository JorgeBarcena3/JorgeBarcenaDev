# 💻 Jorge Bárcena — Software Engineer & Tech Consultant (dev.jorgebarcena.es)

Web profesional y portfolio de **Jorge Bárcena**, Ingeniero de Software con más de 6 años de experiencia creando soluciones de software personalizadas, plataformas SaaS, APIs de alto rendimiento y arquitecturas web para empresas y proyectos.

URL de producción: **[https://dev.jorgebarcena.es](https://dev.jorgebarcena.es)**

Este proyecto complementa y se enlaza de forma fluida con su faceta artística de actor e improvisador teatral disponible en **[https://jorgebarcena.es](https://jorgebarcena.es)**.

---

## 🚀 Características Principales

- **Frontend Moderno & Alto Rendimiento:**
  - Diseño responsive y optimizado para escritorio, tablet y móvil.
  - Estética *Dark Mode* tecnológica (tonos slate, cyan y acentos oro para la faceta actoral).
  - Terminal interactiva con perfil, stack tecnológico y copia de correo con 1 clic.
  - Notificaciones Toast personalizadas y validación de formularios en tiempo real.
  - Conexión cruzada con la web de actor ([jorgebarcena.es](https://jorgebarcena.es)).
  - Accesibilidad semántica y metadatos SEO / Open Graph estructurados (Schema.org Person).

- **Backend Robusto & Ligero (Node.js / Express):**
  - Servidor Express en `server.js` con cabeceras de seguridad HTTP (`nosniff`, `SAMEORIGIN`, `strict-origin`, etc.).
  - Endpoint `/contacto` con limitador de tasa de peticiones en memoria (Rate Limiter).
  - Almacenamiento seguro de solicitudes en la carpeta `contacto/`.
  - Endpoint de salud `/health` para monitorización de uptime.

- **DevOps & Despliegue:**
  - `Dockerfile` con Node 20 Alpine listo para producción.
  - `docker-compose.yml` mapeado al puerto `6688` (evitando colisión con otros servicios).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 semántico, CSS3 moderno (Variables, Flexbox, CSS Grid), JavaScript ES6+.
- **Backend:** Node.js, Express.js.
- **Herramientas & Despliegue:** Docker, Docker Compose, Git.

---

## 📦 Puesta en Marcha Local

### 1. Requisitos
- Node.js (>= 18.x) y npm.

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Modo Desarrollo
```bash
npm run dev
```
Accede desde tu navegador en: [http://localhost:6688](http://localhost:6688)

---

## 🐳 Despliegue con Docker

Para construir y levantar el contenedor en segundo plano:

```bash
docker compose up -d --build
```

El servicio estará disponible en `http://127.0.0.1:6688`.

Para ver los logs del contenedor:
```bash
docker compose logs -f
```

---

## 📂 Estructura del Proyecto

```plaintext
/home/jorge/JorgeBarcenaDev/
├── assets/
│   ├── css/
│   │   └── style.css            # Estilos CSS, diseño responsive y temas
│   ├── images/
│   │   ├── favicon.svg          # Favicon moderno SVG / ICO / PNG
│   │   ├── jorge.png            # Fotografía profesional de Jorge Bárcena
│   │   └── portfolio/           # Capturas de proyectos en producción
│   └── js/
│       └── main.js              # Validación, toast, menú móvil y formulario
├── contacto/                    # Almacenamiento de solicitudes (.txt)
├── docker-compose.yml           # Configuración Docker Compose
├── Dockerfile                   # Imagen Docker ligera de producción
├── index.html                   # Documento principal y secciones
├── package.json                 # Dependencias y scripts de Node.js
├── README.md                    # Documentación del proyecto
└── server.js                    # Servidor Express, seguridad y API
```

---

## 🎭 La Doble Faceta: Software + Actuación

Jorge Bárcena une dos mundos creativos y metódicos:
1. **Ingeniero de Software:** Más de 6 años creando soluciones a medida, arquitectura limpia y código escalable.
2. **Actor e Improvisador:** Formado en interpretación teatral, aplicando la escucha activa, la resolución ágil de imprevistos y la comunicación empática al desarrollo de software.
   - Web oficial de actor: [https://jorgebarcena.es](https://jorgebarcena.es)

---

## 📬 Contacto

- **Email:** [j.barcenalumbreras@gmail.com](mailto:j.barcenalumbreras@gmail.com)
- **GitHub:** [github.com/JorgeBarcena3](https://github.com/JorgeBarcena3)
