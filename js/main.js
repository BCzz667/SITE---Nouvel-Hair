/* ============================================================
   Nouvel Hair — main.js
   Salon de coiffure mixte · La Seyne-sur-Mer (83500)
   ============================================================

   TABLE DES MATIÈRES
   ──────────────────────────────────────────────────────────
   01. Theme switcher        (Palette A ↔ B)
   02. Header scroll         (shrink + background on scroll)
   03. Mobile nav            (burger + overlay)
   04. Active nav link       (highlight section courante)
   05. Reveal on scroll      (IntersectionObserver)
   06. Services tabs         (onglets accessibles)
   07. Gallery lightbox      (ouvrir / naviguer / fermer)
   08. Form validation       (front uniquement — brancher backend)
   09. Chiffres & dates dynamiques (ancienneté, expérience, années)
   ============================================================ */

'use strict';

/* ── Utilitaires ─────────────────────────────────────────── */

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ══ DATES DE RÉFÉRENCE — SOURCE UNIQUE DE VÉRITÉ ══════════════
   Tous les chiffres d'ancienneté affichés sur le site (ancienneté du
   salon, expérience de la patronne, années depuis la reprise, année
   des crédits…) sont calculés à partir des ANNÉES FIXES ci-dessous.

   ► Le site se met à jour TOUT SEUL chaque 1er janvier.
     Aucune intervention annuelle n'est nécessaire.

   ► POUR CORRIGER UN CHIFFRE : ne modifiez QUE l'année d'origine
     ci-dessous, jamais les nombres affichés dans index.html.
     Exemple : si le salon a en réalité été créé en 1989, remplacez
     1991 par 1989 — tous les « X ans » du site suivent aussitôt.

   Vérification (en 2026) :
     2026 − 1991 = 35 ans d'existence du salon
     2026 − 1999 = 27 ans de métier pour Jess
     2026 − 2021 =  5 ans depuis la reprise                        */

const ANNEE_CREATION_SALON = 1991; // création du salon        → « 35 ans » en 2026
const ANNEE_DEBUT_METIER   = 1999; // début de métier de Jess  → « 27 ans » en 2026
const ANNEE_REPRISE        = 2021; // reprise du salon par Jess (affichée telle quelle)

/* Nombre d'années écoulées depuis une année donnée. */
function anneesDepuis(annee) {
  return new Date().getFullYear() - annee;
}


/* ── 01. Theme switcher ───────────────────────────────────── */
/* Bascule entre data-theme="light" (Palette A) et data-theme="dark" (Palette B).
   La préférence est sauvegardée dans localStorage. */

(function initTheme() {
  const btn  = qs('#themeToggle');
  const root = document.documentElement;

  // Lire la préférence stockée, sinon system preference, sinon "light"
  const stored = localStorage.getItem('nh-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme  = stored || system;

  applyTheme(theme);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = root.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('nh-theme', next);
  });

  function applyTheme(t) {
    root.dataset.theme = t;
    if (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    }
  }
})();


/* ── 02. Header scroll ────────────────────────────────────── */
/* Ajoute la classe .scrolled au header quand on scrolle > 80 px */

(function initHeaderScroll() {
  const header = qs('#header');
  if (!header) return;

  let ticking = false;

  function update() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // état initial
})();


/* ── 03. Mobile nav ───────────────────────────────────────── */
/* Burger → ouvre le tiroir nav ; overlay ou Échap → ferme */

(function initMobileNav() {
  const burger  = qs('#burger');
  const navList = qs('#nav-links');
  const overlay = qs('#navOverlay');
  if (!burger || !navList) return;

  function open() {
    navList.classList.add('open');
    overlay.classList.add('visible');
    overlay.removeAttribute('aria-hidden');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    document.body.classList.add('nav-open');
    // Focus premier lien
    const first = qs('a', navList);
    if (first) first.focus();
  }

  function close() {
    navList.classList.remove('open');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('nav-open');
    burger.focus();
  }

  burger.addEventListener('click', () => {
    navList.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('open')) close();
  });

  // Fermer quand on clique sur un lien de nav (mobile)
  qsa('.nav-link', navList).forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 900) close();
    });
  });
})();


