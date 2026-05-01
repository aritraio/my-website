const root = document.documentElement;
const loader = document.querySelector('.loader');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navPanel = document.querySelector('[data-nav-panel]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('.theme-icon');
const typingTarget = document.querySelector('[data-typing]');
const yearTarget = document.querySelector('[data-year]');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingPhrases = ['reliable APIs.', 'AI workflows.', 'real-time systems.', 'developer tools.'];

window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('hidden'), 450);
});

yearTarget.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.dataset.theme = savedTheme;
  themeIcon.textContent = savedTheme === 'light' ? '☀' : '☾';
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('theme', nextTheme);
  themeIcon.textContent = nextTheme === 'light' ? '☀' : '☾';
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navPanel.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navPanel?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navPanel.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.progress').forEach((bar) => bar.classList.add('animated'));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll('.nav-panel a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const typeText = async () => {
  if (!typingTarget) return;
  if (prefersReducedMotion) {
    typingTarget.textContent = typingPhrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = typingPhrases[phraseIndex];
    typingTarget.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1;
      window.setTimeout(tick, 70);
      return;
    }

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      window.setTimeout(tick, 1200);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(tick, 36);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    window.setTimeout(tick, 260);
  };

  tick();
};

typeText();

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  const animateCursor = () => {
    outlineX += (mouseX - outlineX) * 0.16;
    outlineY += (mouseY - outlineY) * 0.16;
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  document.querySelectorAll('a, button, .project-card, .skill-group').forEach((element) => {
    element.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
  });

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });
}
