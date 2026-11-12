/* Level 1 Pasang Alat (GDD bagian 3 dan 9; brief bagian 6). TP1 hitung-takar, TP6 there-is-are.
   Alur: hook 10 detik (awan dan hujan) -> 9 kapsul kiriman (2 terpandu, lalu campur) -> Cek Ulang untuk yang salah -> Lensa (hujan, salju) -> hasil.
   Tiap kapsul: pilih Tombol Hitung atau Tuas Takar, lalu coba alatnya. Alat yang salah memberi akibat lucu (gumpal atau leleh).
   Petunjuk bertingkat per kapsul yang salah beruntun: 1 dorongan ringan, 2 sorot isi toples, 3 tangan menunjukkan alatnya. */
(function () {
  var BATAL = { batal: true }, sesi = 0, lab = null, st = null, penunggu = [];
  var SUASANA = { wind: { kites: 2, clouds: 2 }, fog: { boats: 2, clouds: 1 }, rain: { clouds: 2 }, snow: { clouds: 2 }, sunshine: { clouds: 1 }, umbrellas: { clouds: 1 }, boats: {}, kites: {}, water: { clouds: 1 }, sand: { sunshine: 30 } };
  var SEMUA = [].concat.apply([], BENDA.kapsulL1).length;   // 9 kapsul
  var TOTAL_ALAT = 2 + SEMUA;

  function tunggu(cek) { return new Promise(function (ok) { penunggu.push({ cek: cek, ok: ok }); periksa(); }); }
  function periksa() { penunggu = penunggu.filter(function (w) { if (w.cek()) { w.ok(); return false; } return true; }); }
  function jeda(ms) { return Tween.wait(ms); }
  function kata(id) { var b = Kuantitas.benda(id); return b.jamak || b.kata; }

  Scenes.add('level1', {
    enter: function (root) {
      var my = ++sesi;
      penunggu = [];
      function hidup(x) { if (my !== sesi) throw BATAL; if (x && typeof x.then === 'function') return x.then(function (v) { if (my !== sesi) throw BATAL; return v; }); return x; }
      st = { langkah: 'mulai', kapsul: null, benar: null, alat: {}, terpasang: ['clouds', 'rain'], salahBeruntun: 0, salahId: [], skor: 0, total: 0, petunjuk3: 0, mulai: performance.now(), pilihan: null, embunAwal: Save.data.embun, mis: {} };
      lab = Lab.bangun(root, {
        ulangi: function () { Scenes.go('level1'); },
        onLensa: function () { tombolLensa(); },
        onCerah: function () { Aud.sfx('whoosh'); lab.kubah.reset(st.simpanCerah || []); lab.papan.kosong(); Object.keys(st.alat).forEach(function (k) { if (st.alat[k].atur) st.alat[k].atur(lab.kubah.nilai[k] || 0); }); periksa(); },
        onLensaGeser: function () { segarLensa(); }
      });
      lab.tombolLensa.disabled = true;
      Aud.musik('lab');

      /* ---------- alat di panel ---------- */
      function hapusAlat() { Object.keys(st.alat).forEach(function (k) { st.alat[k].hapus(); }); st.alat = {}; lab.isiPanel.innerHTML = ''; }
      function pasangAlat(id, jenis, letak, salah) {
        var b = Kuantitas.benda(id), a;
        var o = {
          x: letak[0], y: letak[1], id: id, nilai: 0, salah: salah,
          onUbah: function (v, arah) {
            if (salah) { gagal(id, jenis, a); return; }
            lab.kubah.atur(id, v);
            lab.papan.tampil(id, v);
            if (id === 'clouds') Object.keys(st.alat).forEach(function (k) { if (st.alat[k].segar) st.alat[k].segar(); });
            segarLensa();
            if (arah > 0) UI.sembunyiTangan(true);
            periksa();
          },
          onPenuh: function () { lab.arahan(STR.alat.penuh); },
          redup: b.butuhAwan && !salah ? function () { return lab.kubah.nilai.clouds <= 0; } : null,
          onRedup: function () { lab.kumu.sesaat('heran'); lab.arahan(STR.alat.butuhAwan); }
        };
        a = jenis === 'hitung' ? Alat.TombolHitung(lab.isiPanel, o) : Alat.TuasTakar(lab.isiPanel, o);
        st.alat[id] = a;
        UI.muncul(a.el);
        return a;
      }
      function sasaranCoba(a) { return a.jenis === 'hitung' ? [a.tambah, {}] : [a.tuas, { geser: 'atas', fy: 0.75 }]; }

      /* ---------- Lensa ---------- */
      function segarLensa() {
        if (!lab.kubah.lensa.on) { lab.papan.lensa(null); return; }
        var isi = lab.kubah.isiLensa();
        if (isi && (!lab.papan.st.id || lab.papan.st.id !== isi.id)) lab.papan.tampil(isi.id, isi.nilai, true);
        lab.papan.lensa(isi ? isi.hasil : null);
      }
      function tombolLensa() {
        var L = lab.kubah.lensa;
        L.on = !L.on;
        lab.tombolLensa.classList.toggle('aktif', L.on);
        Aud.sfx('lensa');
        if (L.on) { L.x = 150; L.y = 230; }
        segarLensa();
        if (L.on) { Voice.stop(); lab.papan.ucap(); }
        UI.sembunyiTangan(true);
        periksa();
      }

      /* ---------- hook 10 detik ---------- */
      async function hook() {
        st.langkah = 'hook-awan';
        lab.judulPanel(STR.alat.panel);
        var awan = pasangAlat('clouds', 'hitung', [938, 182]);
        var hujan = pasangAlat('rain', 'takar', [1046, 316]);
        lab.papan.tampil('clouds', 0);
        lab.arahan(STR.hook.awan);
        UI.idle.atur(function () { return lab.kubah.nilai.clouds < 3 ? awan.tambah : [hujan.tuas, { geser: 'atas', fy: 0.75 }]; });
        UI.tunjuk(awan.tambah);
        await hidup(tunggu(function () { return lab.kubah.nilai.clouds >= 1; }));
        lab.arahan(STR.hook.lagi, false);
        await hidup(tunggu(function () { return lab.kubah.nilai.clouds >= 3; }));
        lab.kumu.sesaat('bersorak', 1.8); Aud.sfx('good');
        lab.embun(10, awan.el);
        await hidup(jeda(500)); await hidup(Voice.selesai());
        st.langkah = 'hook-hujan';
        lab.arahan(STR.hook.hujan);
        UI.tunjuk(hujan.tuas, { geser: 'atas', fy: 0.75 });
        await hidup(tunggu(function () { return lab.kubah.nilai.rain >= 10; }));
        UI.sembunyiTangan(true);
        lab.kubah.tumbuhBunga(12);
        lab.kumu.sesaat('bersorak', 1.8); Aud.sfx('good');
        await hidup(jeda(600)); await hidup(Voice.selesai());
        await hidup(lab.bayu.ucap(STR.bayu.sambut, 'sorak'));
        Save.data.hook = true; Save.save();
        UI.idle.atur(null);
        hapusAlat();
      }

      /* ---------- meja pasang: kapsul, dua pilihan alat, lalu coba ---------- */
      function mejaPasang(id, o) {
        o = o || {};
        hapusAlat();
        lab.judulPanel(STR.l1.kiriman);
        var b = Kuantitas.benda(id), kartu = U.h('div', 'kartu-kapsul');
        kartu.innerHTML = '<div class="toples">' + Seni.toples(id, 112) + '</div><div class="nama-kapsul"><b data-cek="kata kapsul">' + UI.esc(kata(id)) + '</b><span data-cek="arti kapsul">' + UI.esc(b.arti) + '</span></div>';
        kartu.appendChild(UI.tombolIkon('dengar', STR.ikon.dengar, function () { Voice.stop(); ucapKapsul(id); }, { x: 238, y: 86, id: 'dengar-kapsul', ukuran: 34 }));
        lab.isiPanel.appendChild(kartu);
        var pilihan = {};
        ['hitung', 'takar'].forEach(function (j, i) {
          var tb = Input.button(Seni.gambarAlat(j) + '<span class="label-alat">' + STR.alat[j] + '</span>', 'kedua pilih-alat', function () { if (st.pilihan) st.pilihan(j); }, { x: 938 + i * 166, y: 336, id: 'pilih-' + j, aria: STR.alat[j] });
          lab.isiPanel.appendChild(tb); pilihan[j] = tb;
        });
        var rak = U.h('div', 'rak-alat');
        rak.innerHTML = '<span data-cek="rak">' + UI.esc(U.fmt(STR.l1.terpasang, { n: st.terpasang.length, t: TOTAL_ALAT })) + '</span><span class="titik-rak">' +
          new Array(TOTAL_ALAT + 1).join('.').split('').map(function (x, i) { return '<i class="' + (i < st.terpasang.length ? 'on' : '') + '"></i>'; }).join('') + '</span>';
        lab.isiPanel.appendChild(rak);
        if (!UI.kurangi) { kartu.style.translate = '0 -60px'; Tween.run(380, function (e) { kartu.style.translate = '0 ' + (-60 * (1 - e)) + 'px'; }, Ease.easeOutBack).then(function () { kartu.style.translate = ''; }); }
        Aud.sfx('kapsul');
        return { kartu: kartu, pilihan: pilihan };
      }
      function ucapKapsul(id) {
        var b = Kuantitas.benda(id);
        return lab.bayu.ucap(b.jenis === 'hitung' ? U.fmt(STR.bayu.iniHitung, { jamak: b.jamak }) : U.fmt(STR.bayu.iniTakar, { kata: b.kata }));
      }
      function alasan(id) { return Kuantitas.benda(id).jenis === 'hitung' ? STR.l1.alasanHitung : STR.l1.alasanTakar; }
      function gagal(id, jenis, a) {
        if (st.gagalId === id) return;
        st.gagalId = id;
        lab.kubah.aturEfek(jenis === 'hitung' ? 'gumpal' : 'leleh', id);
        lab.papan.tanda('?');
        Aud.sfx(jenis === 'hitung' ? 'gumpal' : 'leleh');
        setTimeout(function () { Aud.sfx('bad'); }, 260);
        lab.kumu.sesaat('heran', 2.4);
        UI.goyang(a.el);
        periksa();
      }

      async function kapsul(id, o) {
        o = o || {};
        hidup();
        var b = Kuantitas.benda(id), benar = b.jenis, pertama = true;
        st.kapsul = id; st.benar = benar; st.langkah = o.cekUlang ? 'cek' : 'pilih'; st.gagalId = null;
        lab.kubah.reset(); lab.kubah.aturEfek(null); lab.papan.kosong();
        var pres = SUASANA[id] || {};
        Object.keys(pres).forEach(function (k) { lab.kubah.atur(k, pres[k]); });
        st.simpanCerah = Object.keys(pres);
        var meja = mejaPasang(id, o);
        await hidup(ucapKapsul(id));
        /* tingkat petunjuk dari kapsul salah beruntun; Mode Santai: sorot (tingkat 2) sejak awal */
        var tingkat = st.salahBeruntun + 1;
        if (Save.data.settings.santai) tingkat = Math.max(2, tingkat);
        if (o.terpandu) tingkat = 3;
        lab.arahan(U.fmt(o.cekUlang ? STR.l1.cekUlang : STR.l1.pilih, { kata: '*' + kata(id) + '*' }));
        if (tingkat === 2 && !o.terpandu) { meja.kartu.classList.add('sorot'); lab.arahan(STR.l1.sorot); }
        if (tingkat >= 3) {
          if (!o.terpandu) { st.petunjuk3++; lab.arahan(U.fmt(STR.l1.tunjuk, { kata: kata(id), alasan: alasan(id) })); }
          UI.tunjuk(meja.pilihan[benar], { fy: 0.3 });
        }
        UI.idle.atur(function () { return st.langkah === 'pilih' || st.langkah === 'cek' ? [meja.pilihan[benar], { fy: 0.3 }] : (st.alat[id] ? sasaranCoba(st.alat[id]) : null); });
        /* pilih alat sampai benar */
        while (true) {
          st.langkah = o.cekUlang ? 'cek' : 'pilih';
          var j = await hidup(new Promise(function (ok) { st.pilihan = ok; }));
          st.pilihan = null;
          UI.sembunyiTangan(true);
          meja.kartu.classList.remove('sorot');
          if (o.cekUlang) {
            if (j === benar) break;
            pertama = false; Aud.sfx('bad'); lab.kumu.sesaat('heran', 2);
            UI.goyang(meja.pilihan[j]); meja.pilihan[j].disabled = true;
            lab.arahan(U.fmt(STR.l1.tunjuk, { kata: kata(id), alasan: alasan(id) }));
            UI.tunjuk(meja.pilihan[benar], { fy: 0.3 });
            continue;
          }
          ['hitung', 'takar'].forEach(function (x) { meja.pilihan[x].style.visibility = 'hidden'; });
          var salah = j !== benar;
          var a = pasangAlat(id, j, j === 'hitung' ? [938, 344] : [1046, 330], salah);
          st.langkah = 'coba';
          lab.arahan(STR.l1.coba + ' ' + (j === 'hitung' ? STR.l1.cobaHitung : STR.l1.cobaTakar));
          if (tingkat >= 3 || o.terpandu) { var s = sasaranCoba(a); UI.tunjuk(s[0], s[1]); }
          if (!salah) {
            await hidup(tunggu(function () { return lab.kubah.nilai[id] > (pres[id] || 0); }));
            break;
          }
          await hidup(tunggu(function () { return st.gagalId === id; }));
          pertama = false;
          UI.sembunyiTangan(true);
          lab.arahan(U.fmt(j === 'hitung' ? STR.l1.salahHitung : STR.l1.salahTakar, { kata: '*' + kata(id) + '*' }));
          Save.catatSalah('hitung-takar'); Save.catatMis(j === 'hitung' ? 'pilih-takar' : 'pilih-hitung');
          st.mis[j === 'hitung' ? 'pilih-takar' : 'pilih-hitung'] = (st.mis[j === 'hitung' ? 'pilih-takar' : 'pilih-hitung'] || 0) + 1;
          await hidup(jeda(1700));
          a.hapus(); delete st.alat[id];
          lab.kubah.aturEfek(null); lab.papan.kosong(); st.gagalId = null;
          ['hitung', 'takar'].forEach(function (x) { meja.pilihan[x].style.visibility = ''; });
          meja.pilihan[j].disabled = true;
          UI.tunjuk(meja.pilihan[benar], { fy: 0.3 });
        }
        /* berhasil */
        st.langkah = 'berhasil';
        UI.idle.atur(null); UI.sembunyiTangan(true);
        st.total++; if (pertama) st.skor++;
        st.salahBeruntun = pertama ? 0 : st.salahBeruntun + 1;
        if (!pertama && !o.cekUlang) st.salahId.push(id);
        Save.catat('hitung-takar', pertama);
        if (st.terpasang.indexOf(id) < 0) st.terpasang.push(id);
        Save.temukanKata(id);
        lab.kumu.sesaat('bersorak', 2); Aud.sfx('good');
        var src = st.alat[id] ? st.alat[id].el : meja.pilihan[benar];
        lab.embun(pertama ? 10 : 5, src);
        if (st.alat[id]) { UI.lompat(st.alat[id].el); Aud.sfx('pasang'); }
        lab.arahan(U.fmt(benar === 'hitung' ? STR.l1.berhasilHitung : STR.l1.berhasilTakar, { kata: '*' + kata(id) + '*' }).replace(/^\*(\w)/, function (m, c) { return '*' + c.toUpperCase(); }), false);
        await hidup(jeda(700)); await hidup(Voice.selesai()); await hidup(jeda(500));
      }

      /* ---------- Lensa: hujan dan salju dilihat dari dekat ---------- */
      async function lensaDemo() {
        hidup();
        hapusAlat();
        lab.kubah.reset(); lab.kubah.aturEfek(null); lab.papan.kosong();
        lab.kubah.atur('clouds', 2);
        st.simpanCerah = ['clouds'];
        lab.judulPanel(STR.alat.panel);
        lab.tombolLensa.disabled = false;
        await hidup(lab.bayu.ucap(STR.bayu.lensa, 'pikir'));
        var pasang = [['rain', STR.l1.lensaHujan, STR.bayu.lensaHujan], ['snow', STR.l1.lensaSalju, STR.bayu.lensaSalju]];
        for (var i = 0; i < pasang.length; i++) {
          var id = pasang[i][0];
          st.langkah = 'lensa-' + id; st.kapsul = id;
          hapusAlat();
          if (lab.kubah.lensa.on) tombolLensa();
          lab.kubah.atur('rain', 0); lab.kubah.atur('snow', 0);
          lab.papan.kosong();
          var a = pasangAlat(id, 'takar', [1046, 330]);
          lab.arahan(pasang[i][1]);
          UI.tunjuk(a.tuas, { geser: 'atas', fy: 0.75 });
          UI.idle.atur(function () { return lab.kubah.nilai[id] < 10 ? [a.tuas, { geser: 'atas', fy: 0.75 }] : lab.tombolLensa; });
          await hidup(tunggu(function () { return lab.kubah.nilai[id] >= 10; }));
          await hidup(jeda(400));
          lab.arahan(STR.l1.lensaKetuk, false);
          if (!lab.kubah.lensa.on) UI.tunjuk(lab.tombolLensa);
          await hidup(tunggu(function () { return lab.kubah.lensa.on && lab.kubah.nilai[id] >= 10; }));
          UI.sembunyiTangan(true); UI.idle.atur(null);
          await hidup(jeda(500)); await hidup(Voice.selesai());
          lab.kumu.sesaat('bersorak', 2); Aud.sfx('good');
          lab.embun(10, lab.tombolLensa);
          await hidup(lab.bayu.ucap(pasang[i][2], 'sorak'));
          Save.catat('hitung-takar', true);
          await hidup(jeda(600));
        }
      }

      async function jalan() {
        if (!Save.data.hook) await hook();
        else { lab.kubah.atur('clouds', 1); }
        hidup();
        await hidup(lab.bayu.ucap(STR.bayu.kiriman));
        var urutan = [];
        BENDA.kapsulL1.forEach(function (putaran) { putaran.forEach(function (id) { urutan.push(id); }); });
        for (var i = 0; i < urutan.length; i++) await kapsul(urutan[i], { terpandu: i < BENDA.kapsulL1[0].length && !Save.selesai(1) });
        /* Cek Ulang: kapsul yang salah muncul lagi di akhir level */
        var ulang = st.salahId.slice();
        for (var k = 0; k < ulang.length; k++) { st.langkah = 'cek'; await kapsul(ulang[k], { cekUlang: true }); }
        await lensaDemo();
        st.langkah = 'selesai';
        hapusAlat();
        if (lab.kubah.lensa.on) tombolLensa();
        lab.arahan(STR.l1.selesai, false);
        await hidup(lab.bayu.ucap(STR.bayu.selesai, 'sorak'));
        var rasio = st.total ? st.skor / st.total : 1;
        var bintang = st.petunjuk3 === 0 && rasio >= 0.9 ? 3 : (rasio >= 0.7 ? 2 : 1);
        Save.catatLevel(1, { selesai: true, bintang: bintang, petunjuk3: st.petunjuk3, detik: Math.round((performance.now() - st.mulai) / 1000) });
        var mis = Object.keys(st.mis).sort(function (x, y) { return st.mis[y] - st.mis[x]; })[0];
        Scenes.go('hasil', { level: 1, bintang: bintang, embunAwal: st.embunAwal, embunAkhir: Save.data.embun, tag: ['hitung-takar'], latihan: mis || null });
      }
      jalan().catch(function (e) { if (e !== BATAL) console.error(e); });
      this.uji = {
        keadaan: function () {
          return { langkah: st.langkah, kapsul: st.kapsul, benar: st.benar, siap: !!st.pilihan || /coba|hook|lensa/.test(st.langkah), skor: st.skor, total: st.total,
            kubah: lab ? JSON.parse(JSON.stringify(lab.kubah.nilai)) : null, lensa: lab ? lab.kubah.lensa.on : false, papan: lab ? lab.papan.teks() : [] };
        },
        /* uji kinerja: atur cuaca kubah langsung (kasus terberat) */
        kubah: function () { return lab ? lab.kubah : null; },
        cuaca: function (o) { Object.keys(o).forEach(function (k) { if (k === 'lensa') { lab.kubah.lensa.on = !!o.lensa; lab.kubah.lensa.x = 200; lab.kubah.lensa.y = 220; } else if (k === 'malam') lab.kubah.aturMalam(o.malam); else lab.kubah.atur(k, o[k]); }); }
      };
    },
    update: function (dt) { if (lab) lab.update(dt); },
    exit: function () { sesi++; penunggu = []; UI.idle.atur(null); UI.sembunyiTangan(true); if (lab) lab.lepas(); lab = null; }
  });
})();
