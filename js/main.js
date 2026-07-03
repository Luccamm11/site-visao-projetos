document.addEventListener('DOMContentLoaded', () => {

    // === Inline SVG Logos ===
    // SVG must be inlined so the external CSS (with !important) can control
    // .fil0 / .fil1 / .fil2 / .fil3 fill colors per theme.
    async function inlineSVGs() {
        const svgImgs = document.querySelectorAll('img[src$=".svg"]');
        for (const img of svgImgs) {
            try {
                const response = await fetch(img.src);
                const text = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, 'image/svg+xml');
                const svgEl = svgDoc.querySelector('svg');
                if (svgEl) {
                    if (img.className) svgEl.setAttribute('class', img.className);
                    svgEl.setAttribute('aria-label', img.alt || '');
                    svgEl.setAttribute('role', 'img');
                    svgEl.removeAttribute('width');
                    svgEl.removeAttribute('height');
                    img.parentNode.replaceChild(svgEl, img);
                }
            } catch (e) {
                console.warn('Could not inline SVG:', img.src, e);
            }
        }
    }
    inlineSVGs();

    // === Theme Toggle (Light/Dark Mode) ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply saved or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        body.classList.remove('light-theme');
    } else if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            body.removeAttribute('data-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // === Mobile Menu ===
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => mainNav.classList.remove('active'));
    });
    mobileMenuBtn.addEventListener('click', () => mainNav.classList.toggle('active'));

    // === Scroll Animations ===
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => scrollObserver.observe(el));

    // === Form Tabs ===
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-target')).classList.add('active');
        });
    });

    // === Header Scroll Shadow ===
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 50 ? 'var(--shadow-md)' : 'none';
    });
});
