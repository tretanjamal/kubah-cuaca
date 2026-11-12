/* Alur bersama Level 2-5 dan Lab Bebas (GDD bagian 6, 9, 10). Satu kerangka layar bermain dengan JALANKAN dan Jurnal,
   ditambah jenis tugas yang dipakai ulang oleh naskah level:
   - misi    : buat fenomena (Langit Mendung, Pelangi, Malam Berbintang)
   - tebak   : Tebak Dulu, atur alat lalu tebak kalimatnya dengan kartu sebelum JALANKAN
   - minta   : permintaan warga (atau Kak Bayu) dipenuhi dengan alat, dinilai zonanya
   - tanya   : pertanyaan Kak Bayu dijawab dengan Kartu Kata di Rel Kalimat (bisa dengan Lensa atau Senter)
   - festival: tiga permintaan sekaligus (L5), lalu siaran: tiga kalimat bebas yang dinilai pemeriksa kebenaran
   Petunjuk bertingkat per tugas: 1 dorongan ringan spesifik, 2 sorot bagian penting, 3 tunjukkan caranya lalu soal serupa.
   Adaptif: 3 tugas tepat beruntun menambah benda permintaan (maks. 3) dan membuka "no"; 2 tugas tidak tepat beruntun mengurangi
   dan menampilkan lagi lekuk kartu. Tugas yang tidak tepat pada coba pertama masuk Cek Ulang di akhir level. */
