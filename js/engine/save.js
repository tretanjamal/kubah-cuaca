/* Save: progres di localStorage (try/catch); tetap jalan bila penyimpanan diblokir. Tanpa data pribadi.
   Pola dari Kafe Cilik: data dibersihkan saat dimuat supaya simpanan lama atau rusak tidak membuat gim macet. */
(function (root) {
  var KEY = 'kubahCuaca.v1';
  var memory = null;
  var SETEL = { senyap: false, musik: true, efek: true, cuaca: true, suara: true, bacakan: true, santai: false, kurangi: false };
  function fresh() {
    var s = {}, k;
    for (k in SETEL) s[k] = SETEL[k];
    return {
      settings: s,
      hook: false,        // hook 10 detik sudah dimainkan
      embun: 0,           // Butir Embun
      level: {},          // nomor -> { selesai, bintang, petunjuk3, detik }
      keterampilan: {},   // tag -> { kesempatan, benarAwal, salah, tanpaLekuk }
      miskonsepsi: {},    // kode -> jumlah muncul
      fenomena: [],       // id fenomena yang sudah ditemukan
      kata: [],           // kata benda yang sudah masuk Jurnal (Kartu Temuan)
      detik: 0            // lama bermain total
    };
  }
  function isObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function angka(v) { return typeof v === 'number' && isFinite(v) && v >= 0; }
  function clean(d) {
    var f = fresh(), k;
    if (!isObj(d)) return f;
    if (!isObj(d.settings)) d.settings = f.settings;
    for (k in f.settings) if (typeof d.settings[k] !== 'boolean') d.settings[k] = f.settings[k];
    for (k in d.settings) if (!(k in f.settings)) delete d.settings[k];
    if (typeof d.hook !== 'boolean') d.hook = false;
    ['embun', 'detik'].forEach(function (n) { if (!angka(d[n])) d[n] = 0; });
    ['level', 'keterampilan', 'miskonsepsi'].forEach(function (n) { if (!isObj(d[n])) d[n] = {}; });
    if (!Array.isArray(d.fenomena)) d.fenomena = [];
    if (!Array.isArray(d.kata)) d.kata = [];
    d.kata = d.kata.filter(function (x) { return typeof x === 'string'; });
    d.fenomena = d.fenomena.filter(function (x) { return typeof x === 'string'; });
    Object.keys(d.level).forEach(function (n) {
      var v = d.level[n];
      if (!isObj(v) || !angka(v.bintang) || typeof v.selesai !== 'boolean') delete d.level[n];
    });
    Object.keys(d.keterampilan).forEach(function (t) {
      var v = d.keterampilan[t];
      if (!isObj(v) || !angka(v.kesempatan) || !angka(v.benarAwal) || !angka(v.salah)) delete d.keterampilan[t];
      else if (!angka(v.tanpaLekuk)) v.tanpaLekuk = 0;
    });
    Object.keys(d.miskonsepsi).forEach(function (t) { if (!angka(d.miskonsepsi[t])) delete d.miskonsepsi[t]; });
    for (k in d) if (!(k in f)) delete d[k];
    return d;
  }
  function slot(tag) { return Save.data.keterampilan[tag] || (Save.data.keterampilan[tag] = { kesempatan: 0, benarAwal: 0, salah: 0, tanpaLekuk: 0 }); }

  var Save = {
    data: fresh(),
    load: function () {
      try {
        var raw = root.localStorage.getItem(KEY);
        if (raw) Save.data = clean(JSON.parse(raw));
      } catch (e) { Save.data = memory || fresh(); }
    },
    save: function () {
      memory = Save.data;
      try { root.localStorage.setItem(KEY, JSON.stringify(Save.data)); } catch (e) { /* diblokir: abaikan */ }
    },
    /* satu kesempatan keterampilan selesai; langsung = benar pada coba pertama; tanpaLekuk = dijawab tanpa penopang lekuk kartu */
    catat: function (tag, langsung, tanpaLekuk) { var s = slot(tag); s.kesempatan++; if (langsung) { s.benarAwal++; if (tanpaLekuk) s.tanpaLekuk++; } },
    catatSalah: function (tag) { slot(tag).salah++; },
    catatMis: function (kode) { if (kode) Save.data.miskonsepsi[kode] = (Save.data.miskonsepsi[kode] || 0) + 1; },
    /* status Hasil Belajarku (GDD bagian 4) */
    status: function (tag) {
      var s = Save.data.keterampilan[tag];
      if (!s || !s.kesempatan) return 'belum';
      /* kartu kalimat (TP3, TP5, TP6): minimal 2 tepat tanpa lekuk, kecuali Mode Santai yang selalu menampilkan lekuk */
      var kartu = ['many-much', 'some-any', 'there-is-are'].indexOf(tag) >= 0;
      if (s.benarAwal >= 4 && s.benarAwal / s.kesempatan >= 0.75 && (!kartu || s.tanpaLekuk >= 2 || Save.data.settings.santai)) return 'dikuasai';
      return s.benarAwal >= 2 ? 'berkembang' : 'latihan';
    },
    selesai: function (n) { var l = Save.data.level[n]; return !!(l && l.selesai); },
    terbuka: function (n) { return n <= 1 || Save.selesai(n - 1); },
    catatLevel: function (n, isi) {
      var lama = Save.data.level[n] || { selesai: false, bintang: 0, petunjuk3: 0, detik: 0 };
      Save.data.level[n] = {
        selesai: lama.selesai || !!isi.selesai,
        bintang: Math.max(lama.bintang, isi.bintang || 0),
        petunjuk3: isi.petunjuk3 || 0,
        detik: isi.detik || 0
      };
      Save.save();
    },
    tambahEmbun: function (n) { Save.data.embun += n; Save.save(); },
    /* Jurnal Cuaca: kata dari kapsul L1 dan Kartu Temuan, fenomena dari JALANKAN */
    temukanKata: function (id) { if (Save.data.kata.indexOf(id) < 0) { Save.data.kata.push(id); Save.save(); return true; } return false; },
    punyaKata: function (id) { return Save.data.kata.indexOf(id) >= 0 || (Save.selesai(1) && ['clouds', 'rain', 'kites', 'wind', 'sunshine', 'umbrellas', 'sand', 'boats', 'fog', 'snow', 'water', 'raindrops', 'snowflakes'].indexOf(id) >= 0); },
    temukanFenomena: function (id) { if (Save.data.fenomena.indexOf(id) < 0) { Save.data.fenomena.push(id); Save.save(); return true; } return false; },
    /* Murid baru di perangkat yang sama: progres dihapus, pengaturan tetap */
    newStudent: function () { var s = Save.data.settings; Save.data = fresh(); Save.data.settings = s; Save.save(); }
  };
  root.Save = Save;
})(typeof window !== 'undefined' ? window : globalThis);
