/* Layar muat: logo, tabung ukur yang terisi sebagai batang kemajuan, dan satu "Tahukah kamu?" cuaca.
   Pola dari Kafe Cilik: tampil minimal MIN ms supaya sempat terbaca, kemajuan tidak pernah mundur. */
(function (root) {
  var MIN = U.TEST && !/[?&]muat=1/.test(location.search) ? 0 : 1800, el = null, t0 = 0, nilai = 0;
  function logo() {
    var t = '';
    [STR.judul.a, STR.judul.b].forEach(function (k, i) {
      var y = 96 + i * 92;
      t += '<text x="0" y="' + (y + 6) + '" font-family="\'Baloo 2\', \'Arial Rounded MT Bold\', sans-serif" font-weight="800" font-size="100" fill="#1E3A4C" opacity=".25" stroke="#1E3A4C" stroke-width="10" stroke-linejoin="round">' + k + '</text>' +
        '<text x="0" y="' + y + '" font-family="\'Baloo 2\', \'Arial Rounded MT Bold\', sans-serif" font-weight="800" font-size="100" fill="url(#logo)" stroke="#1E3A4C" stroke-width="10" stroke-linejoin="round" paint-order="stroke">' + k + '</text>';
    });
    return Seni.svg(360, 210, t, { vb: '-10 0 360 210' });
  }
  var Muat = {
    buka: function () {
      t0 = performance.now(); nilai = 0;
      var tips = STR.muatTips;
      el = U.h('div', '',
        '<div class="muat-logo">' + logo() + '</div>' +
        '<div class="muat-tabung"><div class="muat-isi"></div><div class="muat-kilau"></div></div>' +
        '<div class="muat-teks"></div>' +
        '<div class="muat-tip"><b>' + UI.esc(STR.muatTahu) + '</b>' + UI.esc(tips[Math.floor(Math.random() * tips.length)]) + '</div>');
      el.id = 'muat';
      Stage.el.appendChild(el);
      Muat.atur(0);
    },
    /* k: 0 sampai 1; tabung ukur mendatar terisi biru hujan */
    atur: function (k) {
      if (!el) return;
      nilai = Math.max(nilai, k);
      el.querySelector('.muat-isi').style.width = Math.round(nilai * 100) + '%';
      el.querySelector('.muat-teks').textContent = STR.muat + '... ' + Math.round(nilai * 100) + '%';
    },
    tunggu: function () { return new Promise(function (ok) { setTimeout(ok, Math.max(0, MIN - (performance.now() - t0))); }); },
    tutup: function () {
      if (!el) return;
      var e = el;
      el = null;
      if (!MIN) { e.remove(); return; }
      e.classList.add('tutup');
      setTimeout(function () { e.remove(); }, 420);
    }
  };
  root.Muat = Muat;
})(window);
