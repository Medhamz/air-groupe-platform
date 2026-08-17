document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // 1. VRAIE CARTE 3D DE LA RÉPUBLIQUE DU NIGER
    // ========================================
    (function initNigerMap3D() {
        const container = document.getElementById('niger3dContainer');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 10, 14);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;

        // Lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xd4af37, 1.5);
        dirLight.position.set(5, 12, 8);
        scene.add(dirLight);

        const groupNiger = new THREE.Group();

        // Tracé précis des coordonnées de la République du Niger
        const shapeNiger = new THREE.Shape();
        shapeNiger.moveTo(-2.8, -1.2); // Ouest - Tillabéri / Niamey
        shapeNiger.lineTo(-2.2, -0.2); // Nord-Ouest - Frontière Mali
        shapeNiger.lineTo(-1.2, 1.8);  // Nord-Ouest - Passe de Mangueni
        shapeNiger.lineTo(0.2, 3.2);   // Extrême Nord (Plateau du Djado)
        shapeNiger.lineTo(2.4, 2.8);   // Nord-Est (Frontière Libye)
        shapeNiger.lineTo(3.2, 0.8);   // Est (Frontière Tchad / Bilma)
        shapeNiger.lineTo(2.5, -0.8);  // Sud-Est (Lac Tchad / Diffa)
        shapeNiger.lineTo(0.8, -1.0);  // Sud (Zinder)
        shapeNiger.lineTo(-0.2, -1.2); // Sud (Maradi / Tahoua)
        shapeNiger.lineTo(-1.8, -1.5); // Sud-Ouest (Dosso)
        shapeNiger.closePath();

        const extrudeSettings = {
            depth: 0.35,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.08,
            bevelThickness: 0.08
        };

        const geometry = new THREE.ExtrudeGeometry(shapeNiger, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a2a3a,
            roughness: 0.3,
            metalness: 0.5
        });

        const nigerMesh = new THREE.Mesh(geometry, material);
        nigerMesh.rotation.x = -Math.PI / 2;
        groupNiger.add(nigerMesh);

        // Surbrillance de la région d'Agadez (Centre-Nord du Niger)
        const agadezShape = new THREE.Shape();
        agadezShape.moveTo(-1.0, 0.2);
        agadezShape.lineTo(0.0, 2.5);
        agadezShape.lineTo(1.8, 2.2);
        agadezShape.lineTo(2.2, 0.8);
        agadezShape.lineTo(0.8, 0.0);
        agadezShape.closePath();

        const agadezExtrude = { depth: 0.4, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 };
        const agadezGeo = new THREE.ExtrudeGeometry(agadezShape, agadezExtrude);
        const agadezMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            emissive: 0xd4af37,
            emissiveIntensity: 0.4,
            roughness: 0.2
        });

        const agadezMesh = new THREE.Mesh(agadezGeo, agadezMat);
        agadezMesh.rotation.x = -Math.PI / 2;
        agadezMesh.position.y = 0.02; // Légère surélévation
        groupNiger.add(agadezMesh);

        // Puce / Pin sur la ville d'Agadez
        const pinGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.set(0.3, 0.6, -0.8); // Position Agadez
        groupNiger.add(pinMesh);

        scene.add(groupNiger);

        // Animation de rotation & pulsation
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            groupNiger.rotation.y = t * 0.15; // Rotation continue douce

            // Pulsation lumineuse sur Agadez
            const s = 1 + Math.sin(t * 4) * 0.2;
            pinMesh.scale.set(s, s, s);
            agadezMat.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.3;

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    })();

    // ========================================
    // 2. PARTICULES LUMINEUSES (CANVAS)
    // ========================================
    (function initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        const numParticles = 40;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#d4af37';
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    })();

    // ========================================
    // 3. CHATBOT FONCTIONNEL & SUGGESTIONS
    // ========================================
    const chatToggle = document.getElementById('chatbotToggle');
    const chatWin = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    if (chatToggle && chatWin) {
        chatToggle.addEventListener('click', () => chatWin.classList.toggle('active'));
        if (closeChat) closeChat.addEventListener('click', () => chatWin.classList.remove('active'));
    }

    function addMessage(text, isUser = false) {
        if (!chatMessages) return;
        const msg = document.createElement('div');
        msg.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChatSubmit() {
        const query = chatInput.value.trim();
        if (!query) return;
        addMessage(query, true);
        chatInput.value = '';

        setTimeout(() => {
            const response = getBotResponse(query);
            addMessage(response, false);
        }, 600);
    }

    if (chatSend) chatSend.addEventListener('click', handleChatSubmit);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });
    }

    window.sendQuickMessage = function(text) {
        addMessage(text, true);
        setTimeout(() => {
            addMessage(getBotResponse(text), false);
        }, 600);
    };

    function getBotResponse(text) {
        const lower = text.toLowerCase();
        if (lower.includes('service') || lower.includes('offre')) {
            return "Nous proposons des services en BTP & construction, hydraulique (forages), location d'engins lourds, ainsi que le transport et la logistique.";
        } else if (lower.includes('devis') || lower.includes('prix')) {
            return "Vous pouvez obtenir une estimation rapide via notre page 'Estimation' ou demander un devis personnalisé sur la page 'Devis'.";
        } else if (lower.includes('où') || lower.includes('adresse') || lower.includes('agadez')) {
            return "Notre siège est situé à Agadez, quartier aéroport, Niger. Nous intervenons sur l'ensemble du territoire national.";
        }
        return "Merci pour votre message ! Un conseiller d'Afrique équipements et services reviendra vers vous rapidement. N'hésitez pas à consulter nos rubriques.";
    }

    // ========================================
    // 4. DARK MODE & BACK TO TOP
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('visible', window.scrollY > 300);
        });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});