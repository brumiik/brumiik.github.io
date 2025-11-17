// Najdeme tlačítko a element body
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Funkce pro nastavení motivu
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Zjistíme, jestli má uživatel uložený motiv z minulé návštěvy
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Pokud ne, můžeme zkusit detekovat preferenci systému
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Přidáme posluchač události na kliknutí
themeToggle.addEventListener('click', () => {
    // Zkontrolujeme, jestli už je zapnutý tmavý režim
    if (body.classList.contains('dark-mode')) {
        // Pokud ano, přepneme na světlý
        setTheme('light');
    } else {
        // Pokud ne, přepneme na tmavý
        setTheme('dark');
    }
});