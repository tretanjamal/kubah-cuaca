/* Stasiun Cuaca (Pilih Level, GDD bagian 8): kubah di tengah, lembar tugas L1-L5 di kanan (bintang, atau gembok yang menjelaskan syaratnya),
   alat cuaca yang sudah didapat di kiri bawah (diketuk membacakan faktanya), Kumu, Butir Embun. */
(function () {
  var kumu = null, kubah = null, jendela = null, lepasPojok = null, DIBUAT = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true };
  Scenes.add('stasiun', {
    enter: function (root) {
      var latar = Seni.aset('labDalam'), K = Lab.KUBAH;
      root.insertAdjacentHTML('beforeend', latar ? '<img class="latar" alt="" src="' + latar + '">' : Seni.svg(1280, 720, Seni.ruangStasiun({ jendela: [22, 30, 228, 350] }), { cls: 'latar' }));
      jendela = Jendela(root);
      kubah = new Kubah(root, K);
      kubah.atur('clouds', 3); kubah.atur('sunshine', 40);
      if (Save.selesai(1)) kubah.tumbuhBunga(12);
      root.insertAdjacentHTML('beforeend', Seni.svg(1280, 720, Seni.kubahLebar(K.cx, K.by, K.w, K.top, ''), { cls: 'kaca-kubah' }));
      kumu = Lab.Kumu(root, 300, 330, 124);
      var judul = U.h('div', 'pelat judul-stasiun', '<b data-cek="judul stasiun">' + UI.esc(STR.stasiun.judul) + '</b><span class="embun-stasiun">' + Seni.ikon('embun', 32) + '<span data-cek="embun">' + Save.data.embun + '</span></span>');
      root.appendChild(judul);
      root.appendChild(UI.tombolIkon('beranda', STR.ikon.beranda, function () { Scenes.go('judul'); }, { x: 16, y: 20, id: 'beranda' }));
      for (var n = 1; n <= 6; n++) (function (n) {
        var buka = Save.terbuka(n), L = Save.data.level[n], bintang = '';
        for (var s = 0; s < 3; s++) bintang += Seni.ikon('bintang', 26, L && s < L.bintang ? undefined : false);
        var isi = '<span class="no-level">' + n + '</span><span class="nama-level"><b data-cek="nama level ' + n + '">' + UI.esc(STR.stasiun.nama[n]) + '</b>' +
          (buka ? '<span class="bintang-level">' + bintang + '</span>' : '<span class="kunci-level">' + Seni.ikon('kunci', 26) + '</span>') + '</span>';
        var b = Input.button(isi, 'kedua kartu-level' + (buka ? '' : ' terkunci') + (n === 1 && !Save.selesai(1) ? ' sorot' : ''), function () {
          if (!buka) { Aud.sfx('gembok'); UI.toast(U.fmt(STR.stasiun.terkunci, { n: n - 1 })); UI.goyang(b); return; }
          if (!DIBUAT[n]) { UI.toast(STR.stasiun.segera); return; }
          Scenes.go('level' + n);
        }, { x: 936, y: 100 + (n - 1) * 89, w: 328, h: 82, id: 'level-' + n, aria: U.fmt(STR.stasiun.level, { n: n }) + ' ' + STR.stasiun.nama[n] });
        root.appendChild(b);
      })(n);
      root.appendChild(Input.button(Seni.ikon('bintang', 28) + '<span>' + UI.esc(STR.hasilBelajar.tombol) + '</span>', 'ketiga stasiun-atas', function () { UI.hasilBelajar(); }, { x: 418, y: 20, w: 250, h: 64, id: 'hasil-belajar', aria: STR.hasilBelajar.judul }));
      /* Jurnal Cuaca dan pintu Lab Bebas (terbuka setelah Level 1) */
      root.appendChild(Input.button(Seni.ikon('jurnal', 30) + '<span>' + UI.esc(STR.jurnal.tombol) + '</span>', 'kedua stasiun-bawah', function () { Jurnal.buka(); }, { x: 936, y: 636, w: 156, h: 72, id: 'stasiun-jurnal', aria: STR.jurnal.judul }));
      var labBuka = Save.selesai(1);
      var pintu = Input.button((labBuka ? '' : Seni.ikon('kunci', 26)) + '<span>' + UI.esc(STR.lab.pintu) + '</span>', 'utama stasiun-bawah' + (labBuka ? '' : ' terkunci'), function () {
        if (!labBuka) { Aud.sfx('gembok'); UI.toast(STR.lab.terkunci); UI.goyang(pintu); return; }
        Scenes.go('labBebas');
      }, { x: 1100, y: 636, w: 164, h: 72, id: 'lab-bebas', aria: STR.lab.pintu });
      root.appendChild(pintu);
      /* alat cuaca yang sudah didapat */
      var x = 24;
      [1, 2, 3, 4, 5].forEach(function (n) {
        if (!Save.selesai(n)) return;
        var A = STR.alatCuaca[STR.alatLevel[n]], src = Seni.srcBenda(A.sprite);
        if (!src) return;
        var b = Input.button('<img alt="" src="' + src + '">', 'alat-cuaca', function () { UI.toast(A.nama + ': ' + A.fakta); }, { x: x, y: 588, w: 76, h: 110, aria: A.nama, id: 'alat-cuaca-' + n });
        root.appendChild(b); x += 84;
      });
      lepasPojok = UI.pojok(root);
      Aud.musik('judul');
    },
    update: function (dt) { if (kumu) kumu.update(dt); },
    exit: function () { if (lepasPojok) lepasPojok(); lepasPojok = null; if (kubah) kubah.lepas(); kubah = null; if (jendela) jendela.lepas(); jendela = null; kumu = null; }
  });
})();
