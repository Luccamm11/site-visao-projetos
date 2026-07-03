document.addEventListener('DOMContentLoaded', () => {
    // === Inline SVG Logos (needed for CSS variables to work inside SVG) ===
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
                    // Transfer classes and styles from img to svg
                    if (img.className) svgEl.setAttribute('class', img.className);
                    if (img.style.cssText) svgEl.setAttribute('style', img.style.cssText);
                    svgEl.setAttribute('aria-label', img.alt || '');
                    svgEl.setAttribute('role', 'img');
                    // Remove fixed width/height so CSS controls sizing
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
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        if(savedTheme === 'dark') {
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
        }
    } else {
        // Check system preference
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
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // === Form Tabs ===
    const formTabs = document.querySelectorAll('.form-tab');
    const formContents = document.querySelectorAll('.form-content');

    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            formTabs.forEach(t => t.classList.remove('active'));
            formContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});
