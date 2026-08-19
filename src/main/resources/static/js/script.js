/**
 * AFRIQUE ÉQUIPEMENTS & SERVICES - CYBER CORE SYSTEM
 * Script principal : Grid Animation, Globe 3D Three.js, Interactive AI Chatbot & Navigation UI
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ANIMATION ARRIÈRE-PLAN : CANVA MATRIX GRID & PARTICULES
    // =========================================================================
    function initCyberCanvas() {
        const canvas = document.getElementById('cyberCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Adaptation lors du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Génération des particules lumineuses
        const particlesCount = 45;
        const particles = Array.from({ length: particlesCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        }));

        function render() {
            ctx.clearRect(0, 0, width, height);

            // Dessin de la Grille Cyber
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
            ctx.lineWidth = 1;
            const gridSize = 45;

            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Animation des particules
            ctx.fillStyle = '#00f3ff';
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Rebond sur les bords
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(render);
        }

        render();
    }

    // =========================================================================
    // 2. GLOBE 3D HOLO-VECTORIEL (THREE.JS)
    // =========================================================================
    function initCyberGlobe() {
        const container = document.getElementById('globeContainer');
        if (!container || typeof THREE === 'undefined') return;

        // Scène & Caméra
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 180;

        // Rendu WebGL
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Sphère Externe (Maillage Cyan)
        const outerGeo = new THREE.SphereGeometry(50, 22, 22);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const outerGlobe = new THREE.Mesh(outerGeo, outerMat);
        scene.add(outerGlobe);

        // Noyau Interne (Maillage Violet)
        const innerGeo = new THREE.SphereGeometry(28, 14, 14);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerCore);

        // Loop d'animation
        function animate() {
            requestAnimationFrame(animate);
            outerGlobe.rotation.y += 0.004;
            innerCore.rotation.y -= 0.005;
            renderer.render(scene, camera);
        }
        animate();

        // Responsive Globe
        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // =========================================================================
    // 3. MODULE AI CHATBOT INTERACTIF
    // =========================================================================
    function initCyberChat() {
        const toggle = document.getElementById('chatbotToggle');
        const win = document.getElementById('chatbotWindow');
        const close = document.getElementById('closeChat');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSend');
        const messagesContainer = document.getElementById('chatMessages');

        if (!toggle || !win) return;

        // Toggle fenêtre du chat
        toggle.addEventListener('click', () => win.classList.toggle('active'));
        if (close) {
            close.addEventListener('click', () => win.classList.remove('active'));
        }

        // Ajouter un message à l'interface
        function appendMessage(text, type) {
            if (!messagesContainer) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-msg ${type}`;
            msgDiv.textContent = text;
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Envoi et réponse simulée
        function handleSendMessage() {
            if (!input) return;
            const text = input.value.trim();
            if (!text) return;

            appendMessage(text, 'user');
            input.value = '';

            // Simulation du temps de réponse de l'IA
            setTimeout(() => {
                let response = "[SYS_RESP]: Message reçu. Analyse en cours...";
                const query = text.toLowerCase();

                if (query.includes('service') || query.includes('btp') || query.includes('engin')) {
                    response = "[SERVICES]: Sections BTP, Hydraulique, Location d'engins & Transport actives.";
                } else if (query.includes('contact') || query.includes('adresse') || query.includes('telephone')) {
                    response = "[COORDONNÉES]: Siège à Agadez, quartier aéroport, Niger. Tél: +227 96 96 74 74.";
                } else if (query.includes('devis') || query.includes('prix')) {
                    response = "[MODULE_DEVIS]: Utilisez le menu 'Estimation' ou 'Devis' pour générer une évaluation.";
                }

                appendMessage(response, 'bot');
            }, 350);
        }

        if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSendMessage();
            });
        }

        // Message de démarrage
        appendMessage("SYSTEM_READY // AI Assistant connecté. Comment puis-je vous aider ?", "bot");
    }

    // =========================================================================
    // 4. NAVIGATION & UTILITAIRES DE L'INTERFACE
    // =========================================================================
    function initUIComponents() {
        // Bouton Retour en haut
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'block';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Module de recherche Navbar
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `/services?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    // =========================================================================
    // INITIALISATION GLOBALE AU CHARGEMENT DU DOM
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        initCyberCanvas();
        initCyberGlobe();
        initCyberChat();
        initUIComponents();
    });
})();