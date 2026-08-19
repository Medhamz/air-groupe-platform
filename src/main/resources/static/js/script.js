(function() {
    'use strict';

    // ========================================
    // 1. FOND DE GRILLE PRO SUBTIL
    // ========================================
    function initAdminBackground() {
        const canvas = document.getElementById('adminCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function render() {
            ctx.clearRect(0, 0, width, height);

            // Lignes de grille très claires style dashboard
            ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
            ctx.lineWidth = 1;

            const gridSize = 40;
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
        }
        render();
    }

    // ========================================
    // 2. GLOBE TERRESTRE PRO (THREE.JS)
    // ========================================
    function initAdminGlobe() {
        const container = document.getElementById('globeContainer');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 190;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Globe bleu corporate
        const geometry = new THREE.SphereGeometry(55, 28, 28);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.003;
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
    // 3. CHATBOT ASSISTANT SUPPORT
    // ========================================
    function initAdminChat() {
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
                let response = "Merci pour votre message. Notre équipe administrative traitera votre demande sous peu.";
                const query = val.toLowerCase();

                if (query.includes('service') || query.includes('btp')) {
                    response = "Nos services comprennent : BTP, Hydraulique, Location d'engins, Transport et Logistique.";
                } else if (query.includes('contact') || query.includes('adresse')) {
                    response = "Siège social : Agadez, quartier aéroport, Niger. Tél : +227 96 96 74 74.";
                }
                addMessage(response, 'bot');
            }, 400);
        }

        if (send) send.addEventListener('click', handleSend);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        addMessage("Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?", "bot");
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        initAdminBackground();
        initAdminGlobe();
        initAdminChat();

        const btt = document.getElementById('backToTop');
        if (btt) {
            btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    });
})();