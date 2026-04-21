/* =============================================
   SENYA DESIGN — Script principal
   Fonctionnalités : curseur perso, navbar,
   scroll reveal, portfolio, formulaire, etc.
   ============================================= */

// =============================================
// 1. CURSEUR PERSONNALISÉ
// =============================================
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

// Mise à jour de la position du curseur
document.addEventListener('mousemove', (e) => {
  // Le curseur principal suit exactement la souris
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';

  // Le trail suit avec un léger retard (géré par CSS transition)
  // On utilise requestAnimationFrame pour de meilleures performances
  requestAnimationFrame(() => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top  = e.clientY + 'px';
  });
});

// Effet sur les éléments cliquables
document.addEventListener('mouseover', (e) => {
  const target = e.target;
  if (target.matches('a, button, .filter-btn, .portfolio-card, .service-card')) {
    cursor.style.width  = '28px';
    cursor.style.height = '28px';
    cursor.style.background = '#FF4D8A';
    cursorTrail.style.width  = '50px';
    cursorTrail.style.height = '50px';
  }
});
document.addEventListener('mouseout', (e) => {
  const target = e.target;
  if (target.matches('a, button, .filter-btn, .portfolio-card, .service-card')) {
    cursor.style.width  = '18px';
    cursor.style.height = '18px';
    cursor.style.background = '#FF6B9D';
    cursorTrail.style.width  = '36px';
    cursorTrail.style.height = '36px';
  }
});

// =============================================
// 2. NAVIGATION — Scroll & Hamburger
// =============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Ajout de la classe "scrolled" à la navbar lors du défilement
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Bouton retour en haut
  updateBackToTop();
});

// Menu hamburger (mobile)
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);

  // Empêcher le scroll du body quand le menu est ouvert
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Fermer le menu quand on clique sur un lien
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Navigation active selon la section visible
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', highlightNavLink);

function highlightNavLink() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// =============================================
// 3. SCROLL REVEAL (animation d'apparition)
// =============================================
const revealElements = document.querySelectorAll('.reveal');

// IntersectionObserver : déclenche l'animation quand l'élément est visible
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Délai léger décalé pour les éléments groupés
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 1000);

      // On n'observe plus l'élément après son apparition (perf)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,    // L'élément doit être visible à 12% avant de déclencher
  rootMargin: '0px 0px -60px 0px'  // Déclenche un peu avant la fin de la viewport
});

// Ajouter un délai progressif aux éléments d'une même grille
function assignGridDelays(gridSelector, delay = 0.1) {
  const grids = document.querySelectorAll(gridSelector);
  grids.forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.dataset.delay = i * delay;
    });
  });
}

assignGridDelays('.services-grid',     0.12);
assignGridDelays('.portfolio-grid',    0.10);
assignGridDelays('.testimonials-grid', 0.12);

// Lancer l'observation sur tous les éléments
revealElements.forEach(el => revealObserver.observe(el));

// =============================================
// 4. PORTFOLIO — Filtres
// =============================================
const filterButtons   = document.querySelectorAll('.filter-btn');
const portfolioItems  = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Mettre à jour le bouton actif
    filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const category = item.dataset.category;

      // Afficher ou cacher selon la catégorie
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
        // Petite animation de réapparition
        item.style.animation = 'none';
        item.offsetHeight; // force reflow
        item.style.animation = '';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// =============================================
// 5. FORMULAIRE DE CONTACT
// =============================================
const contactForm     = document.getElementById('contactForm');
const submitBtn       = document.getElementById('submitBtn');
const formNotification = document.getElementById('formNotification');

// --- Validation individuelle d'un champ ---
function validateField(fieldId, errorId, customCheck) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  if (!field || !error) return true;

  let message = '';

  // Vérification vide
  if (!field.value.trim()) {
    message = 'Ce champ est obligatoire.';
  } else if (customCheck) {
    // Vérification personnalisée (ex. format email)
    message = customCheck(field.value.trim());
  }

  if (message) {
    field.classList.add('invalid');
    error.textContent = message;
    return false;
  } else {
    field.classList.remove('invalid');
    error.textContent = '';
    return true;
  }
}

// --- Validation email ---
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Veuillez entrer une adresse email valide.';
}

