/* Lab Bebas (GDD bagian 8): layar bermain tanpa tugas. Semua alat dalam tiga halaman (Langit, Angin, Lembah), JALANKAN kapan saja,
   fenomena baru diumumkan dan masuk Jurnal. Bila 60 detik tidak ada fenomena baru, Kumu membisikkan petunjuk tanpa kalimat Inggrisnya.
   Tombol Tebak Dulu (nyala/mati): bila nyala, JALANKAN memunculkan Rel Kalimat untuk alat yang terakhir diubah; murid menebak
   dengan kartu, lalu cuaca dijalankan dan tebakannya diperiksa (+3 Butir Embun bila tepat). */
(function () {
  var HALAMAN = [['clouds', 'rain', 'snow', 'sunshine'], ['kites', 'umbrellas', 'wind', 'fog'], ['boats', 'water', 'sand']];
  var jam = null;

  Scenes.add('labBebas', {
    enter: function (root) {
      var A = Alur.mulai(root, 0, { scene: 'labBebas', lensa: true }), st = A.st, lab = A.lab, hal = 0, tab = [], terakhir = performance.now();
      var tebakNyala = false, alatTerakhir = null;
      this.uji = A.uji;
      lab.tombolLensa.disabled = false;
      lab.bayu.el.style.display = 'none'; lab.bayu.foto.style.display = 'none';
      function buka(i) {
        hal = i;
        A.pasangAlat(HALAMAN[i], STR.lab.nama);
        tab.forEach(function (b, j) { b.classList.toggle('aktif', j === i); b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      }
      STR.alur.halaman.forEach(function (n, i) {
        var b = Input.button('<span>' + UI.esc(n) + '</span>', 'kedua tab-halaman', function () { if (st.tugas !== 'lab') return; Aud.sfx('pilih'); buka(i); }, { x: 392 + i * 148, y: 640, w: 140, h: 72, id: 'halaman-' + i, aria: n });
        root.appendChild(b); tab.push(b);
      });
      var sakelar = Input.button('<span class="tanda-tebak">?</span><span>' + UI.esc(STR.lab.tebak) + '</span>', 'kedua ikon-label tebak-lab', function () {
        if (st.tugas !== 'lab') return;
        tebakNyala = !tebakNyala;
        sakelar.classList.toggle('aktif', tebakNyala);
        sakelar.setAttribute('aria-pressed', tebakNyala ? 'true' : 'false');
        lab.arahan(tebakNyala ? STR.lab.tebakNyala : STR.lab.tebakMati);
      }, { x: 838, y: 640, id: 'tebak-lab', aria: STR.lab.tebakAria });
      sakelar.setAttribute('aria-pressed', 'false');
      root.appendChild(sakelar);
      A.onAlat = function (id) { alatTerakhir = id; };
      jam = setInterval(function () {
        if (Loop.paused || Stage.portrait || document.querySelector('.overlay') || performance.now() - terakhir < 60000) return;
        terakhir = performance.now();
        var belum = FENOMENA.daftar.filter(function (f) { return Save.data.fenomena.indexOf(f.id) < 0 && f.id !== 'bintang'; });
        if (!belum.length) return;
        lab.kumu.sesaat('heran', 2);
        lab.arahan(belum[Math.floor(Math.random() * belum.length)].petunjuk);
      }, 2000);

      /* Tebak Dulu di Lab: kartu sesuai jenis benda, selalu ada satu jawaban benar (some untuk zona abu-abu) */
      async function tebak(id) {
        var n = lab.kubah.nilai[id], h = Kuantitas.benda(id).jenis === 'hitung';
        var kartu = h ? (n === 1 ? ['is', 'are', 'a', 'an', 'a few'] : ['is', 'are', 'a few', 'many', 'a lot of', 'some', 'no']) : ['is', 'are', 'a little', 'much', 'a lot of', 'some', 'no'];
        var kerangka = ['There', { slot: 'kerja' }, { slot: 'kuant' }, Tugas.bentukBenda(id, n) + '.'];
        kartu = Tugas.acak(A.rnd, kartu);
        st.tugas = 'tebak-lab'; st.papanAlat = false;
        tab.concat([sakelar]).forEach(function (x) { x.disabled = true; });
        var s = A.soal(kerangka, kartu, { lekuk: true });
        st.solusi = { jenis: 'kartu', kartu: Alur.cariKunci(kerangka, kartu, lab.kubah.dunia()) };
        lab.arahan(STR.alur.tebak, false);
        await A.hidup(A.tungguJalan(function () { if (!s.lengkap()) { lab.arahan(STR.alur.isiDulu, false); Aud.sfx('bad'); } return s.lengkap(); }));
        s.kunci = true;
        var aktif = await A.hidup(A.jalankan(2400));
        var r = Tugas.nilai(s.teks(), lab.kubah.dunia());
        if (r.benar) {
          s.tanda(true); lab.arahan(STR.alur.tebakBenar, false);
          lab.kumu.sesaat('bersorak', 2); Aud.sfx('good'); lab.embun(3, lab.papan.el);
          Save.catat('there-is-are', true, false);
          await A.hidup(lab.papan.ucap());
        } else {
          s.tanda(false); lab.kumu.sesaat('heran', 2); Aud.sfx('bad');
          Save.catat('there-is-are', false, false);
          await A.hidup(A.jeda(700));
          A.tutupSoal(s); s = null;
          lab.papan.tampil(id, n, true);
          A.mis(r.tataBahasa && r.tataBahasa.length ? Alur.kodeMis(r.tataBahasa[0]) : 'tebak');
          lab.arahan(r.tataBahasa && r.tataBahasa.length ? Alur.pesanTB(r.tataBahasa[0]) : U.fmt(h ? STR.alur.tebakSalahHitung : STR.alur.tebakSalahTakar, { n: n, kata: Tugas.bentukBenda(id, n) }), false);
          await A.hidup(lab.papan.ucap());
        }
        await A.hidup(Voice.selesai()); await A.hidup(A.jeda(600));
        A.tutupSoal(s);
        st.papanAlat = true; st.tugas = 'lab';
        tab.concat([sakelar]).forEach(function (x) { x.disabled = false; });
        return aktif;
      }

      A.jalan(async function () {
        A.preset({ clouds: 2, sunshine: 40 });
        buka(0);
        st.papanAlat = true;
        lab.arahan(STR.lab.sambut);
        st.langkah = 'lab'; st.tugas = 'lab';
        while (true) {
          st.solusi = { jenis: 'alat', nilai: { clouds: 2, rain: 20, sunshine: 80 } };
          await A.hidup(A.tungguJalan());
          var lama = Save.data.fenomena.length;
          var aktif = tebakNyala && alatTerakhir ? await tebak(alatTerakhir) : await A.hidup(A.jalankan(2400));
          if (Save.data.fenomena.length > lama) terakhir = performance.now();
          else if (aktif.length && !tebakNyala) {
            var f = FENOMENA.daftar.filter(function (x) { return x.id === aktif[0]; })[0];
            lab.papan.fenomena(f.kalimat[0]);
            Voice.say(f.kalimat[0], { tokoh: 'papan', lang: 'en-US' });
          } else if (!aktif.length && !tebakNyala) lab.arahan(STR.lab.belumAda, false);
          buka(hal);
        }
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { clearInterval(jam); jam = null; Alur.akhiri(); }
  });
})();
