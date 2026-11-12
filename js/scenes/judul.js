/* Layar judul (mockup judul.html): stasiun di bukit saat matahari terbit, logo, tagline, MULAI, lalu Informasi, Referensi, Pengembang.
   MULAI pertama kali langsung ke hook 10 detik di Level 1; sesudahnya ke Stasiun. */
(function () {
  var kumu = null, lepasPojok = null;
  function logo() {
    var t = '';
    [STR.judul.a, STR.judul.b].forEach(function (k, i) {
      var y = 196 + i * 124;
      t += '<text x="60" y="' + (y + 8) + '" font-family="\'Baloo 2\', \'Arial Rounded MT Bold\', sans-serif" font-weight="800" font-size="134" fill="#1E3A4C" opacity=".28" stroke="#1E3A4C" stroke-width="12" stroke-linejoin="round">' + k + '</text>' +
        '<text x="60" y="' + y + '" font-family="\'Baloo 2\', \'Arial Rounded MT Bold\', sans-serif" font-weight="800" font-size="134" fill="url(#logo)" stroke="#1E3A4C" stroke-width="12" stroke-linejoin="round" paint-order="stroke" data-maxw="560">' + k + '</text>';
    });
    return t;
  }
  Scenes.add('judul', {
    enter: function (root) {
      var latar = Seni.aset('judulLatar'), awan = Seni.srcBenda('awan');
      root.insertAdjacentHTML('beforeend', latar ? '<img class="latar" alt="" src="' + latar + '">' :
        Seni.svg(1280, 720, '<rect width="1280" height="720" fill="url(#langit-fajar)"/>' + Seni.stasiunLuar(960, 524), { cls: 'latar' }));
      root.insertAdjacentHTML('beforeend', Seni.svg(1280, 720, (awan ? '<image class="awan-hanyut" href="' + awan + '" x="380" y="8" width="96" height="70"/>' : '') +
        Seni.burung(640, 150, 1) + Seni.burung(676, 134, .8) + logo(), { cls: 'lapis-judul' }));
      kumu = Lab.Kumu(root, 592, 206, 150);
      var tag = U.h('div', 'pelat tagline', UI.esc(STR.judul.tagline));
      tag.setAttribute('data-cek', 'tagline');
      root.appendChild(tag);
      var mulai = Input.button(Seni.ikon('main', 40) + '<span>' + STR.tombol.mulai + '</span>', 'utama besar', function () {
        Aud.init();
        Scenes.go(Save.data.hook ? 'stasiun' : 'level1');
      }, { x: 64, y: 448, w: 320, h: 88, id: 'mulai' });
      root.appendChild(mulai);
      [['info', 64, 178], ['referensi', 256, 178], ['pengembang', 448, 194]].forEach(function (x) {
        root.appendChild(Input.button(STR.tombol[x[0]], 'kedua', function () { UI.info(x[0] === 'info' ? 'info' : x[0]); }, { x: x[1], y: 574, w: x[2], id: 'tombol-' + x[0] }));
      });
      lepasPojok = UI.pojok(root);
      Aud.musik('judul');
      setTimeout(function () { mulai.focus({ preventScroll: true }); }, 60);
    },
    update: function (dt) { if (kumu) kumu.update(dt); },
    exit: function () { if (lepasPojok) lepasPojok(); lepasPojok = null; kumu = null; }
  });
})();
