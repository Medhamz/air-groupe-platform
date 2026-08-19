(function() {
    'use strict';

    // ========================================
    // 1. ARRIÈRE-PLAN CYBER DYNAMIQUE & LUMINEUX
    // ========================================
    function initCyberBackground() {
        const canvas = document.getElementById('cyberCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Particules réseau
        const nodes = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1
        }));

        function render() {
            ctx.clearRect(0, 0, width, height);

            // Connexions réseau
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0, 119, 255, ${0.15 - dist / 1300})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Dessin des nœuds
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#0077ff';
                ctx.fill();
            });

            requestAnimationFrame(render);
        }
        render();
    }

    // ========================================
    // 2. GLOBE 3D HOLOGRAPHIQUE (THREE.JS)
    // ========================================
    function initCyberGlobe() {
        const container = document.getElementById('globeContainer');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 200;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Sphère principale en réseau
        const geometry = new THREE.SphereGeometry(55, 24, 24);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0077ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Anneau hélio-cyber
        const ringGeo = new THREE.RingGeometry(65, 68, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xd97706,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        function animate() {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.004;
            ring.rotation.z += 0.002;
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
    // 3. LOGIQUE DU CHATBOT CYBER
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
                let response = "Cyber-System : Requête reçue. Un agent Afrique Équipements vous répondra rapidement.";
                const query = val.toLowerCase();

                if (query.includes('service') || query.includes('btp')) {
                    response = "Nos expertises Cyber-BTP : Construction, Hydraulique, Logistique et Location d'engins lourds.";
                } else if (query.includes('contact') || query.includes('adresse')) {
                    response = "Siège social : Agadez, quartier aéroport, Niger. Tél : +227 96 96 74 74.";
                }
                addMessage(response, 'bot');
            }, 500);
        }

        if (send) send.addEventListener('click', handleSend);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        addMessage("Bonjour ! Système Cyber-AI prêt. Comment puis-je vous guider ?", "bot");
    }

    // Initialisation globale
    document.addEventListener('DOMContentLoaded', () => {
        initCyberBackground();
        initCyberGlobe();
        initCyberChat();

        // Retour en haut
        const btt = document.getElementById('backToTop');
        if (btt) {
            btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    });
})();