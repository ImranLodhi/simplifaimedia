/* ==========================================================
   SIMPLIFAI MEDIA — script.js
   Vanilla JS, no dependencies. This pass covers navigation
   bar behaviour only: sticky scroll shadow, the mobile menu,
   and the animated active-link indicator.
   (Scroll-reveal for the Topics cards is still pending from
   the original file-by-file pass and intentionally left out
   here so this diff stays scoped to the navbar.)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------
       1. Sticky header — shadow + shrink once scrolled
       ------------------------------------------------------ */
    const header = document.querySelector('header');

    const updateHeaderState = () => {
        header.classList.toggle('scrolled', window.scrollY > 12);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    /* ------------------------------------------------------
       2. Mobile navigation (toggle, backdrop, focus handling)
       ------------------------------------------------------ */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('primary-navigation');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    const openMenu = () => {
        navMenu.classList.add('is-open');
        navBackdrop.classList.add('is-visible');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        navBackdrop.classList.remove('is-visible');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    if (navToggle && navMenu && navBackdrop) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMenu() : openMenu();
        });

        navBackdrop.addEventListener('click', closeMenu);

        // Closing on link click matters most on mobile, where the
        // panel would otherwise stay open after navigating.
        navLinks.forEach((link) => link.addEventListener('click', closeMenu));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
                navToggle.focus();
            }
        });
    }

    /* ------------------------------------------------------
       3. Animated nav indicator (hover + active section)
       ------------------------------------------------------ */
    const indicator = document.querySelector('.nav-indicator');

    const moveIndicatorTo = (link) => {
        if (!indicator || !link) return;
        indicator.style.width = `${link.offsetWidth}px`;
        indicator.style.left = `${link.offsetLeft}px`;
        indicator.classList.add('is-visible');
    };

    const hideIndicator = () => {
        if (indicator) indicator.classList.remove('is-visible');
    };

    const showActiveIndicator = () => {
        const activeLink = navMenu ? navMenu.querySelector('a[aria-current="page"]') : null;
        activeLink ? moveIndicatorTo(activeLink) : hideIndicator();
    };

    if (indicator && navMenu) {
        navLinks.forEach((link) => {
            link.addEventListener('mouseenter', () => moveIndicatorTo(link));
        });
        navMenu.addEventListener('mouseleave', showActiveIndicator);

        // Wait for fonts/layout to settle before the first measurement
        window.addEventListener('load', showActiveIndicator);
    }

    /* ------------------------------------------------------
       4. Scroll-spy — highlight the link for the section
          currently in view
       ------------------------------------------------------ */
    const sections = document.querySelectorAll('main section[id]');

    if (sections.length && navMenu && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    navLinks.forEach((link) => link.removeAttribute('aria-current'));

                    const match = navMenu.querySelector(`a[href="#${entry.target.id}"]`);
                    if (match) {
                        match.setAttribute('aria-current', 'page');
                        showActiveIndicator();
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ------------------------------------------------------
       5. Topic card micro-interactions (spotlight + tilt)
       ------------------------------------------------------ */
    const topicCards = document.querySelectorAll('.topic-card');
    const MAX_TILT = 6; // degrees — kept subtle on purpose

    topicCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Cursor-tracking glass sheen position
            card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--my', `${(y / rect.height) * 100}%`);

            // Subtle tilt toward the cursor
            const px = x / rect.width - 0.5;
            const py = y / rect.height - 0.5;
            card.style.setProperty('--card-ry', `${px * MAX_TILT}deg`);
            card.style.setProperty('--card-rx', `${py * -MAX_TILT}deg`);
            card.style.setProperty('--card-lift', '-10px');
            card.style.setProperty('--card-scale', '1.015');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--card-rx', '0deg');
            card.style.setProperty('--card-ry', '0deg');
            card.style.setProperty('--card-lift', '0px');
            card.style.setProperty('--card-scale', '1');
        });
    });

});