/* ── 04. Active nav link ──────────────────────────────────── */
/* Met en évidence le lien nav correspondant à la section visible */

(function initActiveNav() {
  const sections = qsa('main section[id]');
  const links    = qsa('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        const target = link.getAttribute('href').slice(1);
        link.classList.toggle('active', target === id);
      });
    });
  }, {
    rootMargin: '-40% 0px -55% 0px', // déclenchement au tiers supérieur du viewport
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
})();


/* ── 05. Reveal on scroll ─────────────────────────────────── */
/* Anime les éléments .reveal à leur apparition dans le viewport */

(function initReveal() {
  const elements = qsa('.reveal');
  if (!elements.length) return;

  // Si l'utilisateur préfère réduire les mouvements, tout est déjà visible via CSS
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // n'observer qu'une fois
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();


/* ── 06. Services tabs ────────────────────────────────────── */
/* Gestion des onglets accessibles (rôles ARIA, clavier) */

(function initTabs() {
  const tablist = qs('[role="tablist"]');
  if (!tablist) return;

  const tabs   = qsa('[role="tab"]',   tablist);
  const panels = qsa('[role="tabpanel"]');

  function activate(tab) {
    // Désactiver tous
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(p => {
      p.classList.remove('active');
      p.hidden = true;
    });

    // Activer le tab sélectionné
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');
    const panel = qs(`#${tab.getAttribute('aria-controls')}`);
    if (panel) {
      panel.classList.add('active');
      panel.hidden = false;
    }
  }

  tabs.forEach((tab, i) => {
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    tab.addEventListener('click', () => activate(tab));

    // Navigation clavier (flèches)
    tab.addEventListener('keydown', (e) => {
      let idx = tabs.indexOf(e.currentTarget);
      if (e.key === 'ArrowRight') { idx = (idx + 1) % tabs.length; tabs[idx].focus(); activate(tabs[idx]); }
      if (e.key === 'ArrowLeft')  { idx = (idx - 1 + tabs.length) % tabs.length; tabs[idx].focus(); activate(tabs[idx]); }
      if (e.key === 'Home')       { tabs[0].focus(); activate(tabs[0]); }
      if (e.key === 'End')        { tabs[tabs.length-1].focus(); activate(tabs[tabs.length-1]); }
    });
  });
})();


/* ── 07. Gallery lightbox ─────────────────────────────────── */
/* Clic sur un item → lightbox plein écran, navigation flèches + clavier */

(function initLightbox() {
  const items   = qsa('.gallery-item');
  const lb      = qs('#lightbox');
  const lbClose = qs('#lightboxClose');
  const lbPrev  = qs('#lightboxPrev');
  const lbNext  = qs('#lightboxNext');
  const lbWrap  = qs('#lightboxImgWrap');
  const lbCap   = qs('#lightboxCaption');
  const lbCount = qs('#lightboxCounter');
  const lbBg    = qs('#lightboxBackdrop');

  if (!lb || !items.length) return;

  let current = 0;
  let lastFocus = null;

  const data = items.map(item => ({
    src:         item.dataset.src || '',
    alt:         item.dataset.alt || 'Réalisation Nouvel Hair',
    placeholder: item.dataset.placeholder === 'true',
  }));

  function show(index) {
    current = (index + data.length) % data.length;
    const d = data[current];

    // Vider le conteneur
    lbWrap.innerHTML = '';

    if (d.placeholder) {
      // Image non disponible : afficher placeholder stylisé
      const ph = document.createElement('div');
      ph.className = 'lb-placeholder';
      ph.innerHTML = `
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="6"/><circle cx="12" cy="36" r="6"/>
          <line x1="42" y1="6"  x2="16.24" y2="31.76"/>
          <line x1="28.94" y1="28.96" x2="42" y2="42"/>
          <line x1="16.24" y1="16.24" x2="24" y2="24"/>
        </svg>
        <span>${d.alt}</span>
        <small style="opacity:.5">Remplacer par la vraie photo</small>`;
      lbWrap.appendChild(ph);
    } else {
      // Vraie image
      const img = document.createElement('img');
      img.src   = d.src;
      img.alt   = d.alt;
      img.onload = () => img.style.opacity = '1';
      img.style.opacity = '0';
      img.style.transition = 'opacity 300ms ease';
      lbWrap.appendChild(img);
      img.onload = () => { img.style.opacity = '1'; };
    }

    lbCap.textContent   = d.alt;
    lbCount.textContent = `${current + 1} / ${data.length}`;
  }

  function openAt(index) {
    lastFocus = document.activeElement;
    show(index);
    lb.removeAttribute('hidden');
    document.body.classList.add('nav-open'); // bloquer le scroll
    lbClose.focus();
  }

  function close() {
    lb.setAttribute('hidden', '');
    document.body.classList.remove('nav-open');
    if (lastFocus) lastFocus.focus();
  }

  // Ouvrir via clic ou Enter/Espace
  items.forEach((item, i) => {
    item.addEventListener('click', () => openAt(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt(i);
      }
    });
  });

  lbClose.addEventListener('click', close);
  lbBg.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (lb.hasAttribute('hidden')) return;
    switch (e.key) {
      case 'Escape':    close(); break;
      case 'ArrowLeft': show(current - 1); break;
      case 'ArrowRight':show(current + 1); break;
    }
  });

  // Swipe tactile (touch)
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? show(current + 1) : show(current - 1);
  }, { passive: true });
})();


