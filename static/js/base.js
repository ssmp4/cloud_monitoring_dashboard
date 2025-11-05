
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;


const savedTheme = localStorage.getItem('app-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);


    if (typeof reinitializeCharts === 'function') {
        reinitializeCharts();
    }
});