// main.js - Joao Service Mudanzas

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. BARRA DE NAVEGACIÓN STICKY Y ENLACES ACTIVOS
  // ==========================================================================
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Sticky header class scrolled
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active state in navigation
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 2. MENÚ MÓVIL
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navbarMenu = document.getElementById('navbar-menu');

  if (mobileToggle && navbarMenu) {
    mobileToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 3. EFECTO DE ESCRITURA ELEGANTE (TYPING EFFECT) EN EL HERO
  // ==========================================================================
  const typingElement = document.getElementById('hero-typing-text');
  
  if (typingElement) {
    const phrases = [
      "Empresa de Mudanzas en Santiago",
      "Tu Mudanza en Manos de Expertos",
      "Servicio Profesional y Confiable"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      typingElement.textContent = currentText;

      let typingSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
  }

  // ==========================================================================
  // 4. ANIMACIONES DE ENTRADA CON INTERSECTION OBSERVER
  // ==========================================================================
  const animElements = document.querySelectorAll('.anim-fade-in, .anim-slide-in-left, .anim-slide-in-right, .anim-zoom-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => animObserver.observe(el));

  // ==========================================================================
  // 5. SLIDER DE LA GALERÍA DE IMÁGENES
  // ==========================================================================
  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsContainer = document.getElementById('gallery-dots');
  
  if (track) {
    const slides = Array.from(track.children);
    let slideIndex = 0;
    
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('gallery-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);

    function updateDots() {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[slideIndex].classList.add('active');
    }

    function moveToSlide(index) {
      slideIndex = index;
      track.style.transform = `translateX(-${slideIndex * 100}%)`;
      updateDots();
    }

    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      moveToSlide(slideIndex);
    }

    function prevSlide() {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      moveToSlide(slideIndex);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    let autoSlideInterval = setInterval(nextSlide, 5000);

    [prevBtn, nextBtn, dotsContainer].forEach(el => {
      el.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // ==========================================================================
  // 6. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================================
  // 7. BOTÓN FLOTANTE Y CONTACTO RÁPIDO WHATSAPP
  // ==========================================================================
  const whatsappFloat = document.getElementById('whatsapp-floating-btn');
  const whatsappNumber = "56966466542";

  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', () => {
      const msg = encodeURIComponent("¡Hola! Me gustaría coordinar o recibir información sobre el servicio de mudanzas.");
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    });
  }

  // Formulario de Contacto Directo a WhatsApp
  const directContactForm = document.getElementById('direct-contact-form');
  if (directContactForm) {
    directContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('c-name').value;
      const phone = document.getElementById('c-phone').value;
      const service = document.getElementById('c-service').value;
      const date = document.getElementById('c-date').value;
      const message = document.getElementById('c-message').value;

      let waText = `*Consulta Joao Service Mudanzas* 🚛\n\n`;
      waText += `*👤 Nombre:* ${name}\n`;
      waText += `*📞 Teléfono:* ${phone}\n`;
      waText += `*📦 Servicio:* ${service}\n`;
      waText += `*📅 Fecha:* ${date}\n`;
      waText += `*📝 Detalles:* ${message}\n\n`;
      waText += `Quedo a la espera de sus comentarios.`;

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
      window.open(url, '_blank');
    });
  }

  // ==========================================================================
  // 8. SCROLL SUAVE AL COTIZADOR (EN REEMPLAZO DEL MODAL WIZARD)
  // ==========================================================================
  const openButtons = document.querySelectorAll('.open-cotizador-btn');
  const targetSection = document.getElementById('calculadora');

  if (openButtons && targetSection) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ==========================================================================
  // 9. ANIMACIÓN DE NÚMEROS DINÁMICOS (COUNTERS)
  // ==========================================================================
  const statCounts = document.querySelectorAll('.stat-count');
  
  function animateCounters() {
    statCounts.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const stepTime = 30; // ~33 FPS
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Format with thousands separator if needed
        if (target >= 1000) {
          counter.textContent = Math.floor(current).toLocaleString('es-CL');
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && statCounts.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 10. REPRODUCTOR DE VÍDEO CORPORATIVO CON CONTROLADORES Y PLAY OVERLAY
  // ==========================================================================
  const corpVideo = document.getElementById('corporate-video-el');
  const playOverlay = document.getElementById('video-play-overlay');

  if (corpVideo && playOverlay) {
    // Click on the overlay plays the video
    playOverlay.addEventListener('click', () => {
      corpVideo.play();
    });

    // When the video plays, hide overlay and show native controls
    corpVideo.addEventListener('play', () => {
      playOverlay.classList.add('hidden');
      corpVideo.setAttribute('controls', 'true');
    });

    // When paused, show overlay and remove native controls (for luxury look)
    corpVideo.addEventListener('pause', () => {
      playOverlay.classList.remove('hidden');
      corpVideo.removeAttribute('controls');
    });

    // When ended, show overlay and remove native controls
    corpVideo.addEventListener('ended', () => {
      playOverlay.classList.remove('hidden');
      corpVideo.removeAttribute('controls');
    });
  }

});
