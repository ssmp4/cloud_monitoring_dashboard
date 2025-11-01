
document.addEventListener("DOMContentLoaded", function () {
    if (!window.dashboardData) {
        console.error("Данные не загружены");
        return;
    }

    const { months, metrics, rawData } = window.dashboardData;

    // График: Availability
    new Chart(document.getElementById('availabilityChart'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Коэффициент готовности',
                data: metrics.availability,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, scales: { y: { min: 0.95, max: 1.0 } } }
    });

    // Время отклика
    new Chart(document.getElementById('responseTimeChart'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Время отклика (мс)',
                data: metrics.response_time_ms,
                backgroundColor: '#2196F3'
            }]
        },
        options: { responsive: true }
    });

    // QoS
    new Chart(document.getElementById('qosChart'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'QoS (%)',
                data: metrics.qos,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true }
    });

    // Сбои по типам
    new Chart(document.getElementById('failuresChart'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                { label: 'Аппаратные', data: rawData.hardware_failures, backgroundColor: '#F44336' },
                { label: 'Программные', data: rawData.software_failures, backgroundColor: '#9C27B0' },
                { label: 'Сетевые', data: rawData.network_failures, backgroundColor: '#03A9F4' }
            ]
        },
        options: { responsive: true }
    });

    // Индекс стабильности
    new Chart(document.getElementById('stabilityChart'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label: 'Аппаратная', data: metrics.stability.hardware, borderColor: '#F44336', tension: 0.2 },
                { label: 'Программная', data: metrics.stability.software, borderColor: '#9C27B0', tension: 0.2 },
                { label: 'Сетевая', data: metrics.stability.network, borderColor: '#03A9F4', tension: 0.2 }
            ]
        },
        options: { responsive: true, scales: { y: { min: 0, max: 1 } } }
    });

    // MTBF
    new Chart(document.getElementById('mtbfChart'), {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'MTBF (часы)',
                data: metrics.mtbf_hours,
                backgroundColor: '#8BC34A'
            }]
        },
        options: { responsive: true }
    });
});