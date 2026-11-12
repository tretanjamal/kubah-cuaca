/* Boot: simpanan, layar muat (huruf, gambar, daftar suara perangkat), lalu layar judul.
   Kait uji window.__test hanya aktif dengan ?test=1 dan tidak terlihat oleh murid. */
(function () {
  Save.load();
  bootStage();
  Seni.pasangDefs();
  UI.applySettings();
  document.title = STR.judul.lengkap;
  document.getElementById('rotate-text').textContent = STR.putar;
  Muat.buka();

  function suaraSiap() {
    return new Promise(function (ok) {
      var ss = window.speechSynthesis;
      if (!ss || (ss.getVoices() || []).length) { ok(); return; }
      ss.addEventListener('voiceschanged', function () { ok(); });
      setTimeout(ok, 1200);
    });
  }
  var A = window.ASET || { gambar: {}, benda: {} }, G = A.gambar || {}, daftar = [];
  ['labDalam', 'judulLatar'].forEach(function (k) { if (G[k]) daftar.push(G[k]); });
  if (G.lembah) daftar.push(G.lembah.src);
  if (G.kumuBadan) daftar.push(G.kumuBadan.src);
  Object.keys(A.benda || {}).forEach(function (k) { daftar.push(A.benda[k].src); });
  var huruf = ["800 40px 'Baloo 2'", '400 24px Andika', '700 24px Andika'].map(function (f) { return document.fonts.load(f).catch(function () { }); });
  Promise.all(huruf).then(function () {
    Muat.atur(0.35);
    return Seni.muatGambar(daftar);
  }).then(function () {
    Muat.atur(0.8);
    return suaraSiap();
  }).then(function () {
    Muat.atur(1);
    return Muat.tunggu();
  }).then(function () {
    Muat.tutup();
    Scenes.go('judul');
  });

  /* lama bermain, tidak dihitung saat tab tersembunyi atau di layar judul */
  setInterval(function () {
    if (Loop.paused || Stage.portrait || !Scenes.name || Scenes.name === 'judul') return;
    Save.data.detik++;
    if (Save.data.detik % 15 === 0) Save.save();
  }, 1000);

  if (U.TEST) {
    window.__test = {
      scene: function () { return Scenes.name; },
      keadaan: function () {
        var c = Scenes.cur, k = c && c.uji ? c.uji.keadaan() : {}, o = { scene: Scenes.name, busy: Scenes.busy, overlay: !!document.querySelector('.overlay') }, n;
        for (n in k) o[n] = k[n];
        o.siap = !!k.siap && !Scenes.busy;
        return o;
      },
      keLevel: function (n) { Scenes.go('level' + n); },
      ke: function (nama) { Scenes.go(nama); },
      aturSantai: function (b) { Save.data.settings.santai = !!b; Save.save(); },
      lewatiHook: function () { Save.data.hook = true; Save.save(); },
      simpanan: function () { return JSON.parse(JSON.stringify(Save.data)); },
      ucapan: function () { return Voice.log.slice(); },
      periksa: Kuantitas.periksa,
      kalimat: function (id, n, bentuk) { var k = Kuantitas.kalimat(id, n, bentuk); return k ? k.map(Kuantitas.teks) : null; },
      luap: function () { return UI.cekLuap(); },
      cuaca: function (o) { if (Scenes.cur && Scenes.cur.uji && Scenes.cur.uji.cuaca) Scenes.cur.uji.cuaca(o); },
      kubah: function () { var c = Scenes.cur; return c && c.uji && c.uji.kubah ? c.uji.kubah() : null; },
      solusi: function () { var c = Scenes.cur; return c && c.uji && c.uji.solusi ? c.uji.solusi() : null; },
      uji: function (nama, arg) { var c = Scenes.cur; return c && c.uji && c.uji[nama] ? c.uji[nama](arg) : null; }
    };
  }
})();
