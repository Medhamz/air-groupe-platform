(function() {
    'use strict';

    const serviceSelect = document.getElementById('serviceTypeCalc');
    const surfaceInput = document.getElementById('surface');
    const durationInput = document.getElementById('duration');
    const estimateAmount = document.getElementById('estimateAmount');

    if (serviceSelect && surfaceInput && durationInput && estimateAmount) {
        function calculateEstimate() {
            const service = serviceSelect.value;
            const surface = parseFloat(surfaceInput.value) || 0;
            const duration = parseFloat(durationInput.value) || 0;

            // Tarifs indicatifs par service (en CFA)
            const rates = {
                'btp': 25000,
                'hydraulique': 30000,
                'engins': 15000,
                'transport': 12000,
                'commerce': 20000,
                'prestations': 22000
            };

            const rate = rates[service] || 20000;
            let estimate = 0;

            if (service === 'engins' || service === 'transport') {
                // Pour les engins et transport, on se base sur la durée
                estimate = rate * duration;
            } else {
                // Pour les autres, on se base sur la surface
                estimate = rate * surface;
            }

            // Appliquer un minimum
            if (estimate < 100000) estimate = 100000;

            // Arrondir à 1000
            estimate = Math.ceil(estimate / 1000) * 1000;

            estimateAmount.textContent = estimate.toLocaleString('fr-FR') + ' FCFA';
        }

        serviceSelect.addEventListener('change', calculateEstimate);
        surfaceInput.addEventListener('input', calculateEstimate);
        durationInput.addEventListener('input', calculateEstimate);

        // Calcul initial
        calculateEstimate();
    }
})();