/* ── 08. Form validation ──────────────────────────────────── */
/* Validation front-end avant envoi.
   Pour activer l'envoi réel, modifier l'action du formulaire dans index.html :
   · Option A (Formspree) : action="https://formspree.io/f/VOTRE_ID"
   · Option B (mailto)    : action="mailto:votre@email.fr" method="post"
   · Option C             : Brancher à votre propre backend (fetch/XHR) */

(function initForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  const rules = {
    'field-name': {
      validate: v => v.trim().length >= 2,
      message: 'Merci d\'indiquer votre nom (2 caractères minimum).',
    },
    'field-tel': {
      validate: v => /^[\d\s\+\-\(\)\.]{8,20}$/.test(v.trim()),
      message: 'Numéro de téléphone invalide.',
    },
    'field-message': {
      validate: v => v.trim().length >= 10,
      message: 'Votre message doit contenir au moins 10 caractères.',
    },
  };

  // Validation en temps réel (au blur)
  Object.keys(rules).forEach(id => {
    const field = qs(`#${id}`, form);
    if (!field) return;
    field.addEventListener('blur', () => validateField(id));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(id);
    });
  });

  function validateField(id) {
    const field = qs(`#${id}`, form);
    const err   = qs(`#err-${id.replace('field-', '')}`, form);
    if (!field || !err) return true;

    const rule  = rules[id];
    const valid = rule.validate(field.value);
    field.classList.toggle('error', !valid);
    err.textContent = valid ? '' : rule.message;
    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Valider tous les champs
    let allValid = true;
    Object.keys(rules).forEach(id => {
      if (!validateField(id)) allValid = false;
    });

    if (!allValid) {
      // Focus le premier champ en erreur
      const firstErr = qs('.error', form);
      if (firstErr) firstErr.focus();
      return;
    }

    /* ── Si le formulaire a une vraie action (Formspree, etc.) ──
       Remplacer ce bloc par un vrai fetch / submit :

       const fd = new FormData(form);
       fetch(form.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
         .then(r => r.ok ? showSuccess() : showError())
         .catch(() => showError());
    ── */

    // Simulation d'envoi (à remplacer par le vrai envoi)
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      form.reset();
      form.hidden = true;
      if (success) success.hidden = false;
    }, 800);
  });
})();


