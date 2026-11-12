/* Level 3 Takar Hujan (GDD bagian 9; TP1-TP4, TP6, TP7). Alat campur: benda dihitung tetap ikut supaya murid terus membedakan.
   Alur: misi Pelangi -> Tebak Dulu x2 -> Lensa x2 (How much rain? lalu How many raindrops?) -> permintaan x4 dengan dengar dulu
   -> pertanyaan x3 -> Cek Ulang -> hasil. Panel paling banyak 2 Tombol Hitung dan 3 Tuas Takar. */
(function () {
  var SEMUA = PERMINTAAN.alatLevel[3];
  var AWAL = [{ warga: 'darto', target: { sunshine: 'lot', rain: 'no' } }, { warga: 'wati', target: { rain: 'little', clouds: 'few' } }];

  Scenes.add('level3', {
    enter: function (root) {
      var A = Alur.mulai(root, 3, { lensa: true }), st = A.st, lab = A.lab;
      this.uji = A.uji;
      function jenis(id) { return Kuantitas.benda(id).jenis; }
      /* panel permintaan: yang diminta + pengecoh sampai 2 hitung dan 3 takar. "no" diminta dari kubah yang tadinya berisi benda itu. */
      function siapkan(r) {
        var ids = Object.keys(r.target), preset = {}, panel = ids.slice();
        ids.forEach(function (id) { if (r.target[id] === 'no') preset[id] = Tugas.wakil(id, jenis(id) === 'hitung' ? 'few' : 'some'); });
        if ((preset.rain || preset.snow) && !r.target.clouds) preset.clouds = 2;
        Tugas.acak(A.rnd, SEMUA).forEach(function (id) {
          if (panel.indexOf(id) >= 0 || preset[id] != null || panel.length >= 5) return;
          var nh = panel.filter(function (x) { return jenis(x) === 'hitung'; }).length;
          if (jenis(id) === 'hitung' ? nh >= 2 : panel.length - nh >= 3) return;
          if (Kuantitas.benda(id).butuhAwan && !r.target.clouds && !preset.clouds) return;
          panel.push(id);
        });
        return { alat: panel, preset: preset, dengar: true };
      }
      function serupaMinta(r) {
        return function () { var r2 = Tugas.permintaan(A.rnd, { alat: SEMUA, n: Object.keys(r.target).length, bolehNo: true, warga: r.warga }); return A.minta(r2, siapkan(r2)); };
      }
      function buat(x) { var r = { warga: x.warga, target: x.target, teks: Tugas.teksPermintaan(A.rnd, x.target) }; r.ulang = serupaMinta(r); return r; }
      function dengan(id, v) { var p = { clouds: 2 }; p[id] = v; return p; }
      function serupaTanya(j, id, v) { return function () { return A.tanya(Tugas.pertanyaan(j, id, v), { preset: dengan(id, v) }); }; }
      function duniaLensa(id) { return function () { var d = lab.kubah.dunia(), L = Kuantitas.lensa(id, d[id]); d[L.benda] = L.n; return d; }; }
      async function lensa(id, v) {
        await A.tanya(Tugas.pertanyaan('banyak', id, v), { preset: dengan(id, v), serupa: serupaTanya('banyak', id, v >= 70 ? 20 : 80) });
        var L = Kuantitas.lensa(id, v);
        await A.hidup(lab.bayu.ucap(STR.bayu2.lensaTanya, 'pikir'));
        await A.tanya(Tugas.pertanyaan('banyak', L.benda, L.n), { lensa: true, dunia: duniaLensa(id) });
        if (lab.kubah.lensa.on) A.tombolLensa();
      }
      A.jalan(async function () {
        A.pasangAlat(['clouds', 'kites', 'rain', 'sunshine', 'wind']);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l3Sambut, 'sorak'));
        await A.misi({ fenomena: 'pelangi', alat: ['clouds', 'kites', 'rain', 'sunshine', 'wind'], preset: { clouds: 2 }, arahan: STR.l3.misi, bayu: STR.bayu2.l3Misi, solusi: { rain: 20, sunshine: 80 } });
        /* Tebak Dulu */
        await A.tebak({ id: 'rain', n: 20, alat: ['clouds', 'umbrellas', 'rain', 'sunshine'], preset: { clouds: 2 }, kartu: ['is', 'are', 'a little', 'a few', 'much'], arahan: U.fmt(STR.l3.tebakSedikit, { kata: '*rain*' }) });
        await A.tebak({ id: 'sunshine', n: 80, alat: ['kites', 'boats', 'sunshine', 'wind', 'fog'], preset: { clouds: 1 }, kartu: ['is', 'are', 'a lot of', 'many', 'much'], arahan: U.fmt(STR.l3.tebakBanyak, { kata: '*sunshine*' }) });
        /* Lensa: adegan yang sama, dua jawaban */
        lab.tombolLensa.disabled = false;
        await lensa('rain', 20);
        await lensa('snow', 80);
        /* permintaan dengan dengar dulu */
        for (var k = 0; k < 4; k++) {
          var r = k < AWAL.length ? buat(AWAL[k]) : (function () { var x = Tugas.permintaan(A.rnd, { alat: SEMUA, n: Math.max(2, st.nBenda), bolehNo: st.bolehNo }); x.ulang = serupaMinta(x); return x; })();
          await A.minta(r, siapkan(r));
        }
        /* pertanyaan */
        await A.tanya(Tugas.pertanyaan('banyak', 'snow', 20), { preset: dengan('snow', 20), serupa: serupaTanya('banyak', 'snow', 80) });
        await A.tanya(Tugas.pertanyaan('tidak', 'wind', 80), { preset: { clouds: 1, wind: 80 }, serupa: serupaTanya('tidak', 'wind', 20) });
        await A.tanya(Tugas.pertanyaan('banyak', 'fog', 80), { preset: { clouds: 1, fog: 80 }, serupa: serupaTanya('banyak', 'fog', 20) });
        /* jamak tidak beraturan: angin kencang menggugurkan daun (kartu leaves dan leafs) */
        A.preset({ clouds: 1, wind: 80, leaves: 10 });
        if (!Save.punyaKata('leaves')) await A.hidup(A.temuan('leaves'));
        await A.tanya(Tugas.pertanyaanBenda('leaves', 10), { preset: { clouds: 1, wind: 80, leaves: 10 }, serupa: function () { return A.tanya(Tugas.pertanyaanBenda('leaves', 3), { preset: { clouds: 1, wind: 80, leaves: 3 } }); } });
        await A.cekUlang();
        A.hapusAlat();
        lab.arahan(STR.alur.levelSelesai, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.hebat, 'sorak'));
        A.selesai(['hitung-takar', 'few-little', 'many-much', 'a-lot-of', 'there-is-are', 'simak-takaran']);
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { Alur.akhiri(); }
  });
})();