(function (root) {
  var BATAL = { batal: true }, sesi = 0, cur = null;
  function acakSeed(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function benda(id) { return Kuantitas.benda(id); }
  function kata(id) { var b = benda(id); return b.jamak || b.kata; }
  function jenis(id) { return benda(id).jenis; }
  var PREF = ['a lot of', 'a few', 'a little', 'some', 'no', 'any', 'many', 'much', 'an', 'a', 'one'];
  var TAG_ZONA = { few: 'few-little', little: 'few-little', lot: 'a-lot-of', no: 'some-any' };

  /* kode pemeriksa tata bahasa -> pesan Kumu (STR.alur.tataBahasa) */
  function pesanTB(kode) {
    var T = STR.alur.tataBahasa, k = String(kode || ''), nb;
    if (k.indexOf('kelompok:') === 0) { nb = k.split('+')[1]; return T[jenis(cariId(nb)) === 'takar' ? 'kelompok-takar' : 'kelompok-hitung']; }
    if (k.indexOf('jamak-salah') === 0 || k.indexOf('perlu-jamak') === 0) return T['jamak-salah'];
    if (k.indexOf('artikel') === 0) return T.artikel;
    return T[k] || T.umum;
  }
  function kodeMis(kode) {
    var k = String(kode || '');
    if (k.indexOf('kelompok:') === 0) return jenis(cariId(k.split('+')[1])) === 'takar' ? 'kelompok-takar' : 'kelompok-hitung';
    if (k.indexOf('artikel') === 0) return 'artikel';
    if (k.indexOf('jamak') >= 0) return 'jamak-salah';
    return k;
  }
  function cariId(w) {
    w = String(w || '').toLowerCase().replace(/[.,?]/g, '');
    var b = BENDA.daftar.filter(function (x) { return x.kata === w || x.jamak === w || x.tunggal === w; })[0];
    return b ? b.id : 'clouds';
  }
  /* umpan balik makna: kalimat rapi tetapi tidak sesuai kubah. Menyebut faktanya (jumlah atau takaran), bukan kata jawabannya. */
  function pesanMakna(r, dunia, idCadang) {
    var M = STR.alur.makna, id = (r && r.benda) || idCadang;
    if (!id) return STR.alur.salahBenar;
    var b = benda(id), n = dunia[id] || 0, w = b.jamak || b.kata;
    if (n === 0) return U.fmt(M.kosong, { kata: w });
    if (b.jenis === 'hitung') return n === 1 ? U.fmt(M.satu, { kata: b.tunggal }) : U.fmt(M.hitung, { kata: w, n: n });
    return U.fmt(M.takar, { kata: w, n: n });
  }
  function kodeMakna(r, dunia, idCadang) {
    var id = (r && r.benda) || idCadang, n = id ? dunia[id] || 0 : 0;
    return n === 0 || (r && (r.kuant === 'no' || r.kuant === 'any' || r.yn)) ? 'makna-ada' : 'makna-jumlah';
  }
  /* alasan kebahasaan saat kartu ditolak lekuk; hasil [pesan, kode miskonsepsi] */
  function alasanTolak(k, nw) {
    var L = STR.alur.lekukAlasan, kel = Kartu.kelompok(k), a = Tugas.alur(nw || ''), isi = { kartu: k, benda: (nw || '').replace(/[.,?]/g, '') };
    if (kel === 'kerja') return /^is/.test(k) ? [U.fmt(L.kerjaIs, isi), 'is-jamak'] : [U.fmt(L.kerjaAre, isi), a === 'gel' ? 'are-takar' : 'are-tunggal'];
    if (kel === 'takar') return [U.fmt(L.kuantTakar, isi), 'kelompok-hitung'];
    if (kel === 'hitung' && a === 'gel') return [U.fmt(L.kuantHitung, isi), 'kelompok-takar'];
    if (['a', 'an', 'one'].indexOf(k) >= 0) return [U.fmt(L.kuantSatu, isi), 'are-tunggal'];
    if (kel === 'hitung' || kel === 'serba') return [U.fmt(L.kuantBanyak, isi), 'kuant-tunggal'];
    return [U.fmt(STR.alur.lekuk, isi), null];
  }

  /* kartu kunci: kombinasi kartu yang tersedia yang benar menurut pemeriksa (urutan kesukaan PREF) */
  function cariKunci(kerangka, kartu, dunia, bendaPilih, cocokJawab) {
    var slot = kerangka.filter(function (x) { return typeof x !== 'string'; }).map(function (x) { return x.slot; });
    var calon = {};
    slot.forEach(function (s) {
      calon[s] = kartu.filter(function (k) { return Kartu.slotUntuk(k) === s && (s !== 'benda' || !bendaPilih || bendaPilih.indexOf(k) >= 0); });
      if (s === 'kuant') calon[s].sort(function (a, b) { return PREF.indexOf(a) - PREF.indexOf(b); });
    });
    var hasil = null;
    (function cari(i, pilih) {
      if (hasil) return;
      if (i === slot.length) {
        var t = kerangka.map(function (x) { return typeof x === 'string' ? x : pilih[x.slot]; }).join(' ').replace(/\s+([.,?])/g, '$1');
        var r = Tugas.nilai(t, dunia);
        if (r.benar && (!cocokJawab || cocokJawab(r))) hasil = slot.map(function (s) { return pilih[s]; });
        return;
      }
      calon[slot[i]].forEach(function (k) { var p = {}; for (var x in pilih) p[x] = pilih[x]; p[slot[i]] = k; cari(i + 1, p); });
    })(0, {});
    return hasil;
  }

  function mulai(el, nomor, o) {
    o = o || {};
    var my = ++sesi, penunggu = [];
    var seed = /[?&]seed=(\d+)/.exec(location.search);
    var A = cur = { nomor: nomor, o: o, rnd: acakSeed(seed ? +seed[1] : (Date.now() & 0xffffff)), alat: {}, panel: [] };
    var st = A.st = { langkah: 'mulai', tugas: null, siap: false, skor: 0, total: 0, petunjuk3: 0, mulai: performance.now(), embunAwal: Save.data.embun,
      mis: {}, tag: {}, ulang: [], benarB: 0, salahB: 0, nBenda: 1, bolehNo: nomor >= 3, lekukBantu: false, solusi: null, jalan: false, papanAlat: true, preset: {}, cekUlang: false };
    A.hidup = function (x) {
      if (my !== sesi) throw BATAL;
      /* janji: sesi diperiksa lagi sesudah selesai, supaya alur level lama berhenti walau ucapannya dibuang saat keluar */
      if (x && typeof x.then === 'function') return x.then(function (v) { if (my !== sesi) throw BATAL; return v; });
      return x;
    };
    A.periksa = function () { if (my !== sesi) return; penunggu = penunggu.filter(function (w) { if (w.cek()) { w.ok(); return false; } return true; }); };
    A.tunggu = function (cek) { return new Promise(function (ok) { penunggu.push({ cek: cek, ok: ok }); A.periksa(); }); };
    A.jeda = function (ms) { return Tween.wait(ms); };
    A.santai = function () { return !!Save.data.settings.santai; };

    var lab = A.lab = Lab.bangun(el, {
      ulangi: function () { Scenes.go(o.scene || ('level' + nomor)); },
      jalankan: function () { if (lab.tombolJalan.disabled) return; st.jalan = true; A.periksa(); },
      jurnal: true,
      onLensa: function () { A.tombolLensa(); },
      onCerah: function () { A.cerah(); },
      onLensaGeser: function () { A.segarLensa(); },
      onSenter: function () { if (A.onSenter) A.onSenter(); A.periksa(); }
    });
    lab.tombolLensa.disabled = !o.lensa;
    lab.tombolJalan.disabled = true;
    A.rak = U.h('div', 'rak-kartu'); A.rak.setAttribute('data-cek', 'rak kartu');
    el.appendChild(A.rak);
    Aud.musik(o.musik || 'lab');

    /* ---------- alat di Panel Kendali ---------- */
    A.hapusAlat = function () { Object.keys(A.alat).forEach(function (k) { A.alat[k].hapus(); }); A.alat = {}; A.panel = []; };
    function buatAlat(id, x, y) {
      var b = benda(id), a, h = b.jenis === 'hitung';
      var opsi = {
        x: x, y: y, id: id, nilai: lab.kubah.nilai[id] || 0,
        onUbah: function (v, arah) {
          lab.kubah.atur(id, v);
          if (st.papanAlat) lab.papan.tampil(id, v);
          if (id === 'clouds') Object.keys(A.alat).forEach(function (k) { if (A.alat[k].segar) A.alat[k].segar(); });
          A.segarLensa();
          if (arah > 0) UI.sembunyiTangan(true);
          if (A.onAlat) A.onAlat(id, v);
          A.periksa();
        },
        onPenuh: function () { lab.arahan(STR.alat.penuh); },
        redup: b.butuhAwan ? function () { return lab.kubah.nilai.clouds <= 0; } : null,
        onRedup: function () { lab.kumu.sesaat('heran'); lab.arahan(STR.alat.butuhAwan); }
      };
      a = h ? Alat.TombolHitung(lab.isiPanel, opsi) : Alat.TuasTakar(lab.isiPanel, opsi);
      A.alat[id] = a;
      if (!UI.kurangi) UI.muncul(a.el);
      return a;
    }
    /* tata letak: Tombol Hitung bertumpuk (320x110), Tuas Takar berjajar tiga (104x220) */
    A.pasangAlat = function (ids, judul) {
      A.hapusAlat();
      A.rak.style.display = 'none';
      lab.judulPanel(judul || STR.alat.panel);
      var h = ids.filter(function (id) { return jenis(id) === 'hitung'; }), t = ids.filter(function (id) { return jenis(id) !== 'hitung'; }), y = 172;
      h.forEach(function (id, i) { buatAlat(id, 938, y + i * 116); });
      y += h.length * 116;
      t.forEach(function (id, j) { buatAlat(id, 940 + (j % 3) * 108, y + Math.floor(j / 3) * 226); });
      A.panel = ids.slice();
    };
    A.aturAlat = function (id, v) {
      lab.kubah.atur(id, v);
      if (A.alat[id]) A.alat[id].atur(v);
      Object.keys(A.alat).forEach(function (k) { if (A.alat[k].segar) A.alat[k].segar(); });
      if (st.papanAlat) lab.papan.tampil(id, v, true);
      if (A.onAlat) A.onAlat(id, v);
      A.periksa();
    };
    A.sorotAlat = function (ids) { Object.keys(A.alat).forEach(function (k) { A.alat[k].el.classList.toggle('sorot', !!ids && ids.indexOf(k) >= 0); }); };
    /* sasaran tangan penunjuk untuk alat: tombol + / - atau tuas */
    A.sasaranAlat = function (id, v) {
      var a = A.alat[id]; if (!a) return null;
      if (a.jenis === 'hitung') return [v < a.nilai() ? a.kurang : a.tambah, {}];
      return [a.tuas, { geser: v >= a.nilai() ? 'atas' : null, fy: 1 - v / 100 * 0.8 }];
    };
    A.preset = function (p, malam) {
      lab.kubah.reset();
      if (malam != null) lab.kubah.aturMalam(malam);
      st.preset = p || {};
      Object.keys(st.preset).forEach(function (k) { lab.kubah.atur(k, st.preset[k]); });
      lab.kubah.aturEfek(null);
      lab.papan.kosong();
    };
    A.cerah = function () {
      if (A.soalAktif) return;
      Aud.sfx('whoosh');
      var p = st.preset || {};
      lab.kubah.reset(Object.keys(p));
      Object.keys(p).forEach(function (k) { lab.kubah.atur(k, p[k]); });
      Object.keys(A.alat).forEach(function (k) { A.alat[k].atur(lab.kubah.nilai[k] || 0); if (A.alat[k].segar) A.alat[k].segar(); });
      if (st.papanAlat) lab.papan.kosong();
      A.periksa();
    };

    /* ---------- Lensa ---------- */
    A.segarLensa = function () {
      if (!lab.kubah.lensa.on) { if (st.papanAlat) lab.papan.lensa(null); return; }
      var isi = lab.kubah.isiLensa();
      if (st.papanAlat) {
        if (isi && lab.papan.st.id !== isi.id) lab.papan.tampil(isi.id, isi.nilai, true);
        lab.papan.lensa(isi ? isi.hasil : null);
      }
    };
    A.tombolLensa = function () {
      var L = lab.kubah.lensa;
      L.on = !L.on;
      lab.tombolLensa.classList.toggle('aktif', L.on);
      Aud.sfx('lensa');
      if (L.on) { L.x = 150; L.y = 230; }
      A.segarLensa();
      if (L.on && st.papanAlat) { Voice.stop(); lab.papan.ucap(); }
      UI.sembunyiTangan(true);
      A.periksa();
    };

    /* ---------- JALANKAN ---------- */
    A.tungguJalan = function (bolehFn) {
      st.jalan = false;
      lab.tombolJalan.disabled = false;
      st.siap = true;
      return A.tunggu(function () {
        if (!st.jalan) return false;
        if (bolehFn && !bolehFn()) { st.jalan = false; return false; }
        return true;
      }).then(function () { st.siap = false; st.jalan = false; lab.tombolJalan.disabled = true; UI.sembunyiTangan(true); });
    };
    /* hari kecil di kubah, lalu fenomena baru diumumkan dan kata barunya digolongkan lewat Kartu Temuan */
    A.jalankan = async function (ms) {
      lab.tombolJalan.disabled = true;
      var aktif = await A.hidup(lab.kubah.jalankan(ms));
      for (var i = 0; i < aktif.length; i++) {
        if (Save.temukanFenomena(aktif[i])) await A.hidup(A.umumkan(aktif[i], true));
      }
      return aktif;
    };
    A.umumkan = async function (fid, baru) {
      var f = FENOMENA.daftar.filter(function (x) { return x.id === fid; })[0];
      if (!f) return;
      var src = Seni.srcBenda(f.sprite);
      var pl = U.h('div', 'pelat pengumuman', (src ? '<img alt="" src="' + src + '">' : '') + '<span><small>' + UI.esc(baru ? STR.alur.fenomenaBaruKecil : STR.alur.fenomenaKecil) + '</small><b data-cek="nama fenomena">' + UI.esc(f.nama) + '</b></span>');
      el.appendChild(pl);
      UI.muncul(pl, 360);
      Aud.sfx('gong');
      lab.kumu.sesaat('bersorak', 2.4);
      var t = UI.titik(pl); if (t) UI.ledak(t.x, t.y, 16);
      if (baru) lab.embun(15, pl);
      lab.papan.fenomena(f.kalimat[0]);
      await A.hidup(Voice.say(f.kalimat[0], { tokoh: 'papan', lang: 'en-US' }));
      await A.hidup(A.jeda(900));
      pl.remove();
      for (var i = 0; i < f.benda.length; i++) if (!Save.punyaKata(f.benda[i])) await A.hidup(A.temuan(f.benda[i]));
    };
    A.temuan = function (id) {
      st.siap = true; st.solusi = { jenis: 'temuan', jawab: jenis(id) };
      return Jurnal.temuan(id).then(function (pertama) {
        st.siap = false;
        Save.catat('hitung-takar', pertama);
        if (!pertama) Save.catatSalah('hitung-takar');
        lab.embun(pertama ? 10 : 5, lab.kumu.el);
      });
    };

    /* ---------- penilaian, adaptif, Cek Ulang ---------- */
    A.nilai = function (tags, coba, o2) {
      o2 = o2 || {};
      var pertama = coba <= 1;
      st.total++; if (pertama) st.skor++;
      tags.forEach(function (t) { st.tag[t] = true; Save.catat(t, pertama, !!o2.tanpaLekuk); if (!pertama) Save.catatSalah(t); });
      A.adaptif(pertama);
      if (!pertama && !st.cekUlang && o2.ulang) st.ulang.push(o2.ulang);
      lab.kumu.sesaat('bersorak', 2); Aud.sfx('good');
      return lab.embun(coba <= 1 ? 10 : coba === 2 ? 5 : 2, o2.dari || lab.tombolJalan);
    };
    /* adaptif: 3 tepat beruntun menambah benda permintaan dan membuka "no"; 2 tidak tepat beruntun mengurangi dan menampilkan lekuk */
    A.adaptif = function (pertama) {
      if (pertama) { st.benarB++; st.salahB = 0; } else { st.salahB++; st.benarB = 0; }
      if (st.benarB >= 3) { st.nBenda = Math.min(3, st.nBenda + 1); st.bolehNo = true; st.lekukBantu = false; st.benarB = 0; }
      if (st.salahB >= 2) { st.nBenda = Math.max(1, st.nBenda - 1); st.lekukBantu = true; st.salahB = 0; }
    };
    A.mis = function (kode) { if (!kode) return; Save.catatMis(kode); st.mis[kode] = (st.mis[kode] || 0) + 1; };
    A.tingkat = function (salah) { return A.santai() ? Math.max(2, salah) : salah; };
    A.cekUlang = async function () {
      var daftar = st.ulang.slice(0, 3);
      st.cekUlang = true;
      for (var i = 0; i < daftar.length; i++) { st.langkah = 'cek'; await A.hidup(daftar[i]()); }
      st.cekUlang = false;
    };
    A.selesai = function (tags, o2) {
      st.langkah = 'selesai';
      var rasio = st.total ? st.skor / st.total : 1;
      var bintang = st.petunjuk3 === 0 && rasio >= 0.9 ? 3 : (rasio >= 0.7 ? 2 : 1);
      /* L6: bintang ketiga hanya bonus waktu (Mode Santai tanpa waktu) */
      if (o2 && o2.bonus === false && bintang === 3) bintang = 2;
      Save.catatLevel(nomor, { selesai: true, bintang: bintang, petunjuk3: st.petunjuk3, detik: Math.round((performance.now() - st.mulai) / 1000) });
      var mis = Object.keys(st.mis).filter(function (k) { return STR.latihan[k]; }).sort(function (x, y) { return st.mis[y] - st.mis[x]; })[0];
      Scenes.go('hasil', { level: nomor, bintang: bintang, embunAwal: st.embunAwal, embunAkhir: Save.data.embun, tag: tags, latihan: mis || null });
    };

    /* ---------- tugas: misi fenomena ---------- */
    A.misi = async function (m) {
      st.tugas = 'misi'; st.langkah = 'misi'; st.papanAlat = true;
      A.preset(m.preset || {}, m.malam);
      A.pasangAlat(m.alat);
      lab.labelJalan(STR.alur.jalankan);
      lab.arahan(m.arahan);
      if (m.bayu) await A.hidup(lab.bayu.ucap(m.bayu, 'pikir'));
      st.solusi = { jenis: 'alat', nilai: m.solusi };
      var salah = 0;
      UI.idle.atur(function () {
        var kurang = Object.keys(m.solusi).filter(function (id) { return Tugas.zonaId(id, lab.kubah.nilai[id] || 0) !== Tugas.zonaId(id, m.solusi[id]); })[0];
        return kurang ? A.sasaranAlat(kurang, m.solusi[kurang]) : lab.tombolJalan;
      });
      while (true) {
        await A.hidup(A.tungguJalan());
        var aktif = await A.hidup(A.jalankan(2400));
        if (aktif.indexOf(m.fenomena) >= 0) break;
        salah++;
        var tk = A.tingkat(salah);
        lab.kumu.sesaat('heran', 2); Aud.sfx('bad');
        if (tk === 1) lab.arahan(STR.alur.misiBelum);
        else if (tk === 2) { A.sorotAlat(Object.keys(m.solusi)); lab.arahan(m.petunjuk || STR.alur.sorotPermintaan); }
        else { st.petunjuk3++; A.sorotAlat(null); await A.hidup(A.peraga(m.solusi)); lab.arahan(STR.alur.tunjukPermintaan); }
      }
      UI.idle.atur(null); A.sorotAlat(null);
      await A.hidup(A.nilai([], salah + 1));
      await A.hidup(A.jeda(500));
    };
    /* tangan memperagakan pengaturan alat sampai nilainya tepat */
    A.peraga = async function (nilai) {
      var ids = Object.keys(nilai);
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i], s = A.sasaranAlat(id, nilai[id]);
        if (s) UI.tunjuk(s[0], s[1]);
        await A.hidup(A.jeda(500));
        A.aturAlat(id, nilai[id]);
        Aud.sfx(jenis(id) === 'hitung' ? 'awan' : 'alir', 3);
        await A.hidup(A.jeda(400));
      }
      UI.tunjuk(lab.tombolJalan);
    };

    /* ---------- tugas: permintaan (warga atau Kak Bayu) ----------
       r: { warga, teks, target, cek(nilai) -> [salah] (opsional) }; t: { alat, dengar (sembunyikan teks), preset, malam } */
    A.minta = async function (r, t) {
      t = t || {};
      st.tugas = 'minta'; st.langkah = st.cekUlang ? 'cek' : 'minta'; st.papanAlat = true;
      A.preset(t.preset || {}, t.malam);
      var panel = t.alat || Object.keys(r.target);
      A.pasangAlat(panel);
      lab.labelJalan(STR.alur.jalankan);
      lab.arahan(STR.alur.atur, false);
      var nilaiBenar = {};
      panel.forEach(function (id) { nilaiBenar[id] = r.target[id] ? (r.wakil && r.wakil[id] != null ? r.wakil[id] : Tugas.wakil(id, r.target[id])) : 0; });
      st.solusi = { jenis: 'alat', nilai: nilaiBenar };
      function ucap(rate) { return r.warga === 'bayu' ? lab.bayu.ucap(r.teks, 'senyum', rate) : lab.bayu.warga(r.warga, r.teks, { sembunyi: !!t.dengar && !st.bukaTeks, rate: rate }); }
      st.bukaTeks = false;
      await A.hidup(ucap());
      function cek() { return r.cek ? r.cek(lab.kubah.nilai) : Tugas.cekPermintaan(r.target, lab.kubah.nilai, panel); }
      /* pesan salah pertama: tidak diminta, terlalu banyak, atau terlalu sedikit */
      function arahSalah(e) {
        if (e.harus === 'no' && !r.target[e.id]) return STR.alur.salahLebih;
        var v = lab.kubah.nilai[e.id] || 0, Z = jenis(e.id) === 'hitung' ? KUANTITAS.hitung : KUANTITAS.takar;
        var z = e.harus === 'some' ? { min: 2, maks: 12 } : Z.filter(function (x) { return x.id === e.harus; })[0];
        if (!z) return STR.alur.salahZona;
        return v > z.maks ? STR.alur.salahBanyak : v < z.min ? STR.alur.salahSedikit : STR.alur.salahZona;
      }
      UI.idle.atur(function () { var c = cek(); return c.length ? A.sasaranAlat(c[0].id, nilaiBenar[c[0].id]) : lab.tombolJalan; });
      var salah = 0;
      while (true) {
        await A.hidup(A.tungguJalan());
        var s = cek();
        await A.hidup(A.jalankan(1300));
        if (!s.length) break;
        salah++;
        var tk = A.tingkat(salah), e = s[0];
        A.mis(e.harus === 'no' ? 'lebih' : 'zona');
        lab.kumu.sesaat('heran', 2); Aud.sfx('bad'); UI.goyang(A.alat[e.id] && A.alat[e.id].el);
        if (t.dengar && !st.bukaTeks) { st.bukaTeks = true; lab.bayu.buka(); }
        if (tk === 1) {
          lab.arahan(U.fmt(arahSalah(e), { kata: '*' + kata(e.id) + '*' }), false);
          await A.hidup(A.jeda(300)); await A.hidup(ucap());
        } else if (tk === 2) { A.sorotAlat(s.map(function (x) { return x.id; })); lab.arahan(STR.alur.sorotPermintaan); }
        else { st.petunjuk3++; A.sorotAlat(null); lab.arahan(STR.alur.tunjukPermintaan); await A.hidup(A.peraga(nilaiBenar)); }
      }
      UI.idle.atur(null); A.sorotAlat(null);
      UI.lompat(lab.bayu.foto);
      var nama = r.warga === 'bayu' ? STR.bayuNama : PERMINTAAN.warga[r.warga].nama;
      lab.arahan(U.fmt(STR.alur.benarPermintaan, { nama: nama }), false);
      var tags = ['simak-takaran'];
      Object.keys(r.target).forEach(function (id) { var g = TAG_ZONA[r.target[id]]; if (g && tags.indexOf(g) < 0) tags.push(g); });
      await A.hidup(A.nilai(tags, salah + 1, { dari: lab.bayu.foto, ulang: r.ulang }));
      if (r.warga !== 'bayu') await A.hidup(lab.bayu.warga(r.warga, STR.bayu2.terima));
      await A.hidup(Voice.selesai()); await A.hidup(A.jeda(400));
    };

    /* ---------- Kartu Kata: rel di papan + rak di panel ---------- */
    A.soal = function (kerangka, kartu, opsi) {
      opsi = opsi || {};
      A.hapusAlat();
      lab.judulPanel(STR.alur.kartu);
      A.rak.style.display = '';
      var s = Kartu.Soal({ rel: lab.papan.relEl, rak: A.rak, kerangka: kerangka, kartu: kartu, lekuk: opsi.lekuk, pakaiUlang: opsi.pakaiUlang,
        boleh: opsi.boleh, onUbah: function () { A.periksa(); if (opsi.onUbah) opsi.onUbah(); },
        onTolak: function (k, nw) { var x = alasanTolak(k, nw); lab.kumu.sesaat('heran', 1.6); lab.arahan(x[0], false); A.mis(x[1]); if (opsi.onTolak) opsi.onTolak(k); } });
      lab.papan.rel(function () { return s.teks(); });
      A.soalAktif = s;
      lab.tombolCerah.disabled = true;
      return s;
    };
    A.tutupSoal = function (s) { if (s) s.hapus(); lab.papan.rel(null); A.rak.style.display = 'none'; A.soalAktif = null; lab.tombolCerah.disabled = false; };

    /* ---------- tugas: Tebak Dulu ----------
       g: { id, n (nilai sasaran), alat, preset, kartu, arahan } */
    A.tebak = async function (g) {
      st.tugas = 'tebak'; st.langkah = 'tebak-atur'; st.papanAlat = false;
      A.preset(g.preset || {});
      A.pasangAlat(g.alat);
      lab.labelJalan(STR.alur.jalankan);
      var kerangka = ['There', { slot: 'kerja' }, { slot: 'kuant' }, Tugas.bentukBenda(g.id, g.n) + '.'];
      /* rel kosong tampil sejak awal; kartu baru muncul setelah alat diatur */
      lab.papan.rel(function () { return ''; });
      var tmp = Kartu.Soal({ rel: lab.papan.relEl, rak: A.rak, kerangka: kerangka, kartu: [], lekuk: true });
      tmp.kunci = true;
      lab.arahan(g.arahan, false);
      lab.bayu.ucap(STR.bayu2.tebak, 'pikir');
      st.solusi = { jenis: 'tebak-alat', nilai: (function () { var x = {}; x[g.id] = g.n; return x; })() };
      var zonaSasaran = Tugas.zonaId(g.id, g.n);
      UI.idle.atur(function () { return A.sasaranAlat(g.id, g.n); });
      var a0 = A.sasaranAlat(g.id, g.n); if (a0 && !st.cekUlang && nomor === 2 && !Save.selesai(nomor)) UI.tunjuk(a0[0], a0[1]);
      st.siap = true;
      await A.hidup(A.tunggu(function () { var v = lab.kubah.nilai[g.id]; return jenis(g.id) === 'hitung' ? v === g.n : Tugas.zonaId(g.id, v) === zonaSasaran; }));
      st.siap = false;
      UI.sembunyiTangan(true); UI.idle.atur(null);
      var nyata = lab.kubah.nilai[g.id];
      await A.hidup(A.jeda(500));
      tmp.hapus();
      st.langkah = 'tebak';
      var kartu = Tugas.acak(A.rnd, g.kartu);
      var s = A.soal(['There', { slot: 'kerja' }, { slot: 'kuant' }, Tugas.bentukBenda(g.id, nyata) + '.'], kartu, { lekuk: true });
      var dunia = lab.kubah.dunia();
      var kunci = cariKunci(['There', { slot: 'kerja' }, { slot: 'kuant' }, Tugas.bentukBenda(g.id, nyata) + '.'], kartu, dunia);
      st.solusi = { jenis: 'kartu', kartu: kunci };
      lab.arahan(STR.alur.tebak);
      UI.idle.atur(function () { return s.lengkap() ? lab.tombolJalan : (kunci ? s.kartuRak[kunci[0]] : null); });
      await A.hidup(A.tungguJalan(function () { if (!s.lengkap()) { lab.arahan(STR.alur.isiDulu); Aud.sfx('bad'); } return s.lengkap(); }));
      UI.idle.atur(null);
      s.kunci = true;
      await A.hidup(A.jalankan(1600));
      var r = Tugas.nilai(s.teks(), lab.kubah.dunia());
      var tags = ['there-is-are']; var gz = TAG_ZONA[Tugas.zonaId(g.id, nyata)]; if (gz) tags.push(gz);
      if (r.benar) {
        s.tanda(true);
        lab.arahan(STR.alur.tebakBenar, false);
        st.total++; st.skor++; A.adaptif(true);
        tags.forEach(function (t) { st.tag[t] = true; Save.catat(t, true, false); });
        lab.kumu.sesaat('bersorak', 2); Aud.sfx('good');
        lab.embun(3, lab.papan.el);
        await A.hidup(lab.papan.ucap());
      } else {
        s.tanda(false);
        A.mis(r.tataBahasa && r.tataBahasa.length ? kodeMis(r.tataBahasa[0]) : 'tebak');
        st.total++; A.adaptif(false);
        tags.forEach(function (t) { st.tag[t] = true; Save.catat(t, false, false); });
        lab.kumu.sesaat('heran', 2); Aud.sfx('bad');
        await A.hidup(A.jeda(700));
        A.tutupSoal(s); s = null;
        st.papanAlat = true;
        lab.papan.tampil(g.id, nyata, true);
        lab.arahan(r.tataBahasa && r.tataBahasa.length ? pesanTB(r.tataBahasa[0]) : U.fmt(jenis(g.id) === 'hitung' ? STR.alur.tebakSalahHitung : STR.alur.tebakSalahTakar, { n: nyata, kata: Tugas.bentukBenda(g.id, nyata) }), false);
        await A.hidup(lab.papan.ucap());
      }
      await A.hidup(Voice.selesai()); await A.hidup(A.jeda(700));
      A.tutupSoal(s);
      st.papanAlat = true;
    };

    /* pita zona di atas kubah: jumlah atau takaran sekarang dan zona yang cocok (petunjuk tingkat 2, GDD bagian 10) */
    A.bantuZona = function (id, n) {
      A.tutupBantu();
      var b = benda(id), h = b.jenis === 'hitung', Z = h ? KUANTITAS.hitung : KUANTITAS.takar, aktif = Kuantitas.zona(id, n).i, B = STR.alur.bantu;
      var p = U.h('div', 'pelat bantu-zona');
      p.innerHTML = '<b data-cek="bantu zona">' + UI.esc(U.fmt(h ? B.hitung : B.takar, { kata: b.jamak || b.kata, n: n })) + '</b><div class="pita-bantu">' +
        Z.map(function (z, i) {
          var rentang = z.min === z.maks ? z.min : z.min + '-' + z.maks, kt = z.abu ? (h ? B.angka : z.kata) : (z.id === 'satu' ? B.satu : z.kata);
          return '<span class="' + (i === aktif ? 'on' : '') + '"><i>' + rentang + '</i><em>' + UI.esc(kt) + '</em></span>';
        }).join('') + '</div>';
      el.appendChild(p); A.bantuEl = p;
      UI.muncul(p, 260);
    };
    A.tutupBantu = function () { if (A.bantuEl && A.bantuEl.parentNode) A.bantuEl.parentNode.removeChild(A.bantuEl); A.bantuEl = null; };

    /* ---------- tugas: pertanyaan dijawab dengan kartu ----------
       q: hasil Tugas.pertanyaan; t: { preset, malam, dunia() (dunia khusus, misalnya Lensa), lensa (wajib menyalakan Lensa),
          senter: {x, y, r} zona di kubah (lokal), lekuk (bool), serupa() -> tugas pengganti untuk Cek Ulang } */
    A.tanya = async function (q, t) {
      t = t || {};
      st.tugas = 'tanya'; st.langkah = st.cekUlang ? 'cek' : 'tanya'; st.papanAlat = false;
      if (t.preset) A.preset(t.preset, t.malam);
      if (t.senter) { st.ketemu = false; }
      var lekuk = t.lekuk != null ? t.lekuk : true;
      if (st.lekukBantu || A.santai()) lekuk = true;
      var lekukAwal = lekuk;
      var kartu = Tugas.acak(A.rnd, q.kartu);
      function dunia() { return t.dunia ? t.dunia() : lab.kubah.dunia(); }
      function boleh() {
        if (t.lensa && !lab.kubah.lensa.on) { lab.arahan(STR.alur.lensa, false); UI.tunjuk(lab.tombolLensa); Aud.sfx('gembok'); return false; }
        if (t.senter && !st.ketemu) { lab.arahan(STR.alur.senterBelum, false); UI.tunjuk({ x: Lab.KUBAH.x0 + t.senter.x, y: Lab.KUBAH.y0 + t.senter.y }); Aud.sfx('gembok'); return false; }
        return true;
      }
      var s = A.soal(q.kerangka, kartu, { lekuk: lekuk, boleh: boleh });
      lab.labelJalan(STR.alur.kirim);
      var kunci = null;
      A.onSenter = t.senter ? function () {
        var S = lab.kubah.senter;
        if (!st.ketemu && Math.hypot(S.x - t.senter.x, S.y - t.senter.y) < (t.senter.r || 70)) {
          st.ketemu = true; Aud.sfx('lensa'); lab.kumu.sesaat('bersorak', 1.2);
          lab.arahan(STR.alur.senterKetemu, false); UI.sembunyiTangan(true);
        }
      } : null;
      st.solusi = { jenis: 'kartu', kartu: null, lensa: !!t.lensa, senter: t.senter ? { x: Lab.KUBAH.x0 + t.senter.x, y: Lab.KUBAH.y0 + t.senter.y } : null };
      lab.arahan(t.senter ? STR.alur.senter : t.lensa ? STR.alur.lensa : STR.alur.jawab, false);
      /* penanya: Kak Bayu (bawaan) atau warga yang menelepon (L6) */
      function ucapTanya() { return t.penanya ? lab.bayu.warga(t.penanya, q.tanya) : lab.bayu.ucap(q.tanya, 'pikir'); }
      await A.hidup(ucapTanya());
      if (t.onMulai) t.onMulai();
      kunci = cariKunci(q.kerangka, kartu, dunia(), null, q.cocokJawab);
      st.solusi.kartu = kunci;
      /* pengaman jalan buntu: soal tanpa jawaban dari kartunya dilewati (di mode uji dilaporkan sebagai error) */
      if (!kunci) {
        if (U.TEST) console.error('Kunci tidak ditemukan: ' + q.tanya);
        A.onSenter = null; A.tutupSoal(s); st.papanAlat = true;
        return;
      }
      UI.idle.atur(function () {
        if (t.lensa && !lab.kubah.lensa.on) return lab.tombolLensa;
        if (t.senter && !st.ketemu) return { x: Lab.KUBAH.x0 + t.senter.x, y: Lab.KUBAH.y0 + t.senter.y };
        if (s.lengkap()) return lab.tombolJalan;
        var k = kunci && kunci.filter(function (x) { return !Object.keys(s.isi).some(function (n) { return s.isi[n] === x; }); })[0];
        return k ? s.kartuRak[k] : null;
      });
      var salah = 0;
      while (true) {
        await A.hidup(A.tungguJalan(function () { if (!s.lengkap()) { lab.arahan(STR.alur.isiDulu, false); Aud.sfx('bad'); } return s.lengkap(); }));
        var r = Tugas.nilai(s.teks(), dunia());
        if (r.benar && q.cocokJawab && !q.cocokJawab(r)) { r.benar = false; r.tataBahasa = ['jawab-tanya']; }
        if (r.benar) break;
        salah++;
        var tk = A.tingkat(salah);
        s.tanda(false);
        var tb = r.tataBahasa && r.tataBahasa.length;
        A.mis(tb ? kodeMis(r.tataBahasa[0]) : kodeMakna(r, dunia(), q.id));
        lab.kumu.sesaat('heran', 2); Aud.sfx('bad'); UI.goyang(lab.papan.el);
        if (!lekuk) { lekuk = true; s.lekuk(true); }
        if (tk === 1) {
          lab.arahan(tb ? pesanTB(r.tataBahasa[0]) : pesanMakna(r, dunia(), q.id), false);
          await A.hidup(A.jeda(300)); await A.hidup(ucapTanya());
        } else if (tk === 2) {
          if (tb) lab.arahan(pesanTB(r.tataBahasa[0]), false);
          else { A.bantuZona(q.id, dunia()[q.id] || 0); lab.arahan(STR.alur.sorotZona, false); }
        }
        else {
          st.petunjuk3++;
          s.sorot(kunci); await A.hidup(A.jeda(500)); s.sorot(null); s.kosongkan();
          lab.arahan(STR.alur.tunjukKartu, false);
          for (var i = 0; kunci && i < kunci.length; i++) { UI.tunjuk(s.kartuRak[kunci[i]]); await A.hidup(A.jeda(650)); s.taruh(kunci[i]); }
          UI.sembunyiTangan(true);
          await A.hidup(lab.papan.ucap());
          break;
        }
        s.tanda(null);
      }
      if (t.onBenar) t.onBenar(salah);
      UI.idle.atur(null); A.onSenter = null; A.tutupBantu();
      s.kunci = true; s.sorot(null); s.tanda(true);
      if (salah < 3) { lab.arahan(STR.alur.benarKartu, false); await A.hidup(lab.papan.ucap()); }
      var tags = q.jenis === 'ada' ? ['some-any', 'there-is-are'] : ['many-much', 'there-is-are'];
      var gz = TAG_ZONA[Tugas.zonaId(q.id, q.n)]; if (gz && q.jenis !== 'ada' && tags.indexOf(gz) < 0) tags.push(gz);
      await A.hidup(A.nilai(tags, salah + 1, { dari: lab.papan.el, tanpaLekuk: !lekukAwal, ulang: t.serupa }));
      await A.hidup(Voice.selesai()); await A.hidup(A.jeda(600));
      A.tutupSoal(s);
      st.papanAlat = true;
    };

    A.selesaiTugas = function () { st.solusi = null; };
    A.uji = {
      keadaan: function () {
        return { langkah: st.langkah, tugas: st.tugas, siap: st.siap, skor: st.skor, total: st.total, solusi: st.solusi,
          kubah: JSON.parse(JSON.stringify(lab.kubah.nilai)), lensa: lab.kubah.lensa.on, papan: lab.papan.teks(), fenomena: Object.keys(lab.kubah.fenomena) };
      },
      kubah: function () { return lab.kubah; },
      solusi: function () { return st.solusi; },
      /* kait cepat untuk skrip tangkapan layar (bot memakai input sungguhan) */
      atur: function (n) { Object.keys(n).forEach(function (id) { if (A.alat[id]) A.aturAlat(id, n[id]); }); },
      kartu: function (daftar) { (daftar || []).forEach(function (k) { if (A.soalAktif) A.soalAktif.taruh(k); }); },
      jalan: function () { if (!lab.tombolJalan.disabled) { st.jalan = true; A.periksa(); } },
      cuaca: function (x) { Object.keys(x).forEach(function (k) { if (k === 'lensa') { lab.kubah.lensa.on = !!x.lensa; lab.kubah.lensa.x = 200; lab.kubah.lensa.y = 220; } else if (k === 'malam') lab.kubah.aturMalam(x.malam); else lab.kubah.atur(k, x[k]); }); }
    };
    A.jalan = function (fn) { fn().catch(function (e) { if (e !== BATAL) console.error(e); }); };
    return A;
  }

  root.Alur = {
    mulai: mulai,
    cariKunci: cariKunci,
    pesanTB: pesanTB,
    pesanMakna: pesanMakna,
    kodeMakna: kodeMakna,
    kodeMis: kodeMis,
    update: function (dt) { if (cur && cur.lab) cur.lab.update(dt); },
    akhiri: function () { sesi++; UI.idle.atur(null); UI.sembunyiTangan(true); if (cur && cur.lab) cur.lab.lepas(); cur = null; }
  };
})(window);