/* ── 09. Chiffres & dates dynamiques ──────────────────────────
   Injecte partout dans la page les valeurs calculées à partir des
   DATES DE RÉFÉRENCE définies en haut de ce fichier.

   CLÉS DISPONIBLES
   ────────────────────────────────────────────────────────────
   anciennete-salon       ancienneté du salon        (35 en 2026)
   experience-patronne    années de métier de Jess   (27 en 2026)
   annees-depuis-reprise  années depuis la reprise   ( 5 en 2026)
   annee-creation-salon   année de création          (1991)
   annee-reprise          année de reprise           (2021)
   annee-courante         année en cours             (2026)

   FORMATS — choisir l'attribut selon le rendu voulu
   ────────────────────────────────────────────────────────────
   data-dynamic="clé"       → « 27 ans »  (texte courant, accroches)
   data-dynamic-num="clé"   → « 27 »      (badges, compteurs stat)
   data-dynamic-year="clé"  → « 2021 »    (dates : reprise, crédits,
                                            mentions légales, RGPD…)

   EXEMPLES D'USAGE
   ────────────────────────────────────────────────────────────
   <span data-dynamic="experience-patronne">27 ans</span>
   <strong data-dynamic-num="anciennete-salon">35</strong>
   Reprise en <span data-dynamic-year="annee-reprise">2021</span>
   &copy; <span data-dynamic-year="annee-courante">2026</span> Nouvel Hair
   Dernière mise à jour : <span data-dynamic-year="annee-courante">2026</span>

   ► FALLBACK SANS JS : chaque élément contient déjà la bonne valeur
     écrite en dur dans index.html. Si le JS ne s'exécute pas, le texte
     statique reste affiché — aucune case vide, jamais.               */

(function initDynamicDates() {
  const anneeCourante = new Date().getFullYear();

  const values = {
    'anciennete-salon':      anneesDepuis(ANNEE_CREATION_SALON),
    'experience-patronne':   anneesDepuis(ANNEE_DEBUT_METIER),
    'annees-depuis-reprise': anneesDepuis(ANNEE_REPRISE),
    'annee-creation-salon':  ANNEE_CREATION_SALON,
    'annee-reprise':         ANNEE_REPRISE,
    'annee-courante':        anneeCourante,
  };

  // « X ans »
  qsa('[data-dynamic]').forEach(el => {
    const v = values[el.dataset.dynamic];
    if (v != null) el.textContent = v + ' ans';
  });

  // « X »
  qsa('[data-dynamic-num]').forEach(el => {
    const v = values[el.dataset.dynamicNum];
    if (v != null) el.textContent = v;
  });

  // « 2021 » — années brutes (dates fixes ou année courante)
  qsa('[data-dynamic-year]').forEach(el => {
    const v = values[el.dataset.dynamicYear];
    if (v != null) el.textContent = v;
  });

  /* ── Balises SEO & réseaux sociaux ──────────────────────────
     Les balises <meta> ne peuvent pas contenir de <span>, on les
     réécrit donc ici. Le HTML garde une version statique correcte
     comme repli pour les robots qui n'exécutent pas JavaScript
     (Googlebot, lui, exécute le JS et verra la version à jour).
     Les placeholders {experience} et {anciennete} sont remplacés. */
  const exp = values['experience-patronne'];
  const anc = values['anciennete-salon'];

  qsa('meta[data-dynamic-tpl]').forEach(meta => {
    meta.setAttribute('content',
      meta.dataset.dynamicTpl
        .replace('{experience}', exp)
        .replace('{anciennete}', anc)
        .replace('{annee}', anneeCourante)
    );
  });

  // Donnée structurée : date de fondation du salon (SEO local)
  const ld = qs('script[type="application/ld+json"]');
  if (ld) {
    try {
      const data = JSON.parse(ld.textContent);
      data.foundingDate = String(ANNEE_CREATION_SALON);
      ld.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      /* JSON-LD malformé : on ne casse rien, on laisse tel quel */
    }
  }
})();
