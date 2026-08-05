(function() {
    'use strict';

    const serviceSelect = document.getElementById('serviceTypeCalc');
    const surfaceInput = document.getElementById('surface');
    const durationInput = document.getElementById('duration');
    const estimateAmount = document.getElementById('estimateAmount');
    const surfaceValue = document.getElementById('surfaceValue');
    const durationValue = document.getElementById('durationValue');

    if (!serviceSelect || !surfaceInput || !durationInput || !estimateAmount) return;

    function calculateEstimate() {
        const service = serviceSelect.value;
        const surface = parseFloat(surfaceInput.value) || 0;
        const duration = parseFloat(durationInput.value) || 0;

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
            estimate = rate * duration;
        } else {
            estimate = rate * surface;
        }

        if (estimate < 100000) estimate = 100000;
        estimate = Math.ceil(estimate / 1000) * 1000;

        estimateAmount.textContent = estimate.toLocaleString('fr-FR') + ' FCFA';
        if (surfaceValue) surfaceValue.textContent = surface + ' m²';
        if (durationValue) durationValue.textContent = duration + ' heures';
    }

    serviceSelect.addEventListener('change', calculateEstimate);
    surfaceInput.addEventListener('input', calculateEstimate);
    durationInput.addEventListener('input', calculateEstimate);

    calculateEstimate();
})();