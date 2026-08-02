(function() {
    'use strict';

    // ========================================
    // 1. SCROLL REVEAL
    // ========================================
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => section.classList.add('hidden-start'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden-start');
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    sections.forEach(section => observer.observe(section));

    // ========================================
    // 2. BACK TO TOP
    // ========================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('visible', window.scrollY > 400);
        });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // 3. ACTIVE NAV LINK
    // ========================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    // 4. SMOOTH SCROLL
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
    // 5. NEWSLETTER
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Merci ! Vous êtes désormais inscrit à notre newsletter.');
                this.reset();
            }
        });
    }

    // ========================================
    // 6. AUTO-HIDE ALERT
    // ========================================
    const successAlert = document.querySelector('.alert-success');
    if (successAlert) {
        setTimeout(() => {
            successAlert.style.transition = 'opacity 0.6s';
            successAlert.style.opacity = '0';
            setTimeout(() => successAlert.remove(), 600);
        }, 5000);
    }

    // ========================================
    // 7. PARALLAX HERO
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        });
    }

    // ========================================
    // 8. ANIMATION DES STATISTIQUES (comptage)
    // ========================================
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 1500;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                stat.textContent = Math.floor(current) + (stat.getAttribute('data-suffix') || '');
            }, stepTime);
        });
    }

    // Déclencher l'animation des statistiques quand elles deviennent visibles
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statObserver.disconnect(); // une seule fois
            }
        });
    }, { threshold: 0.3 });

    const statSection = document.querySelector('.stats-section');
    if (statSection) {
        statObserver.observe(statSection);
    }
})();