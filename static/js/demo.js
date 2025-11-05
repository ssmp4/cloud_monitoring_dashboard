// static/js/demo.js

let charts = {}; // Храним экземпляры графиков

function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#e0e0e0' : '#2c3e50',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        border: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
        pointBg: isDark ? '#fff' : '#000'
    };
}

function createChart(id, config) {
    const ctx = document.getElementById(id);
    if (!ctx) {
        console.warn(`🟡 Canvas #${id} не найден`);
        return null;
    }
    if (charts[id]) charts[id].destroy();
    try {
        charts[id] = new Chart(ctx, config);
        return charts[id];
    } catch (error) {
        console.error(`🔴 Ошибка при создании #${id}:`, error);
        return null;
    }
}

function initDashboard() {
    if (!window.dashboardData) {
        console.error("❌ Данные не загружены");
        return;
    }

    const { months, metrics, rawData } = window.dashboardData;
    const colors = getThemeColors(); // ← Пересчитываем каждый раз!

    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: colors.text, font: { size: 11 } }
            }
        },
        scales: {
            x: {
                ticks: { color: colors.text },
                grid: { color: colors.border }
            },
            y: {
                ticks: { color: colors.text },
                grid: { color: colors.grid }
            }
        }
    };

    const CHART_COLORS = {
        availability: '#4CAF50',
        responseTime: '#2196F3',
        qos: '#FF9800',
        hardware: '#F44336',
        software: '#9C27B0',
        network: '#03A9F4',
        mtbf: '#8BC34A'
    };

    // 1. Availability
    createChart('availabilityChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Готовность',
                data: metrics.availability,
                borderColor: CHART_COLORS.availability,
                backgroundColor: `${CHART_COLORS.availability}22`,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: colors.pointBg,
                pointRadius: 4,
                pointHoverRadius: 5
            }]
        },
        options: {
            ...baseOptions,
            scales: {
                ...baseOptions.scales,
                y: { min: 0.95, max: 1.0 }
            }
        }
    });

    // 2. Время отклика
    createChart('responseTimeChart', {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Отклик (мс)',
                data: metrics.response_time_ms,
                backgroundColor: CHART_COLORS.responseTime
            }]
        },
        options: baseOptions
    });

    // 3. QoS
    createChart('qosChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'QoS (%)',
                data: metrics.qos,
                borderColor: CHART_COLORS.qos,
                backgroundColor: `${CHART_COLORS.qos}22`,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: colors.pointBg
            }]
        },
        options: baseOptions
    });

    // 4. Сбои
    createChart('failuresChart', {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                { label: 'Аппаратные', data: rawData.hardware_failures, backgroundColor: CHART_COLORS.hardware },
                { label: 'Программные', data: rawData.software_failures, backgroundColor: CHART_COLORS.software },
                { label: 'Сетевые', data: rawData.network_failures, backgroundColor: CHART_COLORS.network }
            ]
        },
        options: baseOptions
    });

    // 5. Стабильность
    createChart('stabilityChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label: 'Аппаратная', data: metrics.stability.hardware, borderColor: CHART_COLORS.hardware, tension: 0.2, pointBackgroundColor: colors.pointBg },
                { label: 'Программная', data: metrics.stability.software, borderColor: CHART_COLORS.software, tension: 0.2, pointBackgroundColor: colors.pointBg },
                { label: 'Сетевая', data: metrics.stability.network, borderColor: CHART_COLORS.network, tension: 0.2, pointBackgroundColor: colors.pointBg }
            ]
        },
        options: {
            ...baseOptions,
            scales: {
                ...baseOptions.scales,
                y: { min: 0, max: 1, ticks: { stepSize: 0.2 } }
            }
        }
    });

    // 6. MTBF
    createChart('mtbfChart', {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'MTBF (ч)',
                data: metrics.mtbf_hours,
                backgroundColor: CHART_COLORS.mtbf
            }]
        },
        options: baseOptions
    });

    console.log("✅ Графики инициализированы/обновлены");
}

// Запуск при загрузке
document.addEventListener("DOMContentLoaded", initDashboard);

// Экспортируем для main.js
window.reinitializeCharts = initDashboard;