(function() {
    'use strict';

    // ========================================
    // 1. GESTION DU MODE NUIT
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ========================================
    // 2. BARRE DE RECHERCHE
    // ========================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const filter = this.value.toLowerCase().trim();
            const serviceCards = document.querySelectorAll('.service-card-wrapper');
            let found = false;
            serviceCards.forEach(wrapper => {
                const card = wrapper.querySelector('.service-card');
                if (card) {
                    const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
                    const desc = card.querySelector('.card-text')?.textContent?.toLowerCase() || '';
                    if (title.includes(filter) || desc.includes(filter)) {
                        wrapper.style.display = '';
                        found = true;
                    } else {
                        wrapper.style.display = 'none';
                    }
                }
            });
            const noResult = document.getElementById('noResult');
            if (noResult) {
                if (!found && filter.length > 0) {
                    noResult.style.display = 'block';
                } else {
                    noResult.style.display = 'none';
                }
            }
        });
    }

    // ========================================
    // 3. SCROLL REVEAL
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
    // 4. STATISTIQUES ANIMÉES
    // ========================================
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.getAttribute('data-suffix') || '';
            if (isNaN(target)) return;
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
                stat.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statSection = document.querySelector('.stats-section');
    if (statSection) {
        statObserver.observe(statSection);
    }

    // ========================================
    // 5. BACK TO TOP
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
    // 6. ACTIVE NAV LINK
    // ========================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // ========================================
    // 7. SMOOTH SCROLL
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
    // 8. NEWSLETTER
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showToast('Merci ! Vous êtes désormais inscrit à notre newsletter.', 'success');
                this.reset();
            }
        });
    }

    // ========================================
    // 9. NOTIFICATIONS TOAST
    // ========================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (function() {
            const c = document.createElement('div');
            c.id = 'toastContainer';
            c.className = 'toast-container';
            document.body.appendChild(c);
            return c;
        })();

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        const color = type === 'success' ? '#27ae60' : '#e74c3c';
        toast.innerHTML = `
            <span class="toast-icon" style="color: ${color}"><i class="${icon}"></i></span>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(toast);

        const timeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 5000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        });
    }
    window.showToast = showToast;

    // ========================================
    // 10. BOUTONS DE PARTAGE SOCIAL
    // ========================================
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Découvrez Afrique équipements et services - Leader au Niger !');
            let shareUrl = '';
            const platform = this.dataset.platform;

            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                showToast('Partage ouvert avec succès !', 'success');
            }
        });
    });

    // ========================================
    // 11. MODE LECTURE
    // ========================================
    function toggleReadingMode() {
        const content = document.querySelector('.container');
        if (!content) {
            document.body.classList.toggle('reading-mode');
        } else {
            content.classList.toggle('reading-mode');
        }
        const btn = document.getElementById('readingModeBtn');
        const isReading = document.body.classList.contains('reading-mode') || content?.classList.contains('reading-mode');
        if (btn) {
            btn.innerHTML = isReading ? '<i class="fas fa-compress"></i> Normal' : '<i class="fas fa-expand"></i> Lecture';
        }
        showToast(isReading ? 'Mode lecture activé' : 'Mode normal', 'success');
    }
    window.toggleReadingMode = toggleReadingMode;

    // ========================================
    // 12. PARALLAX HERO
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        });
    }

    // ========================================
    // 13. AUTO-HIDE ALERT (pour les messages flash)
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