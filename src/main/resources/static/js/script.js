(function() {
    'use strict';

    // ========================================
    // 1. PARTICULES LUMINEUSES 3D EN CANVAS
    // ========================================
    function initParticlesCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-particles-canvas';
        document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 70 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.6 + 0.2
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#d4af37';
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ========================================
    // 2. GLOBE TERRESTRE 3D (THREE.JS)
    // ========================================
    function init3DGlobe() {
        const container = document.getElementById('globeContainer');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 220;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Globe en fil de fer (Wireframe) + texture
        const geometry = new THREE.SphereGeometry(60, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Particules lumineuses autour du globe (Atmosphère)
        const particleGeo = new THREE.BufferGeometry();
        const count = 300;
        const posArray = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 160;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 1.5,
            color: 0xffd700,
            transparent: true,
            opacity: 0.7
        });
        const points = new THREE.Points(particleGeo, particleMat);
        scene.add(points);

        // Animation de rotation
        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.005;
            points.rotation.y -= 0.002;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // ========================================
    // 3. LOGIQUE DU CHATBOT
    // ========================================
    function initChatbot() {
        const toggle = document.getElementById('chatbotToggle');
        const win = document.getElementById('chatbotWindow');
        const close = document.getElementById('closeChat');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('chatSend');
        const messages = document.getElementById('chatMessages');

        if (!toggle || !win) return;

        toggle.addEventListener('click', () => win.classList.toggle('active'));
        if (close) close.addEventListener('click', () => win.classList.remove('active'));

        function appendMessage(text, type) {
            const msg = document.createElement('div');
            msg.className = `chatbot-message ${type}`;
            msg.textContent = text;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight;
        }

        function handleSend() {
            const val = input.value.trim();
            if (!val) return;
            appendMessage(val, 'user');
            input.value = '';

            setTimeout(() => {
                const lower = val.toLowerCase();
                let reply = "Merci pour votre message ! Notre équipe Afrique Équipements & Services reviendra vers vous sous peu.";
                if (lower.includes('service') || lower.includes('btp')) {
                    reply = "Nous proposons des services en BTP, Hydraulique, Commerce, Location d'engins, Transport et Logistique.";
                } else if (lower.includes('contact') || lower.includes('telephone')) {
                    reply = "Vous pouvez nous joindre au +227 96 96 74 74 ou à Agadez, quartier aéroport.";
                }
                appendMessage(reply, 'bot');
            }, 600);
        }

        if (send) send.addEventListener('click', handleSend);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        appendMessage("Bonjour ! Comment puis-je vous aider aujourd'hui ?", "bot");
    }

    // Initialisations au chargement
    document.addEventListener('DOMContentLoaded', () => {
        initParticlesCanvas();
        init3DGlobe();
        initChatbot();
    });
})();