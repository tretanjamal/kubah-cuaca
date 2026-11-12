/* Level 2 Hitung Awan (GDD bagian 9; TP2, TP3, TP6, TP7). Alat: clouds, kites, umbrellas, boats.
   Alur: misi Langit Mendung -> Tebak Dulu x3 -> permintaan warga x5 (teks tampil) -> pertanyaan x3 dengan kartu -> Cek Ulang -> hasil. */
(function () {
  var ALAT = PERMINTAAN.alatLevel[2];
  var TEBAK = [
    { id: 'kites', n: 3, kartu: ['is', 'are', 'a few', 'a little', 'many'] },
    { id: 'umbrellas', n: 1, kartu: ['is', 'are', 'an', 'a', 'a few'] },
    { id: 'boats', n: 10, kartu: ['is', 'are', 'a lot of', 'much', 'a few'] }
  ];
  /* dua permintaan pertama tetap (GDD), sisanya dari generator dan mengikuti adaptif */
  var AWAL = [{ warga: 'udin', target: { boats: 'few' } }, { warga: 'wati', target: { umbrellas: 'satu' } }];

  Scenes.add('level2', {
    enter: function (root) {
      var A = Alur.mulai(root, 2), st = A.st, lab = A.lab;
      this.uji = A.uji;
      function kata(id) { var b = Kuantitas.benda(id); return b.jamak || b.kata; }
      function serupaMinta(r) {
        return function () {
          var r2 = Tugas.permintaan(A.rnd, { alat: Object.keys(r.target), n: Object.keys(r.target).length, bolehNo: false });
          return A.minta(r2, { alat: ALAT });
        };
      }
      function mintaDari(x) { var r = { warga: x.warga, target: x.target, teks: Tugas.teksPermintaan(A.rnd, x.target) }; r.ulang = serupaMinta(r); return r; }
      function serupaTanya(j, id, n) {
        return function () { return A.tanya(Tugas.pertanyaan(j, id, n), { preset: (function () { var p = { clouds: 2 }; p[id] = n; return p; })() }); };
      }
      A.jalan(async function () {
        /* sambutan dan misi penemuan */
        A.pasangAlat(ALAT);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l2Sambut, 'sorak'));
        await A.misi({ fenomena: 'mendung', alat: ALAT, preset: { clouds: 1 }, arahan: STR.l2.misi, bayu: STR.bayu2.l2Misi, solusi: { clouds: 10 } });
        /* Tebak Dulu */
        for (var i = 0; i < TEBAK.length; i++) {
          var g = TEBAK[i];
          await A.tebak({ id: g.id, n: g.n, alat: ALAT, preset: { clouds: g.id === 'clouds' ? 0 : 1 }, kartu: g.kartu, arahan: U.fmt(STR.l2.tebakAtur, { n: g.n, kata: '*' + kata(g.id) + '*' }) });
        }
        /* permintaan warga */
        for (var k = 0; k < 5; k++) {
          var r = k < AWAL.length ? mintaDari(AWAL[k]) : (function () { var x = Tugas.permintaan(A.rnd, { alat: ALAT, n: st.nBenda, bolehNo: st.bolehNo }); x.ulang = serupaMinta(x); return x; })();
          await A.minta(r, { alat: ALAT });
        }
        /* pertanyaan dengan kartu: How many, Are there many (negatif), dan jamak tidak beraturan */
        await A.tanya(Tugas.pertanyaan('banyak', 'boats', 3), { preset: { clouds: 2, boats: 3 }, serupa: serupaTanya('banyak', 'boats', 10) });
        await A.tanya(Tugas.pertanyaan('tidak', 'kites', 2), { preset: { clouds: 2, kites: 2 }, serupa: serupaTanya('tidak', 'kites', 3) });
        A.preset({ clouds: 1, fish: 3 });
        if (!Save.punyaKata('fish')) await A.hidup(A.temuan('fish'));
        /* jamak tidak beraturan: kartu fish dan fishes */
        await A.tanya(Tugas.pertanyaanBenda('fish', 3), { preset: { clouds: 1, fish: 3 }, serupa: function () { return A.tanya(Tugas.pertanyaanBenda('fish', 9), { preset: { clouds: 1, fish: 9 } }); } });
        await A.cekUlang();
        A.hapusAlat();
        lab.arahan(STR.alur.levelSelesai, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.hebat, 'sorak'));
        A.selesai(['there-is-are', 'few-little', 'many-much', 'a-lot-of', 'simak-takaran']);
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { Alur.akhiri(); }
  });
})();
