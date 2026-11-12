/* Tugas: generator permintaan warga, pemaduan Festival L5, generator pertanyaan, penilai permintaan, dan pemeriksa kebenaran
   (brief bagian 5 dan 7; GDD bagian 7.3 dan 11). Berjalan di peramban dan di Node (uji logika).
   Pemeriksa kebenaran menerima semua kalimat yang benar tata bahasanya dan sesuai isi kubah, bukan hanya satu kunci jawaban. */
(function (root) {
  var K = root.KUANTITAS, P = root.PERMINTAAN, Q = root.Kuantitas;
  var WAKIL = { hitung: { no: 0, satu: 1, few: 3, abu: 6, lot: 10 }, takar: { no: 0, little: 20, some: 50, lot: 80 } };
  function pick(rnd, a) { return a[Math.floor(rnd() * a.length)]; }
  function acak(rnd, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function jenis(id) { return Q.benda(id).jenis; }
  function wakil(id, z) { return WAKIL[jenis(id)][z]; }
  function zonaId(id, v) { return Q.zona(id, v).z.id; }
  function butuhAwan(id) { return !!Q.benda(id).butuhAwan; }

  /* frasa kuantitas untuk permintaan: a few clouds, an umbrella, a lot of sunshine, no rain */
  function frasa(id, z) {
    var b = Q.benda(id);
    if (b.jenis === 'hitung') return z === 'satu' ? b.artikel + ' ' + b.tunggal : ({ few: 'a few ', lot: 'a lot of ', no: 'no ' })[z] + b.jamak;
    return ({ little: 'a little ', lot: 'a lot of ', no: 'no ' })[z] + b.kata;
  }
  function gabung(a) { return a.length === 1 ? a[0] : a.length === 2 ? a[0] + ' and ' + a[1] : a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1]; }
  /* yang diminta ada lebih dulu, "no ..." di akhir; "make" dan "add" tidak dipakai untuk "no ..." */
  function teksPermintaan(rnd, target) {
    var ids = Object.keys(target).sort(function (a, b) { return (target[a] === 'no') - (target[b] === 'no'); });
    var adaNo = ids.some(function (id) { return target[id] === 'no'; }), semuaNo = ids.every(function (id) { return target[id] === 'no'; });
    /* semua "tidak": We don't need any rain, please. (mencontohkan any dalam kalimat negatif) */
    if (semuaNo) {
      var daftar = ids.map(function (id) { var b = Q.benda(id); return b.jenis === 'hitung' ? b.jamak : b.kata; });
      return "We don't need any " + (daftar.length === 1 ? daftar[0] : daftar.slice(0, -1).join(', ') + ' or ' + daftar[daftar.length - 1]) + ', please.';
    }
    var d = gabung(ids.map(function (id) { return frasa(id, target[id]); }));
    /* "make water/sand" janggal dalam bahasa Inggris: untuk air dan pasir tidak memakai pola "make" */
    var bolehMake = !ids.some(function (id) { return id === 'water' || id === 'sand'; });
    var daftarPola = adaNo ? [P.pola[3]] : P.pola.filter(function (p) { return bolehMake || p.indexOf('make') < 0; });
    var pola = pick(rnd, daftarPola);
    return pola.replace('{daftar}', d).replace('{Daftar}', d.charAt(0).toUpperCase() + d.slice(1));
  }
  /* hujan dan salju butuh awan: tambahkan awan bila belum diminta; tolak bila awan diminta "no" */
  function lengkapiAwan(rnd, target, w) {
    var perlu = Object.keys(target).some(function (id) { return butuhAwan(id) && target[id] !== 'no'; });
    if (!perlu) return true;
    if (target.clouds === 'no') return false;
    if (!target.clouds) {
      var boleh = (P.warga[w].boleh.clouds || []).filter(function (z) { return z !== 'no'; });
      target.clouds = boleh.length ? pick(rnd, boleh) : 'few';
    }
    return true;
  }

  /* o: alat (yang boleh di level), n (jumlah benda 1-3), bolehNo, warga (opsional) */
  function permintaan(rnd, o) {
    for (var coba = 0; coba < 200; coba++) {
      var calon = Object.keys(P.warga).filter(function (w) { return !o.warga || w === o.warga; });
      var w = pick(rnd, calon), boleh = P.warga[w].boleh;
      var alat = Object.keys(boleh).filter(function (id) {
        return o.alat.indexOf(id) >= 0 && boleh[id].some(function (z) { return z !== 'no' || o.bolehNo; });
      });
      if (!alat.length) continue;
      var n = Math.min(o.n || 1, alat.length), target = {};
      acak(rnd, alat).slice(0, n).forEach(function (id) {
        var z = boleh[id].filter(function (x) { return x !== 'no' || o.bolehNo; });
        target[id] = pick(rnd, z);
      });
      if (!lengkapiAwan(rnd, target, w)) continue;
      if (Object.keys(target).some(function (id) { return o.alat.indexOf(id) < 0; })) continue;
      if (Object.keys(target).every(function (id) { return target[id] === 'no'; }) && Object.keys(target).length > 1) continue;
      return { warga: w, teks: teksPermintaan(rnd, target), target: target };
    }
    throw new Error('permintaan tidak bisa dibuat');
  }

  /* penilai permintaan: alat yang diminta harus di zona yang benar, alat lain di panel harus 0 (brief keputusan 12) */
  function cekPermintaan(target, nilai, alatPanel) {
    var salah = [];
    alatPanel.forEach(function (id) {
      var harus = target[id] || 'no', ada = zonaId(id, nilai[id] || 0);
      if (ada !== harus) salah.push({ id: id, harus: harus, ada: ada });
    });
    return salah;
  }

  /* Festival L5: tiga warga, permintaan saling cocok, paling banyak 2 Tombol Hitung dan 3 Tuas Takar */
  function pemaduan(rnd) {
    var F = P.festival;
    for (var coba = 0; coba < 500; coba++) {
      var wargaDipilih = acak(rnd, Object.keys(P.warga)).slice(0, 3), target = {}, kartu = [], gagal = false;
      wargaDipilih.forEach(function (w) {
        if (gagal) return;
        var boleh = P.warga[w].boleh, t = {}, ids = acak(rnd, Object.keys(boleh)).slice(0, rnd() < 0.5 ? 1 : 2);
        ids.forEach(function (id) { t[id] = pick(rnd, boleh[id]); });
        /* kartu festival paling banyak dua benda supaya teksnya muat 3 baris */
        if (!lengkapiAwan(rnd, t, w) || Object.keys(t).length > 2) { gagal = true; return; }
        Object.keys(t).forEach(function (id) { if (target[id] && target[id] !== t[id]) gagal = true; target[id] = t[id]; });
        kartu.push({ warga: w, target: t });
      });
      if (gagal) continue;
      var alat = Object.keys(target), nh = alat.filter(function (id) { return jenis(id) === 'hitung'; }).length;
      if (nh > F.maksHitung || alat.length - nh > F.maksTakar) continue;
      if (Object.keys(target).some(function (id) { return butuhAwan(id) && target[id] !== 'no'; }) && target.clouds === 'no') continue;
      if (alat.every(function (id) { return target[id] === 'no'; })) continue;
      kartu.forEach(function (k) { k.teks = teksPermintaan(rnd, k.target); });
      return { kartu: kartu, target: target, alat: alat };
    }
    throw new Error('pemaduan tidak bisa dibuat');
  }

  /* ---------- pertanyaan dengan kartu kata ---------- */
  function bentukBenda(id, n) { var b = Q.benda(id); return b.jenis === 'hitung' ? (n === 1 ? b.tunggal : b.jamak) : b.kata; }
  /* jenis: banyak (How many/much), tidak (Are there many / Is there much -> jawaban "No, ..."), ada (Are there any / Is there any) */
  function pertanyaan(j, id, n) {
    var b = Q.benda(id), h = b.jenis === 'hitung', kata = h ? b.jamak : b.kata, q;
    if (j === 'banyak') q = { tanya: h ? 'How many ' + kata + ' are there?' : 'How much ' + kata + ' is there?',
      kerangka: ['There', { slot: 'kerja' }, { slot: 'kuant' }, bentukBenda(id, n) + '.'],
      kartu: h ? (n === 1 ? ['is', 'are', b.artikel, 'a few', 'a little', 'many'] : ['is', 'are', 'a few', 'a little', 'many', 'much', 'a lot of']) : ['is', 'are', 'a little', 'a few', 'much', 'many', 'a lot of'] };
    /* Are there many...? / Is there much...? : jawabannya bisa Yes (banyak) atau No (sedikit) */
    else if (j === 'tidak') q = { tanya: h ? 'Are there many ' + kata + '?' : 'Is there much ' + kata + '?',
      kerangka: [{ slot: 'yn' }, 'there', { slot: 'kerja' }, { slot: 'kuant' }, kata + '.'],
      kartu: h ? ['Yes,', 'No,', 'are', "aren't", 'many', 'a few', 'a lot of'] : ['Yes,', 'No,', 'is', "isn't", 'much', 'a little', 'a lot of'],
      /* "Yes, there are a few kites." benar isinya tetapi tidak menjawab "Are there many kites?" */
      cocokJawab: function (r) { return r.yn === 'yes' ? ['many', 'much', 'a lot of'].indexOf(r.kuant) >= 0 : r.yn === 'no'; } };
    else q = { tanya: h ? 'Are there any ' + kata + '?' : 'Is there any ' + kata + '?',
      kerangka: [{ slot: 'yn' }, 'there', { slot: 'kerja' }, { slot: 'kuant' }, kata + '.'],
      kartu: ['Yes,', 'No,', h ? 'are' : 'is', h ? "aren't" : "isn't", h ? 'is' : 'are', 'some', 'any', 'no'] };
    /* jumlah nol: "There are no clouds." / "There is no rain." */
    if (j === 'banyak' && n === 0) q.kartu = q.kartu.filter(function (k) { return k !== 'much' && k !== 'many'; }).concat(['no']);
    q.jenis = j; q.id = id; q.n = n;
    return q;
  }

  /* pertanyaan How many dengan kartu kata benda: melatih jamak tidak beraturan (fish/fishes, leaves/leafs) */
  var SALAH_JAMAK = { fish: 'fishes', leaves: 'leafs' };
  function pertanyaanBenda(id, n) {
    var b = Q.benda(id), q = pertanyaan('banyak', id, n);
    q.kerangka = ['There', { slot: 'kerja' }, { slot: 'kuant' }, { slot: 'benda' }, '.'];
    q.kartu = ['is', 'are', 'a few', 'a little', 'a lot of', b.jamak, SALAH_JAMAK[id] || b.tunggal];
    return q;
  }

  /* ---------- lekuk kartu: bentuk tonjolan di bawah kartu dan alur kata benda ---------- */
  var LEKUK = { 'a': ['satu'], 'an': ['satu'], 'one': ['satu'], 'a few': ['dua'], 'many': ['dua'], 'a little': ['gel'], 'much': ['gel'],
    'some': ['dua', 'gel'], 'any': ['dua', 'gel'], 'no': ['dua', 'gel'], 'a lot of': ['dua', 'gel'], 'is': ['satu', 'gel'], "isn't": ['satu', 'gel'], 'are': ['dua'], "aren't": ['dua'] };
  function lekuk(kata) { return LEKUK[kata] || null; }
  function namaLekuk(kata) { var l = lekuk(kata); if (!l) return null; return l.length === 2 ? (l[0] === 'satu' ? 'is' : 'serba') : l[0]; }
  function alur(kataBenda) {
    var w = kataBenda.replace(/[.?]/g, '').toLowerCase(), hasil = null;
    /* fish: tunggal dan jamak sama, lekuk tidak bisa membedakan */
    if (root.BENDA.daftar.some(function (b) { return b.jenis === 'hitung' && b.tunggal === w && b.jamak === w; })) return null;
    root.BENDA.daftar.forEach(function (b) {
      if (b.jenis === 'takar' && b.kata === w) hasil = 'gel';
      else if (b.jenis === 'hitung' && b.jamak === w) hasil = hasil || 'dua';
      else if (b.jenis === 'hitung' && b.tunggal === w) hasil = hasil || 'satu';
    });
    return hasil;
  }
  function cocok(kata, kataBenda) { var l = lekuk(kata), a = alur(kataBenda); return !l || !a || l.indexOf(a) >= 0; }

  /* ---------- pemeriksa kebenaran (brief bagian 5) ---------- */
  var KUANT = ['a lot of', 'a few', 'a little', 'many', 'much', 'some', 'any', 'no', 'an', 'a', 'one'].concat(K.angka.slice(2));
  function cariBenda(w) {
    w = w.toLowerCase();
    return root.BENDA.daftar.filter(function (b) { return b.kata === w || b.jamak === w || b.tunggal === w; })[0] || null;
  }
  /* kalimat: teks utuh. dunia: { id: jumlah atau takaran }. Hasil: { tataBahasa: [kode], benar: bool, n, benda } */
  function nilai(kalimat, dunia) {
    var tb = Q.periksa(kalimat), s = kalimat.replace(/[.?!]/g, '').replace(/\s+/g, ' ').trim(), yn = null, m;
    m = /^(Yes|No),\s*/i.exec(s);
    if (m) { yn = m[1].toLowerCase(); s = s.slice(m[0].length); }
    m = /^there (is|are|isn't|aren't) (.+)$/i.exec(s);
    if (!m) return { tataBahasa: tb.concat(['pola']), benar: false };
    var kerja = m[1].toLowerCase(), sisa = m[2], kuant = null;
    for (var i = 0; i < KUANT.length; i++) if (sisa.toLowerCase().indexOf(KUANT[i] + ' ') === 0) { kuant = KUANT[i]; break; }
    if (!kuant) return { tataBahasa: tb.concat(['tanpa-kuantitas']), benar: false };
    var kataBenda = sisa.slice(kuant.length + 1).trim(), b = cariBenda(kataBenda);
    if (!b) return { tataBahasa: tb.concat(['benda']), benar: false };
    var n = dunia[b.id] || 0, h = b.jenis === 'hitung', neg = /n't$/.test(kerja), benar;
    if (!neg) {
      if (kuant === 'a' || kuant === 'an' || kuant === 'one') benar = h && n === 1;
      else if (kuant === 'a few') benar = h && n >= 2 && n <= 4;
      else if (kuant === 'many') benar = h && n >= 8;
      else if (kuant === 'a lot of') benar = h ? n >= 8 : n >= 70;
      else if (kuant === 'some') benar = h ? n >= 2 : n > 0;
      else if (kuant === 'a little') benar = !h && n >= 10 && n <= 30;
      else if (kuant === 'no') benar = n === 0;
      else if (K.angka.indexOf(kuant) >= 0) benar = h && n === K.angka.indexOf(kuant);
      else benar = false;
    } else {
      if (kuant === 'many') benar = h && n >= 1 && n <= 4;
      else if (kuant === 'much') benar = !h && n >= 10 && n <= 30;
      else if (kuant === 'any') benar = n === 0;
      else benar = false;
    }
    if (yn === 'yes') benar = benar && !neg && kuant !== 'no';
    if (yn === 'no') benar = benar && (neg || kuant === 'no');
    return { tataBahasa: tb, benar: benar && !tb.length, n: n, benda: b.id, kuant: kuant, kerja: kerja, yn: yn };
  }

  var Tugas = { WAKIL: WAKIL, wakil: wakil, zonaId: zonaId, frasa: frasa, permintaan: permintaan, cekPermintaan: cekPermintaan, pemaduan: pemaduan,
    pertanyaan: pertanyaan, pertanyaanBenda: pertanyaanBenda, bentukBenda: bentukBenda, lekuk: lekuk, namaLekuk: namaLekuk, alur: alur, cocok: cocok, nilai: nilai, acak: acak, pick: pick, teksPermintaan: teksPermintaan };
  root.Tugas = Tugas;
  if (typeof module !== 'undefined') module.exports = Tugas;
})(typeof window !== 'undefined' ? window : globalThis);
