// Bottone "tutti i progetti" per quando un progetto è aperto come app dalla Home dell'iPhone
// (o installato come app altrove): a schermo intero non c'è la barra del browser, quindi non si
// potrebbe tornare all'elenco. Nel browser normale il bottone non compare.
// Si include in ogni progetto con: <script src="/torna.js" defer></script>
// Si può trascinare: la posizione viene ricordata (stessa origine per tutti i progetti).
(function () {
  var app = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) ||
    (window.matchMedia && matchMedia('(display-mode: fullscreen)').matches) || navigator.standalone === true;
  if (!app || location.pathname === '/' || location.pathname === '/index.html') return;

  var KEY = 'torna.pos';
  var en = false;
  try { en = (localStorage.getItem('lang') || navigator.language || '').toLowerCase().indexOf('it') !== 0; } catch (e) { en = !/^it/i.test(navigator.language || ''); }
  var label = en ? 'All projects' : 'Tutti i progetti';

  var a = document.createElement('a');
  a.href = '/';
  a.setAttribute('aria-label', label);
  a.title = label;
  a.setAttribute('translate', 'no');
  a.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><g fill="currentColor">' +
    '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/>' +
    '<rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></g></svg>';
  var s = a.style;
  s.position = 'fixed'; s.zIndex = '2147483647';
  s.width = '46px'; s.height = '46px'; s.borderRadius = '50%';
  s.display = 'flex'; s.alignItems = 'center'; s.justifyContent = 'center';
  s.background = 'rgba(20,20,26,.78)'; s.color = '#fff';
  s.boxShadow = '0 4px 14px rgba(0,0,0,.35)'; s.border = '1px solid rgba(255,255,255,.25)';
  s.backdropFilter = s.webkitBackdropFilter = 'blur(6px)';
  s.touchAction = 'none'; s.textDecoration = 'none'; s.webkitTapHighlightColor = 'transparent';

  // posizione: in basso a sinistra, oppure dove l'ha lasciato l'utente (in % della finestra)
  var pos = null;
  try { pos = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* niente */ }
  function place(px, py) {
    var x = Math.min(Math.max(6, px), innerWidth - 52), y = Math.min(Math.max(6, py), innerHeight - 52);
    s.left = x + 'px'; s.top = y + 'px';
  }
  function home() {
    if (pos) place(pos.x * innerWidth, pos.y * innerHeight); else place(14, innerHeight - 46 - 24);
  }
  home();
  addEventListener('resize', home);

  // trascinamento: se il dito si sposta più di 8 px è uno spostamento, non un tocco
  var start = null, moved = false;
  a.addEventListener('pointerdown', function (e) {
    start = { x: e.clientX, y: e.clientY, l: parseFloat(s.left), t: parseFloat(s.top) }; moved = false;
    a.setPointerCapture(e.pointerId);
  });
  a.addEventListener('pointermove', function (e) {
    if (!start) return;
    var dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!moved && Math.abs(dx) + Math.abs(dy) < 8) return;
    moved = true;
    place(start.l + dx, start.t + dy);
  });
  a.addEventListener('pointerup', function () {
    if (moved) {
      pos = { x: parseFloat(s.left) / innerWidth, y: parseFloat(s.top) / innerHeight };
      try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (e) { /* niente */ }
    }
    start = null;
  });
  a.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } });

  function add() { document.body.appendChild(a); }
  if (document.body) add(); else addEventListener('DOMContentLoaded', add);
})();
