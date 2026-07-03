document.addEventListener('DOMContentLoaded', () => {

    // === Inline SVG Logos + Apply Theme Colors ===
    // CSS variables don't propagate into SVG CDATA style blocks reliably,
    // so we control SVG colors directly via JS after inlining.
    
    const LOGO_COLORS = {
        light: {
            primary: '#010066',   // fil1, fil3 - dark blue letters/shapes
            counter: '#F7F7F7',   // fil0 - white counters (holes in A, O) & background
            red: '#F20809',       // fil2 - always stays red
        },
        dark: {
            primary: '#ffffff',   // fil1, fil3 - white letters on dark bg
            counter: 'transparent', // fil0 - transparent counters so dark bg shows through holes
            red: '#F20809',       // fil2 - stays red in both themes
        }
    };

    function applyLogoColors(theme) {
        const colors = LOGO_COLORS[theme];
        document.querySelectorAll('.fil1, .fil3').forEach(el => {
            el.style.fill = colors.primary;
        });
        document.querySelectorAll('.fil0').forEach(el => {
            el.style.fill = colors.counter;
        });
        // fil2 is always red, no change needed
    }

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
        // After inlining, apply the current theme colors
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyLogoColors(currentTheme);
    }

    // === Theme Toggle (Light/Dark Mode) ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply saved or system theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
        } else {
            body.removeAttribute('data-theme');
            body.classList.add('light-theme');
        }
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
        }
    }

    // Inline SVGs after theme is set
    inlineSVGs();

    themeToggleBtn.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            body.removeAttribute('data-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            applyLogoColors('light');
        } else {
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            applyLogoColors('dark');
        }
    });

    // === Mobile Menu ===
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // === Scroll Animations (Intersection Observer) ===
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    fadeElements.forEach(el => scrollObserver.observe(el));

    // === Form Tabs ===
    const formTabs = document.querySelectorAll('.form-tab');
    const formContents = document.querySelectorAll('.form-content');

    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            formTabs.forEach(t => t.classList.remove('active'));
            formContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-target')).classList.add('active');
        });
    });

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 50 ? 'var(--shadow-md)' : 'none';
    });
});
