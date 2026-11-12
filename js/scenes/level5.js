/* Level 5 Festival Lembah (GDD bagian 6.10 dan 9; semua TP). Dua babak: tiga permintaan warga sekaligus (kartu di kiri menyala
   hijau saat terpenuhi), lalu Siaran Cuaca: tiga kalimat bebas tentang kubah yang dinilai pemeriksa kebenaran.
   Main pertama memakai babak tetap dari GDD; main ulang memakai generator pemaduan. */
(function () {
  var PAGI = { judul: 0, kartu: [{ warga: 'dina', target: { wind: 'lot', kites: 'few' } }, { warga: 'darto', target: { sunshine: 'lot', rain: 'no' } }, { warga: 'udin', target: { boats: 'few' } }],
    alat: ['kites', 'boats', 'wind', 'sunshine', 'rain'], preset: { clouds: 2, rain: 50, water: 30 } };
  var SORE = { judul: 1, kartu: [{ warga: 'wati', target: { rain: 'little', clouds: 'few' } }, { warga: 'dina', target: { wind: 'no' } }, { warga: 'udin', target: { boats: 'lot' } }],
    alat: ['clouds', 'boats', 'rain', 'wind', 'sunshine'], preset: { clouds: 1, wind: 80, kites: 3, water: 30 }, bonus: 'pelangi' };

  Scenes.add('level5', {
    enter: function (root) {
      var A = Alur.mulai(root, 5, { musik: 'festival' }), st = A.st, lab = A.lab;
      this.uji = A.uji;
      function jenis(id) { return Kuantitas.benda(id).jenis; }
      function kata(id) { var b = Kuantitas.benda(id); return b.jamak || b.kata; }
      function puas(k) { return Object.keys(k.target).every(function (id) { return Tugas.zonaId(id, lab.kubah.nilai[id] || 0) === k.target[id]; }); }

      /* ---------- babak festival ---------- */
      async function festival(b) {
        st.tugas = 'festival'; st.langkah = 'festival'; st.papanAlat = true;
        b.kartu.forEach(function (k) { k.teks = k.teks || Tugas.teksPermintaan(A.rnd, k.target); });
        A.preset(b.preset);
        A.pasangAlat(b.alat, STR.l5.babak[b.judul]);
        lab.kumu.el.style.visibility = 'hidden';
        var wadah = U.h('div', 'wadah-minta');
        root.appendChild(wadah);
        var el = b.kartu.map(function (k, i) {
          var P = Seni.aset('potret') || {}, src = P[k.warga] ? Seni.akar() + P[k.warga] : '';
          /* seluruh kartu adalah tombol: diketuk = permintaan diputar ulang (ikon dengar kecil di potret) */
          var d = Input.button('<img alt="" src="' + src + '"><p data-cek="permintaan ' + i + '">' + UI.esc(k.teks) + '</p><span class="centang">' + Seni.ikon('bintang', 28) + '</span><span class="dengar-kecil">' + Seni.ikon('dengar', 22) + '</span>',
            'kedua kartu-minta', function () { Voice.stop(); lab.bayu.warga(k.warga, k.teks); }, { x: 14, y: 248 + i * 126, id: 'minta-' + i, aria: PERMINTAAN.warga[k.warga].nama + ': ' + k.teks });
          wadah.appendChild(d); UI.muncul(d, 300 + i * 80);
          return d;
        });
        function segar() { b.kartu.forEach(function (k, i) { var p = puas(k); if (p && !el[i].classList.contains('puas')) Aud.sfx('tetes'); el[i].classList.toggle('puas', p); }); }
        A.onAlat = segar; segar();
        var nilaiBenar = {};
        b.alat.forEach(function (id) { nilaiBenar[id] = lab.kubah.nilai[id] || 0; });
        b.kartu.forEach(function (k) { Object.keys(k.target).forEach(function (id) { nilaiBenar[id] = Tugas.wakil(id, k.target[id]); }); });
        st.solusi = { jenis: 'alat', nilai: nilaiBenar };
        lab.arahan(STR.alur.festival, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l5Sambut, 'sorak'));
        for (var i = 0; i < b.kartu.length; i++) { UI.lompat(el[i]); await A.hidup(lab.bayu.warga(b.kartu[i].warga, b.kartu[i].teks)); }
        UI.idle.atur(function () {
          var k = b.kartu.filter(function (x) { return !puas(x); })[0];
          if (!k) return lab.tombolJalan;
          var id = Object.keys(k.target).filter(function (x) { return Tugas.zonaId(x, lab.kubah.nilai[x] || 0) !== k.target[x]; })[0];
          return A.sasaranAlat(id, nilaiBenar[id]);
        });
        var salah = 0;
        while (true) {
          await A.hidup(A.tungguJalan());
          var semua = b.kartu.every(puas);
          if (!semua) {
            salah++;
            var tk = A.tingkat(salah);
            A.mis('zona');
            lab.kumu.sesaat('heran', 2); Aud.sfx('bad');
            b.kartu.forEach(function (k, i) { if (!puas(k)) UI.goyang(el[i]); });
            if (tk === 1) lab.arahan(STR.alur.festivalBelum, false);
            else if (tk === 2) {
              var ids = []; b.kartu.forEach(function (k) { if (!puas(k)) Object.keys(k.target).forEach(function (id) { if (Tugas.zonaId(id, lab.kubah.nilai[id] || 0) !== k.target[id]) ids.push(id); }); });
              A.sorotAlat(ids); lab.arahan(STR.alur.sorotPermintaan, false);
            } else { st.petunjuk3++; A.sorotAlat(null); lab.arahan(STR.alur.tunjukPermintaan, false); await A.hidup(A.peraga(nilaiBenar)); }
            continue;
          }
          break;
        }
        UI.idle.atur(null); A.sorotAlat(null); A.onAlat = null;
        await A.hidup(A.jalankan(2400));
        el.forEach(function (d) { UI.lompat(d); });
        await A.hidup(A.nilai(['simak-takaran'], salah + 1, { dari: lab.tombolJalan }));
        if (b.bonus && lab.kubah.fenomena[b.bonus]) { lab.embun(10, lab.kubah.kanvas); }
        await A.hidup(A.jeda(900));
        wadah.remove();
      }

      /* ---------- Siaran Cuaca: 3 kalimat tentang kubah, benda berbeda, campur dihitung dan ditakar ---------- */
      async function siaran(b) {
        st.tugas = 'siaran'; st.langkah = 'siaran'; st.papanAlat = false;
        var ada = b.alat.filter(function (id) { return !(jenis(id) === 'hitung' && lab.kubah.nilai[id] === 1); });
        var h = ada.filter(function (id) { return jenis(id) === 'hitung'; }).slice(0, 2), t = Tugas.acak(A.rnd, ada.filter(function (id) { return jenis(id) !== 'hitung'; })).slice(0, 4 - Math.min(2, h.length));
        var pilihan = h.concat(t), kataBenda = pilihan.map(kata);
        var kartu = ['is', 'are', 'a few', 'a little', 'a lot of', 'some', 'no'].concat(kataBenda);
        var naskah = U.h('div', 'pelat naskah-siaran', '<b class="judul-naskah">' + UI.esc(STR.alur.siaranJudul) + '</b><ol></ol>');
        root.appendChild(naskah);
        var ol = naskah.querySelector('ol');
        for (var n = 0; n < 3; n++) ol.insertAdjacentHTML('beforeend', '<li data-cek="siaran ' + n + '"><span class="kosong-naskah"></span></li>');
        var lekuk = st.lekukBantu || A.santai(), dipakai = [], baris = [];
        lab.labelJalan(STR.alur.kirim);
        lab.arahan(STR.alur.siaran, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l5Siaran, 'sorak'));
        for (var nomor = 0; nomor < 3; nomor++) {
          var kerangka = ['There', { slot: 'kerja' }, { slot: 'kuant' }, { slot: 'benda' }, '.'];
          var s = A.soal(kerangka, kartu, { lekuk: lekuk, pakaiUlang: true });
          var dunia = lab.kubah.dunia();
          /* benda yang masih boleh dipakai: belum dipakai; kalimat ke-3 wajib jenis yang belum ada */
          var bolehBenda = function () {
            var jenisAda = dipakai.map(jenis), sisa = pilihan.filter(function (id) { return dipakai.indexOf(id) < 0; });
            if (dipakai.length === 2 && jenisAda[0] === jenisAda[1]) sisa = sisa.filter(function (id) { return jenis(id) !== jenisAda[0]; });
            return sisa;
          };
          var kunci = function () {
            var calon = bolehBenda();
            for (var c = 0; c < calon.length; c++) { var k = Alur.cariKunci(kerangka, kartu, dunia, [kata(calon[c])]); if (k) return k; }
            return null;
          };
          st.solusi = { jenis: 'kartu', kartu: kunci() };
          lab.arahan(nomor === 0 ? STR.alur.siaran : STR.alur.siaranSyarat, false);
          UI.idle.atur(function () { return s.lengkap() ? lab.tombolJalan : null; });
          var salah = 0;
          while (true) {
            await A.hidup(A.tungguJalan(function () { if (!s.lengkap()) { lab.arahan(STR.alur.isiDulu, false); Aud.sfx('bad'); } return s.lengkap(); }));
            var teks = s.teks(), r = Tugas.nilai(teks, dunia), idB = r.benda;
            if (idB && dipakai.indexOf(idB) >= 0) { lab.arahan(U.fmt(STR.alur.siaranSama, { kata: kata(idB) }), false); Aud.sfx('bad'); UI.goyang(lab.papan.el); continue; }
            if (idB && bolehBenda().indexOf(idB) < 0 && dipakai.length === 2) { lab.arahan(STR.alur.siaranCampur, false); Aud.sfx('bad'); UI.goyang(lab.papan.el); continue; }
            if (r.benar) break;
            salah++;
            var tk = A.tingkat(salah);
            s.tanda(false);
            A.mis(r.tataBahasa && r.tataBahasa.length ? Alur.kodeMis(r.tataBahasa[0]) : Alur.kodeMakna(r, dunia, idB));
            lab.kumu.sesaat('heran', 2); Aud.sfx('bad'); UI.goyang(lab.papan.el);
            if (!lekuk) { lekuk = true; s.lekuk(true); }
            var kk = idB && bolehBenda().indexOf(idB) >= 0 ? Alur.cariKunci(kerangka, kartu, dunia, [kata(idB)]) : kunci();
            if (tk === 1) lab.arahan(r.tataBahasa && r.tataBahasa.length ? Alur.pesanTB(r.tataBahasa[0]) : (idB ? Alur.pesanMakna(r, dunia, idB) : STR.alur.salahBenar), false);
            else if (tk === 2) { if (idB) { A.bantuZona(idB, dunia[idB] || 0); lab.arahan(STR.alur.sorotZona, false); } else { s.sorot(kk); lab.arahan(STR.alur.sorotKartu, false); } }
            else {
              st.petunjuk3++; s.sorot(null); s.kosongkan();
              lab.arahan(STR.alur.tunjukKartu, false);
              for (var i = 0; kk && i < kk.length; i++) { UI.tunjuk(s.kartuRak[kk[i]]); await A.hidup(A.jeda(600)); s.taruh(kk[i]); }
              UI.sembunyiTangan(true);
              teks = s.teks(); r = Tugas.nilai(teks, dunia); idB = r.benda;
              break;
            }
            s.tanda(null);
          }
          UI.idle.atur(null);
          s.kunci = true; s.sorot(null); s.tanda(true); A.tutupBantu();
          dipakai.push(idB); baris.push(teks);
          var li = ol.children[nomor]; li.innerHTML = UI.esc(teks); UI.muncul(li, 300);
          await A.hidup(lab.papan.ucap());
          var gz = { few: 'few-little', little: 'few-little', lot: 'a-lot-of' }[Tugas.zonaId(idB, dunia[idB] || 0)];
          await A.hidup(A.nilai(['there-is-are'].concat(gz ? [gz] : []), salah + 1, { dari: li, tanpaLekuk: !lekuk }));
          A.tutupSoal(s);
        }
        /* siaran dibacakan */
        lab.arahan('', false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.l5Buka, 'sorak'));
        for (var j = 0; j < baris.length; j++) { ol.children[j].classList.add('dibaca'); await A.hidup(Voice.say(baris[j], { tokoh: 'papan', lang: 'en-US' })); ol.children[j].classList.remove('dibaca'); }
        Aud.sfx('fanfare', 3);
        await A.hidup(A.jeda(800));
        naskah.remove();
        lab.kumu.el.style.visibility = '';
        st.papanAlat = true;
      }

      A.jalan(async function () {
        var babak = [PAGI, SORE];
        if (Save.selesai(5)) babak = [0, 1].map(function (i) { var p = Tugas.pemaduan(A.rnd), pre = { water: 30 }; Object.keys(p.target).forEach(function (id) { if (p.target[id] === 'no') pre[id] = Tugas.wakil(id, jenis(id) === 'hitung' ? 'few' : 'some'); }); if ((pre.rain || pre.snow) && !p.target.clouds) pre.clouds = 2; return { judul: i, kartu: p.kartu, alat: p.alat, preset: pre }; });
        for (var i = 0; i < babak.length; i++) {
          await festival(babak[i]);
          await siaran(babak[i]);
        }
        A.hapusAlat();
        lab.arahan(STR.alur.levelSelesai, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.hebat, 'sorak'));
        A.selesai(['simak-takaran', 'there-is-are', 'few-little', 'a-lot-of', 'hitung-takar']);
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { Alur.akhiri(); }
  });
})();
