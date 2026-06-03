// Mobile nav toggle
function toggleMenu(e) {
  if (e) e.preventDefault();
  var nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

// Close mobile nav on outside click
document.addEventListener('click', function(e) {
  var nav = document.getElementById('navLinks');
  if (!nav || !nav.classList.contains('open')) return;
  if (e.target.closest('.site-header nav')) return;
  nav.classList.remove('open');
});
