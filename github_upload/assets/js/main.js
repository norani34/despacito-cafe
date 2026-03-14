// Example JS for github_upload preview
document.addEventListener('DOMContentLoaded', function(){
  const el = document.querySelector('.card');
  if (el) {
    const info = document.createElement('p');
    info.className = 'muted';
    info.textContent = 'This is a sample asset (assets/js/main.js) — replace with your build output.';
    el.appendChild(info);
  }
});
