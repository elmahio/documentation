const theme = localStorage.getItem("bs-theme") || "light";
localStorage.setItem("bs-theme", theme);
document.documentElement.setAttribute('data-bs-theme', theme === 'light' ? 'light' : 'darkmode');