(function() {
    'use strict';

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatbotToggle || !chatbotWindow) return;

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
})();