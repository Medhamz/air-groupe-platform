(function() {
    'use strict';

    // ========================================
    // CHATBOT
    // ========================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Réponses prédéfinies
    const responses = {
        'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'hello': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'salut': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        'services': 'Nous proposons : BTP, hydraulique, commerce général, location d\'engins lourds, transport et logistique.',
        'devis': 'Vous pouvez demander un devis via notre formulaire en ligne ou nous contacter directement.',
        'prix': 'Les prix varient selon vos besoins. Nous vous invitons à demander un devis personnalisé.',
        'contact': 'Vous pouvez nous joindre au +227 96 96 74 74 ou par email à tidjani22686@gmail.com',
        'agadez': 'Nous sommes basés à Agadez, quartier aéroport, et intervenons dans tout le Niger.',
        'merci': 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.',
        'au revoir': 'Au revoir ! N\'hésitez pas à revenir si vous avez besoin d\'aide.',
        'bye': 'Au revoir ! N\'hésitez pas à revenir si vous avez besoin d\'aide.'
    };

    const defaultResponse = 'Je suis désolé, je n\'ai pas compris votre demande. Voici quelques sujets que je peux traiter : services, devis, prix, contact, agadez.';

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase().trim();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerInput.includes(key)) {
                return response;
            }
        }
        return defaultResponse;
    }

    function addMessage(text, sender) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${sender}`;
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSend() {
        const input = chatInput.value.trim();
        if (!input) return;

        addMessage(input, 'user');
        chatInput.value = '';

        // Simuler une réponse du bot avec délai
        setTimeout(() => {
            const response = getBotResponse(input);
            addMessage(response, 'bot');
        }, 500);
    }

    // Événements
    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatInput.focus();
            }
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleSend);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Message de bienvenue
    setTimeout(() => {
        if (chatMessages) {
            addMessage('Bonjour ! Je suis l\'assistant virtuel d\'Afrique équipements et services. Posez-moi vos questions !', 'bot');
        }
    }, 1000);
})();