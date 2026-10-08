'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // 1. Año Actual en Footer
  // ============================================
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // 2. Menú Móvil
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Cerrar al pulsar un enlace
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // ============================================
  // 3. Sistema de Notificaciones Toast
  // ============================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 3800) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  // ============================================
  // 4. Copiar Email al Portapapeles
  // ============================================
  const copyButtons = document.querySelectorAll('[data-email]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'j.barcenalumbreras@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Correo copiado al portapapeles: ' + email, 'success');
      } catch (err) {
        // Fallback básico
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Correo copiado al portapapeles: ' + email, 'success');
      }
    });
  });

  // ============================================
  // 5. Contador de Caracteres en Textarea
  // ============================================
  const messageInput = document.getElementById('message');
  const charCountEl = document.getElementById('charCount');

  if (messageInput && charCountEl) {
    messageInput.addEventListener('input', () => {
      charCountEl.textContent = messageInput.value.length;
    });
  }

  // ============================================
  // 6. Validación y Envío del Formulario
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const projectTypeInput = document.getElementById('projectType');
  const budgetInput = document.getElementById('budget');
  const submitBtn = document.getElementById('submitBtn');
  const formStatusAlert = document.getElementById('formStatusAlert');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (nameInput) nameInput.classList.remove('invalid');
    if (emailInput) emailInput.classList.remove('invalid');
    if (messageInput) messageInput.classList.remove('invalid');
    if (formStatusAlert) {
      formStatusAlert.className = 'form-status-alert hidden';
      formStatusAlert.textContent = '';
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      let hasErrors = false;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const projectType = projectTypeInput ? projectTypeInput.value : '';
      const budget = budgetInput ? budgetInput.value : '';

      // Validación Nombre
      if (!name || name.length < 2) {
        nameError.textContent = 'Por favor, introduce tu nombre (mínimo 2 caracteres).';
        nameInput.classList.add('invalid');
        hasErrors = true;
      }

      // Validación Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailError.textContent = 'Por favor, escribe un correo electrónico válido.';
        emailInput.classList.add('invalid');
        hasErrors = true;
      }

      // Validación Mensaje
      if (!message || message.length < 10) {
        messageError.textContent = 'Por favor, detalla tu mensaje (mínimo 10 caracteres).';
        messageInput.classList.add('invalid');
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      // Estado de Carga
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      try {
        const response = await fetch('/contacto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            projectType,
            budget,
            message,
            date: new Date().toISOString()
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          formStatusAlert.className = 'form-status-alert success';
          formStatusAlert.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <strong>¡Solicitud enviada con éxito!</strong> Me pondré en contacto contigo en breve para analizar tu proyecto.
          `;
          contactForm.reset();
          if (charCountEl) charCountEl.textContent = '0';
          showToast('Mensaje enviado correctamente.', 'success');
        } else {
          const errText = data.error || 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.';
          formStatusAlert.className = 'form-status-alert error';
          formStatusAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${errText}`;
          showToast(errText, 'error');
        }
      } catch (err) {
        console.error('Error al enviar formulario:', err);
        formStatusAlert.className = 'form-status-alert error';
        formStatusAlert.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation"></i> No se pudo conectar con el servidor. Si persiste, escríbeme directamente a 
          <a href="mailto:j.barcenalumbreras@gmail.com" style="text-decoration: underline;">j.barcenalumbreras@gmail.com</a>.
        `;
        showToast('Error de red al conectar con el servidor.', 'error');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnSpinner) btnSpinner.classList.add('hidden');
      }
    });
  }

  // ============================================
  // 7. Filtros Interactivos del Portfolio
  // ============================================
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterButtons.length && portfolioCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';

        // Actualizar estado activo en botones
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filtrar tarjetas del portfolio
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }
});
