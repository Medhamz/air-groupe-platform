document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // 1. CARTE 3D NIGER & AGADEZ (THREE.JS)
    // ========================================
    (function init3DMap() {
        const container = document.getElementById('niger3dContainer');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;

        // Lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xd4af37, 1.2);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        // Groupe principal de la carte du Niger
        const nigerGroup = new THREE.Group();

        // Base 3D de la forme du Niger (Plateau Extrudé)
        const shape = new THREE.Shape();
        shape.moveTo(-2, -1);
        shape.lineTo(-1.8, 0.2);
        shape.lineTo(-0.8, 1.8);  // Agadez (Nord)
        shape.lineTo(1.8, 1.5);   // Bilma (Est)
        shape.lineTo(2, -0.2);
        shape.lineTo(1, -1.2);
        shape.lineTo(-0.5, -1.5);
        shape.closePath();

        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ color: 0x1a2a3a, metalness: 0.3, roughness: 0.4 });
        const mapMesh = new THREE.Mesh(geometry, material);
        mapMesh.rotation.x = -Math.PI / 2;
        nigerGroup.add(mapMesh);

        // Région d'Agadez Mise en valeur (Aura dorée vibrante)
        const agadezGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
        const agadezMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.5, metalness: 0.8 });
        const agadezMesh = new THREE.Mesh(agadezGeo, agadezMat);
        agadezMesh.position.set(0.1, 0.15, -0.4);
        nigerGroup.add(agadezMesh);

        // Marqueur d'Agadez (Pulsation)
        const pinGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(0.1, 0.5, -0.4);
        nigerGroup.add(pin);

        scene.add(nigerGroup);

        // Animation
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotation douce continue du pays
            nigerGroup.rotation.y = elapsedTime * 0.2;

            // Mouvement de pulsation sur Agadez
            const scale = 1 + Math.sin(elapsedTime * 4) * 0.15;
            pin.scale.set(scale, scale, scale);
            agadezMat.emissiveIntensity = 0.4 + Math.sin(elapsedTime * 3) * 0.3;

            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Responsive
        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    })();

    // ========================================
    // 2. GESTION THÈME (DARK MODE)
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ========================================
    // 3. COMPTEUR & STATISTIQUES
    // ========================================
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        const suffix = stat.getAttribute('data-suffix') || '';
                        let current = 0;
                        const step = target / 50;
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            stat.textContent = Math.floor(current) + suffix;
                        }, 30);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        const statsSec = document.querySelector('.stats-section');
        if (statsSec) observer.observe(statsSec);
    }

    // ========================================
    // 4. CHATBOT & BACK TO TOP
    // ========================================
    const chatToggle = document.getElementById('chatbotToggle');
    const chatWin = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');

    if (chatToggle && chatWin) {
        chatToggle.addEventListener('click', () => chatWin.classList.toggle('active'));
        if (closeChat) closeChat.addEventListener('click', () => chatWin.classList.remove('active'));
    }

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            backBtn.classList.toggle('visible', window.scrollY > 300);
        });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});