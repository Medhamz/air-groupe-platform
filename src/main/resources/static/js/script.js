(function() {
    'use strict';

    // ========================================
    // PARTICULES EN FOND
    // ========================================
    (function initParticles() {
        const container = document.createElement('div');
        container.id = 'particles-container';
        document.body.prepend(container);

        const colors = ['#d4af37', '#f1c40f', '#ffd700', '#e6b800', '#ffec8b'];
        const particleCount = window.innerWidth < 768 ? 30 : 60;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(particle);
        }
    })();

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
    window.toggleReadingMode = function() {
        const body = document.body;
        const content = document.querySelector('.container');
        body.classList.toggle('reading-mode');
        if (content) {
            content.classList.toggle('reading-mode');
        }
        const btn = document.getElementById('readingModeBtn');
        const isReading = body.classList.contains('reading-mode');
        if (btn) {
            btn.innerHTML = isReading ? '<i class="fas fa-compress"></i> Normal' : '<i class="fas fa-expand"></i> Lecture';
        }
        showToast(isReading ? 'Mode lecture activé' : 'Mode normal', 'success');
    };

    // ========================================
    // 12. CHATBOT
    // ========================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', function() {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatInput?.focus();
            }
        });

        if (closeChat) {
            closeChat.addEventListener('click', function() {
                chatbotWindow.classList.remove('active');
            });
        }

        function sendMessage() {
            const input = chatInput?.value.trim();
            if (!input) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'chatbot-message user';
            userMsg.textContent = input;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'chatbot-message bot';
                const responses = {
                    'bonjour': 'Bonjour ! Comment puis-je vous aider ?',
                    'services': 'Nous proposons : BTP, hydraulique, commerce, location d\'engins, transport et logistique.',
                    'devis': 'Vous pouvez demander un devis via notre formulaire en ligne.',
                    'contact': 'Contactez-nous au +227 96 96 74 74 ou par email à tidjani22686@gmail.com',
                    'agadez': 'Nous sommes basés à Agadez, quartier aéroport, Niger.',
                    'merci': 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.',
                    'au revoir': 'Au revoir ! Revenez quand vous voulez.'
                };
                const lower = input.toLowerCase();
                let reply = 'Je suis désolé, je n\'ai pas compris. Essayez : bonjour, services, devis, contact, agadez.';
                for (const [key, value] of Object.entries(responses)) {
                    if (lower.includes(key)) {
                        reply = value;
                        break;
                    }
                }
                botMsg.textContent = reply;
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 600);
        }

        if (chatSend) {
            chatSend.addEventListener('click', sendMessage);
        }
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });
        }

        setTimeout(() => {
            if (chatMessages) {
                const welcome = document.createElement('div');
                welcome.className = 'chatbot-message bot';
                welcome.textContent = 'Bonjour ! Je suis l\'assistant virtuel d\'Afrique équipements et services. Posez-moi vos questions !';
                chatMessages.appendChild(welcome);
            }
        }, 800);
    }

    // ========================================
    // 13. PARALLAX HERO
    // ========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        });
    }

    // ========================================
    // 14. AUTO-HIDE ALERT
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

// ============================================
// 1. LOADER POUR LES CHANGEMENTS DE PAGE
// ============================================
(function initLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.prepend(loader);

    // Afficher le loader lors des clics sur les liens internes
    document.querySelectorAll('a[href^="/"]:not([href*="logout"]):not([href*="login"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('target') !== '_blank') {
                loader.classList.add('active');
            }
        });
    });

    // Cacher le loader quand la page est complètement chargée
    window.addEventListener('load', () => {
        loader.classList.remove('active');
    });

    // En cas d'erreur, cacher après 5s
    window.addEventListener('error', () => {
        setTimeout(() => loader.classList.remove('active'), 5000);
    });
})();

// ============================================
// 2. MODE SOMBRE AUTOMATIQUE + MANUEL
// ============================================
(function darkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Détection du système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Appliquer le thème sauvegardé ou celui du système
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Bouton manuel
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
})();

// ============================================
// 3. PARALLAXE AVANCÉ
// ============================================
(function parallax() {
    const sections = document.querySelectorAll('.parallax-section');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const speed = section.getAttribute('data-speed') || 0.3;
            const offset = scrollY * speed;
            section.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        });
    });
})();

// ============================================
// 4. COMPTEUR DE VISITEURS (simulé)
// ============================================
(function visitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    if (!counterElement) return;

    let count = parseInt(localStorage.getItem('visitorCount')) || 0;
    // Incrémenter une seule fois par session
    if (!sessionStorage.getItem('visited')) {
        count += 1;
        localStorage.setItem('visitorCount', count);
        sessionStorage.setItem('visited', 'true');
    }

    // Arrondir pour l'affichage (ex: 1.2k)
    const displayCount = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
    counterElement.textContent = displayCount;
})();

// ============================================
// 5. NOTIFICATIONS TOAST AVEC SON
// ============================================
(function enhanceToast() {
    const originalShowToast = window.showToast;
    if (originalShowToast) {
        window.showToast = function(message, type = 'success') {
            // Jouer un son (si disponible)
            try {
                const audio = new Audio('/sounds/toast.mp3');
                audio.volume = 0.3;
                audio.play().catch(() => {});
            } catch (e) {}

            // Appeler la fonction originale
            originalShowToast(message, type);
        };
    }
})();