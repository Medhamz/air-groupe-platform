(function() {
    'use strict';

    // ========================================
    // 1. SCROLL REVEAL
    // ========================================
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => {
        section.classList.add('hidden-start');
    });

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
    // 2. COMPTEURS ANIMÉS (statistiques)
    // ========================================
    const statElements = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersStarted = true;
            statElements.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(target)) return;
                let current = 0;
                const increment = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        el.textContent = current + '+';
                    }
                }, 30);
            });
        }
    }

    // Lancer les compteurs au scroll
    window.addEventListener('scroll', animateCounters);
    // Vérifier immédiatement si la section est déjà visible
    setTimeout(animateCounters, 500);

    // ========================================
    // 3. BACK TO TOP
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
    // 4. ACTIVE NAV LINK
    // ========================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    // 5. SMOOTH SCROLL
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
    // 6. NEWSLETTER
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email && email.includes('@')) {
                alert('✅ Merci ! Vous êtes désormais inscrit à notre newsletter.');
                this.reset();
            } else {
                alert('⚠️ Veuillez entrer une adresse email valide.');
            }
        });
    }

    // ========================================
    // 7. AUTO-HIDE ALERT
    // ========================================
    const successAlert = document.querySelector('.alert-success');
    if (successAlert) {
        setTimeout(() => {
            successAlert.style.transition = 'opacity 0.6s';
            successAlert.style.opacity = '0';
            setTimeout(() => successAlert.remove(), 600);
        }, 6000);
    }

    // ========================================
    // 8. PARALLAX HERO
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < 600) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        });
    }

    // ========================================
    // 9. NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 80);
        });
    }

    // ========================================
    // 10. SEARCH FILTER FOR SERVICES
    // ========================================
    const searchInput = document.getElementById('serviceSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const query = this.value.toLowerCase();
            const cards = document.querySelectorAll('.service-card');
            cards.forEach(card => {
                const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('.card-text')?.textContent?.toLowerCase() || '';
                const match = title.includes(query) || desc.includes(query);
                card.style.display = match ? '' : 'none';
            });
        });
    }
})();