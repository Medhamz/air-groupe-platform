(function() {
    'use strict';

    // ========================================
    // 1. CANVAS GRID & MATRIX PARTICLES
    // ========================================
    function initCyberCanvas() {
        const canvas = document.getElementById('cyberCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Particules Lumineuses
        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Dessin de la grille Cyber
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
            ctx.lineWidth = 1;
            const size = 50;
            for (let x = 0; x < width; x += size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Animation des particules
            ctx.fillStyle = '#00f3ff';
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }
        draw();
    }

    // ========================================
    // 2. GLOBE CYBER 3D (THREE.JS)
    // ========================================
    function initCyberGlobe() {
        const container = document.getElementById('globeContainer');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 185;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Sphère externe (Lignes Cybers)
        const geo = new THREE.SphereGeometry(52, 24, 24);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.45
        });
        const globe = new THREE.Mesh(geo, mat);
        scene.add(globe);

        // Noyau Violet Interne
        const coreGeo = new THREE.SphereGeometry(30, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.004;
            core.rotation.y -= 0.006;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // ========================================
    // 3. CHATBOT CYBER ENGINE
    // ========================================
    function initCyberChat() {
        const toggle = document.getElementById('chatbotToggle');
        const win = document.getElementById('chatbotWindow');
        const close = document.getElementById('closeChat');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('chatSend');
        const messages = document.getElementById('chatMessages');

        if (!toggle || !win) return;

        toggle.addEventListener('click', () => win.classList.toggle('active'));
        if (close) close.addEventListener('click', () => win.classList.remove('active'));

        function addMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${type}`;
            msg.textContent = text;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight;
        }

        function handleSend() {
            const val = input.value.trim();
            if (!val) return;
            addMessage(val, 'user');
            input.value = '';

            setTimeout(() => {
                let response = "[SYS_RESP]: Reçu. Traitement de la requête par le noyau AES...";
                const query = val.toLowerCase();

                if (query.includes('service') || query.includes('btp')) {
                    response = "[SERVICES]: Module BTP, Hydraulique, Location d'engins, Transport & Logistique actifs.";
                } else if (query.includes('contact') || query.includes('adresse')) {
                    response = "[COORDONNÉES]: Siège à Agadez, quartier aéroport, Niger. Ligne directe: +227 96 96 74 74.";
                }
                addMessage(response, 'bot');
            }, 300);
        }

        if (send) send.addEventListener('click', handleSend);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        addMessage("SYSTEM_READY // Posez votre question au support AES.", "bot");
    }

    // Initialisation Globale
    document.addEventListener('DOMContentLoaded', () => {
        initCyberCanvas();
        initCyberGlobe();
        initCyberChat();

        const btt = document.getElementById('backToTop');
        if (btt) {
            btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    });
})();