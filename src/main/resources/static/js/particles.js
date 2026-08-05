(function() {
    'use strict';

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