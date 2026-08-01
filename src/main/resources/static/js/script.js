(function() {
    'use strict';

    // ========================================
    // 1. SCROLL REVEAL (Intersection Observer)
    // ========================================
    const sections = document.querySelectorAll('.section-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    sections.forEach(section => observer.observe(section));

    // ========================================
    // 2. BACK TO TOP BUTTON
    // ========================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // 3. ACTIVE NAV LINK (amélioré)
    // ========================================
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // 5. NEWSLETTER FORM (simulation)
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
                this.reset();
            }
        });
    }

    // ========================================
    // 6. CONTACT FORM SUCCESS MESSAGE (auto-hide after 5s)
    // ========================================
    const successAlert = document.querySelector('.alert-success');
    if (successAlert) {
        setTimeout(() => {
            successAlert.style.transition = 'opacity 0.6s';
            successAlert.style.opacity = '0';
            setTimeout(() => successAlert.remove(), 600);
        }, 5000);
    }

})();