// --- Validation de la case à cocher ---
function validateConsent() {
  const consent = document.getElementById('consent');
  const error   = document.getElementById('consentError');
  if (!consent.checked) {
    error.textContent = 'Vous devez accepter pour envoyer le formulaire.';
    return false;
  }
  error.textContent = '';
  return true;
}

// Validation en temps réel (quand on quitte un champ)
['name', 'email', 'service', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('blur', () => {
      if (id === 'email') {
        validateField(id, id + 'Error', isValidEmail);
      } else {
        validateField(id, id + 'Error');
      }
    });
    // Retirer l'erreur dès que l'utilisateur tape
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const error = document.getElementById(id + 'Error');
      if (error) error.textContent = '';
    });
  }
});

// --- Soumission du formulaire ---
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Masquer la notification précédente
  hideNotification();

  // Validation de tous les champs
  const isNameValid    = validateField('name',    'nameError');
  const isEmailValid   = validateField('email',   'emailError', isValidEmail);
  const isServiceValid = validateField('service', 'serviceError');
  const isMessageValid = validateField('message', 'messageError');
  const isConsentValid = validateConsent();

  // Arrêt si un champ est invalide
  if (!isNameValid || !isEmailValid || !isServiceValid || !isMessageValid || !isConsentValid) {
    // Scroll vers le premier champ invalide
    const firstInvalid = contactForm.querySelector('.invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }
    return;
  }

  // --- Simulation d'envoi (à remplacer par votre backend / Formspree) ---
  // Pour connecter un vrai service d'email, remplacez ce bloc par :
  // Option 1 — Formspree : <form action="https://formspree.io/f/VOTRE_ID" method="POST">
  // Option 2 — EmailJS : emailjs.send(...)
  // Option 3 — Votre propre API

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // Simuler une requête réseau (1.5s)
    await fakeSubmit();

    // Succès !
    showNotification('success', '✨ Merci pour votre message ! Je vous répondrai dans les 24–48h. À très vite ! 🌸');
    contactForm.reset();

    // Scroll vers la notification
    formNotification.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (err) {
    // Erreur
    showNotification('error', '😟 Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

// Simule un appel réseau (à remplacer par un vrai fetch)
function fakeSubmit() {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

function showNotification(type, message) {
  formNotification.className = 'form-notification ' + type;
  formNotification.textContent = message;
}

function hideNotification() {
  formNotification.className = 'form-notification';
  formNotification.textContent = '';
}

// =============================================
// 6. BOUTON RETOUR EN HAUT
// =============================================
const backToTopBtn = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// 7. SMOOTH SCROLL pour tous les liens d'ancre
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // Hauteur de la navbar fixe
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// =============================================
// 8. PETITES ANIMATIONS KAWAII — Particules au clic
// =============================================
// Crée des petites particules émoji lors d'un clic sur les boutons CTA
const particles = ['✦', '♡', '✿', '⭐', '🌸', '✨'];

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', (e) => {
    spawnParticles(e.clientX, e.clientY);
  });
});

function spawnParticles(x, y) {
  // Créer 6 particules
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];

    // Style de la particule
    Object.assign(particle.style, {
      position:   'fixed',
      left:       x + 'px',
      top:        y + 'px',
      fontSize:   (Math.random() * 14 + 10) + 'px',
      pointerEvents: 'none',
      zIndex:     '9999',
      userSelect: 'none',
      transform:  'translate(-50%, -50%)',
      animation:  `particleFly 0.8s ease-out forwards`,
      '--dx':     (Math.random() - 0.5) * 120 + 'px',
      '--dy':     -(Math.random() * 80 + 40) + 'px',
    });

    document.body.appendChild(particle);

    // Supprimer la particule après l'animation
    setTimeout(() => particle.remove(), 900);
  }
}

// Injection du keyframe pour les particules
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes particleFly {
    0%   { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.3); }
  }
`;
document.head.appendChild(styleSheet);

// =============================================
// 9. INITIALISATION AU CHARGEMENT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Déclencher les animations du hero si déjà visible
  highlightNavLink();
  updateBackToTop();

  // Petit délai pour éviter les flash non animés
  document.body.style.visibility = 'visible';

  console.log('🌸 Senya Design — Site chargé avec amour !');
});
