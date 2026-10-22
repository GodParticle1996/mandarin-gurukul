/* =====================================================================
   Mandarin Gurukul — router + boot (LAST script)
   #/ · #/track/<id> · #/level/<id> · #/dojo · #/diary · #/legend · #/settings
   ===================================================================== */
function route() {
  MG.voice.stop();
  if (MG.toneAnimation) cancelAnimationFrame(MG.toneAnimation);
  MG.session = null;
  renderTopbar();
  const h = location.hash || '#/';
  const m = /^#\/(track|level)\/([\w-]+)/.exec(h);
  if (m && m[1] === 'track') {
    const t = MG.trackById(m[2]);
    if (t && MG.trackUnlocked(t)) showTrack(t); else showHome();
  } else if (m && m[1] === 'level') {
    const l = MG.levelById(m[2]);
    if (l && MG.levelUnlocked(l)) startLevel(l); else showHome();
  } else if (h === '#/situations') MG.showSituations();
  else if (h === '#/practice') MG.showPractice();
  else if (h === '#/tones') MG.showToneLab();
  else if (h === '#/plan') MG.showPlan();
  else if (h.startsWith('#/conversation/')) MG.showConversation(h.slice('#/conversation/'.length));
  else if (h === '#/dojo') showDojo();
  else if (h === '#/diary') showDiary();
  else if (h === '#/legend') showLegend();
  else if (h === '#/settings') showSettings();
  else showHome();
  MG.renderNav(h);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
window.addEventListener('pagehide', () => MG.voice.stop());
document.addEventListener('visibilitychange', () => { if (document.hidden) MG.voice.stop(); });
route();

/* PWA: ek baar internet ke saath kholo → phir offline (China mein bhi) */
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => { /* localhost http par bhi chalta hai */ });
}
