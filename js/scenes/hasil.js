/* Hasil level (GDD bagian 8): bintang muncul satu per satu dengan nada bertingkat, Butir Embun menghitung naik,
   keterampilan yang dikuasai dalam bahasa anak, satu saran "Ayo latih lagi", dan alat cuaca baru beserta faktanya. */
(function () {
  var kumu = null;
  Scenes.add('hasil', {
    enter: function (root, p) {
      var latar = Seni.aset('labDalam'), H = STR.hasil;
      root.insertAdjacentHTML('beforeend', latar ? '<img class="latar redup-latar" alt="" src="' + latar + '">' : Seni.svg(1280, 720, Seni.ruangStasiun({}), { cls: 'latar' }));
      kumu = Lab.Kumu(root, 250, 380, 190);
      kumu.eks('bersorak');
      var panel = U.h('div', 'pelat panel-hasil');
      panel.setAttribute('data-cek', 'panel hasil');
      /* paling banyak 3 keterampilan (2 bila ada saran latihan), yang paling dikuasai lebih dulu, supaya tombol tetap di dalam panel */
      var URUT = { dikuasai: 0, berkembang: 1, latihan: 2, belum: 3 };
      var tags = (p.tag || []).slice().sort(function (a, c) { return URUT[Save.status(a)] - URUT[Save.status(c)]; }).slice(0, p.latihan ? 2 : 3).map(function (t) {
        var s = Save.status(t);
        return '<li class="status-' + s + '">' + Seni.ikon(s === 'dikuasai' ? 'bintang' : 'titik1', 26) + '<span>' + UI.esc(STR.keterampilan[t]) + '</span></li>';
      }).join('');
      var A = STR.alatCuaca[STR.alatLevel[p.level]], src = A ? Seni.srcBenda(A.sprite) : null;
      panel.innerHTML = '<h2 data-cek="judul hasil">' + UI.esc(U.fmt(H.judul, { n: p.level })) + '</h2>' +
        '<div class="bintang-hasil"><span></span><span></span><span></span></div>' +
        '<div class="embun-hasil">' + Seni.ikon('embun', 40) + '<b class="nilai">' + (p.embunAwal || 0) + '</b><span>' + UI.esc(H.embun) + '</span></div>' +
        '<div class="kolom-hasil"><div class="kuasai"><b>' + UI.esc(H.kuasai) + '</b><ul data-cek="kuasai">' + (tags || '<li>' + UI.esc(H.belum) + '</li>') + '</ul>' +
        (p.latihan ? '<p class="latih" data-cek="latih"><b>' + UI.esc(H.latih) + ':</b> ' + UI.esc(STR.latihan[p.latihan] || '') + '</p>' : '') + '</div>' +
        (A ? '<div class="alat-baru"><b>' + UI.esc(H.alatBaru) + '</b>' + (src ? '<img alt="" src="' + src + '">' : '') + '<span class="nama-alat">' + UI.esc(A.nama) + '</span><span class="fakta" data-cek="fakta">' + UI.esc(A.fakta) + '</span></div>' : '') + '</div>';
      root.appendChild(panel);
      var baris = U.h('div', 'baris-hasil');
      baris.appendChild(Input.button(Seni.ikon('ulangi', 32) + '<span>' + STR.tombol.ulangi + '</span>', 'kedua', function () { Scenes.go('level' + p.level); }, { w: 200, id: 'hasil-ulangi' }));
      var lanjut = Input.button('<span>' + STR.tombol.lanjut + '</span>' + Seni.ikon('lanjut', 32), 'utama', function () { Scenes.go('stasiun'); }, { w: 220, id: 'hasil-lanjut' });
      baris.appendChild(UI.tombolTahan(UI.esc(STR.hasilBelajar.guruPendek), 'ketiga', function () { UI.guru(); }, { w: 210, id: 'hasil-guru', aria: STR.hasilBelajar.guruTahan }));
      baris.appendChild(lanjut);
      panel.appendChild(baris);
      Aud.musik('judul');
      /* bintang satu per satu */
      var slot = panel.querySelectorAll('.bintang-hasil span'), i = 0;
      slot.forEach(function (s) { s.innerHTML = Seni.ikon('bintang', 92, false); });
      Aud.sfx('fanfare', p.bintang);
      (function satu() {
        if (i >= 3) return;
        var s = slot[i], n = i;
        Tween.wait(420).then(function () {
          if (n < p.bintang) {
            s.innerHTML = Seni.ikon('bintang', 92);
            Aud.sfx('star', n);
            UI.muncul(s, 360);
            var t = UI.titik(s); if (t) UI.ledak(t.x, t.y, 10);
          }
          i++; satu();
        });
      })();
      Tween.wait(1500).then(function () { return UI.hitungNaik(panel.querySelector('.embun-hasil .nilai'), p.embunAwal || 0, p.embunAkhir || 0, 900); });
      if (A) Tween.wait(2200).then(function () { Aud.sfx('gong'); UI.lompat(panel.querySelector('.alat-baru')); });
      setTimeout(function () { lanjut.focus({ preventScroll: true }); }, 80);
      this.uji = { keadaan: function () { return { langkah: 'hasil', siap: true, bintang: p.bintang }; } };
    },
    update: function (dt) { if (kumu) kumu.update(dt); },
    exit: function () { kumu = null; }
  });
})();
