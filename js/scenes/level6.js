/* Level 6 Telepon Pendengar (TAMBAHAN; GDD bagian 9). Warga menelepon radio dan bertanya tentang kubah acak, murid menjawab dengan kartu.
   8 pertanyaan campur (How many/much, Are there many / Is there much, Are/Is there any). Waktu 20 detik per pertanyaan hanya untuk
   bintang bonus: bintang ketiga butuh minimal 6 jawaban tepat sebelum waktu habis. Mode Santai tanpa waktu. Lekuk kartu disembunyikan. */
(function () {
  var POOL = ['clouds', 'kites', 'umbrellas', 'boats', 'rain', 'sunshine', 'wind', 'snow', 'fog', 'water'];
  var WARGA = ['dina', 'udin', 'wati', 'darto'];
  var JENIS = ['banyak', 'ada', 'tidak', 'banyak', 'ada', 'banyak', 'tidak', 'ada'];
  /* nilai yang selalu bisa dijawab dengan kartu pertanyaan (diuji di test/logic/tugas.js) */
  var NILAI = { banyak: { hitung: [0, 1, 3, 10], takar: [0, 20, 80] }, tidak: { hitung: [2, 3, 4, 10], takar: [10, 20, 30, 80] }, ada: { hitung: [0, 2, 3, 10], takar: [0, 20, 50, 80] } };
  var DETIK = 20, WAJIB_CEPAT = 6;
  var jam = null;

  Scenes.add('level6', {
    enter: function (root) {
      var A = Alur.mulai(root, 6, { musik: 'festival' }), st = A.st, lab = A.lab, santai = A.santai(), cepat = 0, sisa = DETIK, jalan = false;
      this.uji = A.uji;
      function jenisB(id) { return Kuantitas.benda(id).jenis; }
      /* pil waktu bonus di bawah Butir Embun (Mode Santai: tidak ada) */
      var pil = santai ? null : U.h('div', 'pil-waktu', '<span data-cek="waktu bonus"></span>');
      if (pil) root.appendChild(pil);
      function tulisWaktu() { if (!pil) return; pil.firstChild.textContent = U.fmt(STR.l6.waktu, { n: Math.max(0, Math.ceil(sisa)) }); pil.style.setProperty('--sisa', Math.max(0, sisa / DETIK).toFixed(3)); pil.classList.toggle('habis', sisa <= 5); }
      tulisWaktu();
      jam = setInterval(function () { if (!jalan || Loop.paused || Stage.portrait || Tween.paused || document.querySelector('.overlay')) return; sisa -= 0.25; tulisWaktu(); }, 250);

      /* kubah acak: benda yang ditanya pada nilai yang bisa dijawab, ditambah dua benda lain sebagai latar */
      function soal(j, id) {
        var daftar = NILAI[j][jenisB(id)], n = Tugas.pick(A.rnd, daftar), p = {};
        p[id] = n;
        Tugas.acak(A.rnd, POOL.filter(function (x) { return x !== id; })).slice(0, 2).forEach(function (x) {
          p[x] = jenisB(x) === 'hitung' ? Tugas.pick(A.rnd, [2, 3, 6, 9]) : Tugas.pick(A.rnd, [20, 50, 80]);
        });
        /* hujan dan salju butuh awan; awan nol yang ditanya tidak boleh ditemani hujan atau salju */
        if (id === 'clouds' && n === 0) { delete p.rain; delete p.snow; }
        else if ((p.rain || p.snow) && !p.clouds) p.clouds = 2;
        return { q: Tugas.pertanyaan(j, id, n), preset: p };
      }
      async function tanya(x, penanya, ulang) {
        sisa = DETIK; tulisWaktu();
        await A.tanya(x.q, { preset: x.preset, lekuk: false, penanya: penanya,
          serupa: ulang ? null : function () { var y = soal(x.q.jenis, x.q.id); return tanya(y, penanya, true); },
          onMulai: function () { sisa = DETIK; jalan = true; tulisWaktu(); },
          onBenar: function (salah) {
            jalan = false;
            if (!santai && !ulang && salah === 0 && sisa > 0) { cepat++; if (pil) { pil.classList.add('cepat'); setTimeout(function () { pil.classList.remove('cepat'); }, 900); } }
          } });
        jalan = false;
      }

      A.jalan(async function () {
        A.preset({ clouds: 2, sunshine: 50 });
        lab.judulPanel(STR.alur.kartu);
        lab.arahan(santai ? STR.l6.sambutSantai : STR.l6.sambut, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l6Sambut, 'sorak'));
        var jenis = Tugas.acak(A.rnd, JENIS), benda = Tugas.acak(A.rnd, POOL);
        for (var i = 0; i < jenis.length; i++) {
          st.langkah = 'tanya';
          await tanya(soal(jenis[i], benda[i % benda.length]), WARGA[i % WARGA.length]);
        }
        await A.cekUlang();
        A.hapusAlat();
        lab.arahan(santai ? STR.alur.levelSelesai : U.fmt(STR.l6.hasilCepat, { n: cepat }), false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l6Tutup, 'sorak'));
        A.selesai(['many-much', 'some-any', 'there-is-are'], { bonus: santai || cepat >= WAJIB_CEPAT });
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { clearInterval(jam); jam = null; Alur.akhiri(); }
  });
})();
