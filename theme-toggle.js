function applyTheme(mode) {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    button.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove('light-mode');
    button.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  applyTheme(saved === 'light' ? 'light' : 'dark');
  const button = document.querySelector('.theme-toggle');
  if (button) {
    button.addEventListener('click', () => {
      const isLight = !document.body.classList.contains('light-mode');
      const newMode = isLight ? 'light' : 'dark';
      applyTheme(newMode);
      localStorage.setItem('theme', newMode);
    });
  }
});
