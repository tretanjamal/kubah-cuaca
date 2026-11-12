/* Kubah Cuaca: satu kanvas 2D di dalam kaca (GDD bagian 15). Urutan lapis: langit (siang atau malam), bintang, matahari, pelangi, awan,
   layang-layang terbang, lembah (langit gambar transparan), air danau, pasir, ikan, genangan, katak, payung, perahu, layang-layang di tanah,
   bunga, daun, manusia salju, garam, salju di puncak, hujan, salju, kabut, angin, mendung, malam dan senter, efek alat salah, lalu Lensa.
   nilai = alat dan benda yang diatur adegan; ekstra = benda yang muncul karena fenomena aktif; dunia() = gabungan keduanya.
   JALANKAN (jalankan) memutar "hari kecil" 2,4 detik lalu memeriksa fenomena (config/fenomena.js).
   Koordinat lokal = koordinat panggung dikurangi (x0, y0). Kaca dan kilau digambar SVG di atasnya. */
(function (root) {
  var MAKS_HUJAN = 160, MAKS_SALJU = 120;
  /* letak benda (lokal). Tiga awan pertama sengaja berjauhan supaya "a few clouds" mudah dihitung. */
  var SLOT = {
    clouds: [[150, 74], [300, 54], [420, 90], [84, 122], [228, 104], [360, 134], [470, 150], [186, 156], [70, 176], [292, 168], [418, 186], [128, 44]],
    kitesTanah: [[150, 432], [184, 440], [218, 434], [252, 442], [286, 436], [320, 442], [166, 446], [200, 448], [234, 446], [268, 448], [302, 446], [336, 434]],
    kitesTerbang: [[130, 196], [200, 170], [270, 206], [96, 236], [170, 228], [330, 176], [240, 244], [60, 200], [300, 236], [380, 214], [210, 130], [120, 150]],
    umbrellas: [[232, 392], [262, 384], [206, 404], [288, 398], [246, 414], [218, 380], [274, 414], [196, 388], [300, 386], [258, 400], [230, 418], [286, 372]],
    boats: [[458, 356], [498, 368], [466, 400], [500, 408], [480, 382], [440, 380], [512, 388], [452, 422], [486, 426], [470, 342], [506, 350], [430, 404]],
    dermaga: [[392, 398], [414, 404], [436, 398], [400, 412], [424, 414], [446, 410], [384, 410], [408, 392], [430, 388], [452, 402], [418, 420], [440, 420]],
    fish: [[444, 394], [472, 406], [500, 390], [458, 414], [488, 420], [512, 404], [432, 406], [464, 386], [494, 410], [518, 392], [448, 422], [478, 398]],
    frogs: [[388, 424], [410, 432], [366, 430], [346, 422], [432, 436], [326, 432], [398, 440], [376, 442], [354, 438], [420, 444], [340, 444], [362, 418]],
    puddles: [[290, 424], [196, 432], [334, 440], [244, 446], [150, 444], [372, 446], [222, 420], [306, 446], [176, 420], [266, 432], [128, 432], [350, 430]],
    leaves: [[210, 418], [232, 428], [262, 422], [284, 432], [196, 436], [244, 440], [274, 444], [220, 446], [300, 420], [186, 424], [254, 412], [290, 442]],
    salt: [[362, 326], [404, 320], [392, 346], [372, 336], [414, 334], [352, 344], [384, 318], [400, 352], [366, 352], [420, 344], [348, 330], [410, 310]],
    stars: [[90, 50], [170, 30], [250, 60], [330, 34], [410, 56], [130, 100], [210, 92], [300, 110], [390, 96], [460, 130], [60, 140], [240, 150]],
    bunga: [[30, 336], [58, 352], [92, 340], [40, 372], [76, 380], [112, 366], [24, 396], [60, 402], [100, 396], [126, 350], [18, 360], [86, 418]]
  };
  var JENDELA = [[171, 346], [321, 346], [167, 387], [321, 394]];
  /* dunia hidup: cerobong rumah dan jalan desa yang dilewati warga kecil (koordinat lokal kubah) */
  var CEROBONG = [[190, 316], [318, 312]];
  var JALAN = [[220, 444], [226, 418], [236, 392], [248, 384], [262, 396], [282, 420], [330, 424], [364, 418], [378, 404]];
  var WARGA = [{ p: 0.1, v: 0.045, arah: 1, baju: '#FF8A6B', kulit: '#C98B5E', rambut: '#3B2A22' }, { p: 0.75, v: 0.035, arah: -1, baju: '#4FA3E0', kulit: '#8D5A3B', rambut: '#1E1A18' }];
  function titikJalan(p) {
    var seg = [], total = 0, i;
    for (i = 1; i < JALAN.length; i++) { var d = Math.hypot(JALAN[i][0] - JALAN[i - 1][0], JALAN[i][1] - JALAN[i - 1][1]); seg.push(d); total += d; }
    var s = p * total;
    for (i = 0; i < seg.length; i++) { if (s <= seg[i]) { var k = s / seg[i]; return [JALAN[i][0] + (JALAN[i + 1][0] - JALAN[i][0]) * k, JALAN[i][1] + (JALAN[i + 1][1] - JALAN[i][1]) * k]; } s -= seg[i]; }
    return JALAN[JALAN.length - 1];
  }
  var LEBAR = { clouds: 100, kitesTanah: 36, kitesTerbang: 44, umbrellas: 38, boats: 42, fish: 26, frogs: 30, puddles: 40, leaves: 16, salt: 22, stars: 18 };
  var SPRITE = { clouds: 'awan', kites: 'layang', umbrellas: 'payung', boats: 'perahu', fish: 'ikan', frogs: 'katak', puddles: 'genangan', leaves: 'daun', salt: 'garam', stars: 'bintang' };
  var WARNA_GUMPAL = { sand: ['#F5E6C4', '#D8BC85'], water: ['#8CC8F0', '#2F7EBB'], rain: ['#8CC8F0', '#4FA3E0'], snow: ['#FFFFFF', '#DCD6E6'],
    sunshine: ['#FFF0B8', '#FFC94A'], fog: ['#FFFFFF', '#CFD9E0'], wind: ['#E6E1FA', '#A99BE8'] };
  var WARNA_LELEH = { clouds: '#F4F1F8', kites: '#FF8A6B', umbrellas: '#4FA3E0', boats: '#FF8A6B' };
  /* benda yang muncul karena fenomena (ekstra) */
  var EKSTRA = { pelangi: { rainbows: 1 }, genangan: { puddles: 3, frogs: 3 }, daun: { leaves: 10 }, garam: { salt: 20 }, bintang: { stars: 10 } };
  var KUNCI = ['clouds', 'kites', 'umbrellas', 'boats', 'rain', 'snow', 'wind', 'sunshine', 'fog', 'water', 'sand', 'fish', 'frogs', 'puddles', 'leaves', 'salt', 'stars', 'rainbows'];
  var HITUNG_TAMPIL = ['clouds', 'kites', 'umbrellas', 'boats', 'fish', 'frogs', 'puddles', 'leaves', 'stars', 'salt', 'bunga'];

  function Kubah(parent, o) {
    var self = this;
    this.o = o; // x0, y0, w, h, cx, by, top
    this.nilai = {}; this.ekstra = {}; this.tampil = {};
    KUNCI.forEach(function (k) { self.nilai[k] = 0; self.tampil[k] = 0; });
    this.benda = {};
    HITUNG_TAMPIL.forEach(function (k) { self.benda[k] = []; });
    this.hujan = []; this.salju = []; this.garis = []; this.gugur = [];
    this.waktu = 0; this.efek = null; this.lensa = { on: false, x: 200, y: 200, r: 60 };
    this.fenomena = {}; this.malam = false; this.gelap = 0; this.senter = { on: false, x: 260, y: 250, r: 92 }; this.sapu = -1; this.bungaN = 0;
    this.asap = []; this.asapT = 0; this.warga = WARGA.map(function (w) { var x = {}; for (var k in w) x[k] = w[k]; return x; });
    this.kanvas = U.h('canvas', 'kanvas-kubah');
    this.kanvas.style.cssText = 'left:' + o.x0 + 'px;top:' + o.y0 + 'px;width:' + o.w + 'px;height:' + o.h + 'px';
    this.ctx = this.kanvas.getContext('2d');
    this.lapisMalam = document.createElement('canvas');
    parent.appendChild(this.kanvas);
    this.jalur = new Path2D(Seni.jalurKubah(o.cx - o.x0, o.by - o.y0, o.w, o.top - o.y0));
    var L = Seni.aset('lembah');
    this.lembah = L ? Seni.img(L.src) : null;
    this.lh = o.w * 640 / 960;
    this.ly = o.by + 38 - this.lh - o.y0;
    this.sprite = {};
    ['awan', 'awan-hujan', 'layang', 'payung', 'perahu', 'tetes', 'keping-salju', 'pelangi', 'ikan', 'katak', 'genangan', 'daun', 'garam', 'bintang', 'manusia-salju'].forEach(function (k) { self.sprite[k] = Seni.img(Seni.srcBenda(k)); });
    this.skala = 0;
    this.ukur = function (s) {
      var k = Math.min(2, Math.max(1, s * (root.devicePixelRatio || 1)));
      if (k === self.skala) return;
      self.skala = k;
      self.kanvas.width = Math.round(o.w * k); self.kanvas.height = Math.round(o.h * k);
      self.lapisMalam.width = self.kanvas.width; self.lapisMalam.height = self.kanvas.height;
    };
    this.ukur(Stage.scale || 1);
    Stage.onFit(this.ukur);
    this.update = function (dt) { self.langkah(dt); self.gambar(); };
    Loop.add(this.update);
  }

  Kubah.prototype.lepas = function () {
    Loop.remove(this.update);
    var i = Stage.fits.indexOf(this.ukur); if (i >= 0) Stage.fits.splice(i, 1);
  };
  /* gabungan nilai dan ekstra fenomena: dipakai untuk menggambar, pertanyaan, dan pemeriksa kebenaran */
  Kubah.prototype.dunia = function () {
    var d = {}, self = this;
    KUNCI.forEach(function (k) { d[k] = Math.max(self.nilai[k] || 0, self.ekstra[k] || 0); });
    d.malam = this.malam;
    return d;
  };
  /* ubah takaran atau jumlah; fenomena yang syaratnya hilang ikut hilang */
  Kubah.prototype.atur = function (id, v) {
    if (!(id in this.nilai)) return;
    this.nilai[id] = v;
    this.segarFenomena();
    this.bunyi();
    if (this.onAtur) this.onAtur(id, v);
  };
  Kubah.prototype.reset = function (simpan) {
    var self = this;
    KUNCI.forEach(function (k) { if (!simpan || simpan.indexOf(k) < 0) self.nilai[k] = 0; });
    this.fenomena = {}; this.ekstra = {}; this.efek = null; this.lensa.on = false;
    this.bunyi();
    if (this.onAtur) this.onAtur();
  };
  Kubah.prototype.bunyi = function () {
    var n = this.nilai;
    Aud.cuaca({ rain: n.rain, wind: n.wind, sunshine: this.malam ? 0 : n.sunshine, snow: n.snow, fog: n.fog });
  };
  Kubah.prototype.aturMalam = function (on) { this.malam = !!on; this.senter.on = !!on; this.segarFenomena(); this.bunyi(); };
  Kubah.prototype.hitungEkstra = function () {
    var e = {}, self = this;
    Object.keys(this.fenomena).forEach(function (f) { var x = EKSTRA[f]; if (x) Object.keys(x).forEach(function (k) { e[k] = Math.max(e[k] || 0, x[k]); }); });
    this.ekstra = e;
  };
  /* fenomena aktif yang syaratnya tidak lagi terpenuhi dihapus (yang baru hanya muncul lewat JALANKAN) */
  Kubah.prototype.segarFenomena = function () {
    var self = this, n = this.dunia(), ubah = false;
    Object.keys(this.fenomena).forEach(function (id) {
      var f = root.FENOMENA.daftar.filter(function (x) { return x.id === id; })[0];
      if (f && !f.syarat(n)) { delete self.fenomena[id]; ubah = true; }
    });
    if (ubah) this.hitungEkstra();
  };
  /* JALANKAN: hari kecil 2,4 detik, lalu fenomena yang syaratnya terpenuhi menjadi aktif. Hasil: daftar id fenomena aktif. */
  Kubah.prototype.jalankan = function (ms) {
    var self = this;
    this.sapu = 0;
    Aud.sfx('whoosh');
    return Tween.run(UI.kurangi ? 600 : (ms || 2400), function (e) { self.sapu = e; }, Ease.easeInOutCubic).then(function () {
      self.sapu = -1;
      var n = self.dunia(), aktif = [];
      root.FENOMENA.daftar.forEach(function (f) { if (f.syarat(n)) { self.fenomena[f.id] = true; aktif.push(f.id); } });
      self.hitungEkstra();
      return aktif;
    });
  };
  Kubah.prototype.aturEfek = function (jenis, id, k) { this.efek = jenis ? { jenis: jenis, id: id, t: 0, k: k == null ? 1 : k } : null; };
  Kubah.prototype.tumbuhBunga = function (n) { this.bungaN = n; };
  Kubah.prototype.lokal = function (x, y) { return { x: x - this.o.x0, y: y - this.o.y0 }; };

  Kubah.prototype.langkah = function (dt) {
    var self = this, n = this.dunia(), t = this.tampil, w = this.o.w, k;
    this.waktu += dt;
    KUNCI.forEach(function (k) { t[k] += ((n[k] || 0) - t[k]) * Math.min(1, dt * 4); });
    this.gelap += ((this.malam ? 1 : 0) - this.gelap) * Math.min(1, dt * 2);
    /* benda yang dihitung muncul satu-satu (easeOutBack) */
    HITUNG_TAMPIL.forEach(function (k) {
      var d = self.benda[k], target = k === 'bunga' ? self.bungaN : k === 'salt' ? (n.salt > 0 ? Math.max(3, Math.round(n.salt / 100 * 12)) : 0) : Math.min(12, n[k] || 0);
      while (d.length < target) d.push({ s: UI.kurangi ? 1 : 0, t: -d.length * (k === 'clouds' ? 0 : 0.06) });
      while (d.length > target) d.pop();
      d.forEach(function (b) { b.t += dt; if (b.s < 1 && b.t > 0) b.s = Math.min(1, b.s + dt * 3.2); });
    });
    /* hujan: butir sebanyak takaran, hanya bila ada awan */
    var targetH = n.clouds > 0 ? Math.round(n.rain / 100 * MAKS_HUJAN * (UI.kurangi ? 0.4 : 1)) : 0;
    while (this.hujan.length < targetH) this.hujan.push({ x: Math.random() * w, y: 60 + Math.random() * 360, v: 480 + Math.random() * 160 });
    if (this.hujan.length > targetH) this.hujan.length = targetH;
    var angin = t.wind / 100;
    this.hujan.forEach(function (p) {
      p.y += p.v * dt * (UI.kurangi ? 0.5 : 1); p.x += angin * 160 * dt;
      if (p.y > 430) { p.y = 70 + Math.random() * 40; p.x = Math.random() * w; }
      if (p.x > w) p.x -= w;
    });
    var targetS = n.clouds > 0 ? Math.round(n.snow / 100 * MAKS_SALJU * (UI.kurangi ? 0.4 : 1)) : 0;
    while (this.salju.length < targetS) this.salju.push({ x: Math.random() * w, y: 60 + Math.random() * 360, v: 40 + Math.random() * 30, f: Math.random() * 6, r: 2 + Math.random() * 2.5 });
    if (this.salju.length > targetS) this.salju.length = targetS;
    this.salju.forEach(function (p) {
      p.y += p.v * dt; p.x += (Math.sin(self.waktu * 1.5 + p.f) * 18 + angin * 90) * dt;
      if (p.y > 430) { p.y = 70 + Math.random() * 30; p.x = Math.random() * w; }
      if (p.x > w) p.x -= w; if (p.x < 0) p.x += w;
    });
    var targetG = UI.kurangi ? 0 : Math.round(n.wind / 100 * 14);
    while (this.garis.length < targetG) this.garis.push({ x: Math.random() * w, y: 40 + Math.random() * 360, p: 40 + Math.random() * 50, v: 260 + Math.random() * 140 });
    if (this.garis.length > targetG) this.garis.length = targetG;
    this.garis.forEach(function (g) { g.x += g.v * dt; if (g.x > w + 60) { g.x = -60; g.y = 40 + Math.random() * 360; } });
    /* daun yang gugur dari pohon besar saat Daun Berguguran */
    var targetD = this.fenomena.daun && !UI.kurangi ? 6 : 0;
    while (this.gugur.length < targetD) this.gugur.push({ x: 220 + Math.random() * 60, y: 280 + Math.random() * 30, v: 40 + Math.random() * 30, f: Math.random() * 6 });
    if (this.gugur.length > targetD) this.gugur.length = targetD;
    this.gugur.forEach(function (p) { p.y += p.v * dt; p.x += (Math.sin(self.waktu * 2 + p.f) * 30 + angin * 60) * dt; if (p.y > 440) { p.y = 280; p.x = 220 + Math.random() * 60; } });
    if (this.efek) this.efek.t += dt;
    /* asap cerobong: kepulan kecil naik dan terbawa angin */
    this.asapT -= dt;
    if (this.asapT <= 0) { this.asapT = UI.kurangi ? 1.6 : 0.7; CEROBONG.forEach(function (c) { self.asap.push({ x: c[0], y: c[1], r: 2.5, a: 0.55 }); }); }
    this.asap.forEach(function (p) { p.y -= 9 * dt; p.x += (2 + angin * 26) * dt; p.r += 2.2 * dt; p.a -= 0.16 * dt; });
    this.asap = this.asap.filter(function (p) { return p.a > 0; });
    /* warga berjalan bolak-balik di jalan desa */
    if (!UI.kurangi) this.warga.forEach(function (w) { w.p += w.v * w.arah * dt; if (w.p > 1) { w.p = 1; w.arah = -1; } if (w.p < 0) { w.p = 0; w.arah = 1; } });
  };

  /* campur dua warna (#RRGGBB atau [r,g,b]); hasil [r,g,b] supaya bisa dicampur lagi, rgb() untuk kanvas */
  function rgbArr(a) { if (Array.isArray(a)) return a; var x = parseInt(a.slice(1), 16); return [(x >> 16) & 255, (x >> 8) & 255, x & 255]; }
  function campur(a, b, k) { var p = rgbArr(a), q = rgbArr(b); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k]; }
  function css(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
  function siap(i) { return i && i.complete && i.naturalWidth; }
  function gambarSprite(c, i, x, y, lebar, skala, rot) {
    if (!siap(i)) return;
    var h = lebar * i.naturalHeight / i.naturalWidth;
    c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(skala, skala);
    c.drawImage(i, -lebar / 2, -h / 2, lebar, h);
    c.restore();
  }
  /* warga plastisin kecil (tinggi sekitar 17 px): kaki berayun, menghadap arah jalan */
  function gambarWarga(c, x, y, w, t, alpha) {
    var ayun = Math.sin(t * 7 + w.v * 100) * 2.2;
    c.save(); c.globalAlpha = Math.max(0, Math.min(1, alpha)); c.translate(x, y); c.scale(w.arah, 1);
    c.strokeStyle = '#1E3A4C'; c.lineWidth = 1.6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-1.5, -5); c.lineTo(-1.5 + ayun, 0); c.moveTo(1.5, -5); c.lineTo(1.5 - ayun, 0); c.stroke();
    c.fillStyle = w.baju; c.lineWidth = 1.2;
    c.beginPath(); if (c.roundRect) c.roundRect(-3.6, -12.5, 7.2, 8.5, 3); else c.rect(-3.6, -12.5, 7.2, 8.5); c.fill(); c.stroke();
    c.fillStyle = w.kulit; c.beginPath(); c.arc(0.5, -15.5, 3.2, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = w.rambut; c.beginPath(); c.arc(0, -16.6, 3.2, Math.PI * 1.05, Math.PI * 1.95); c.fill();
    c.restore();
  }
  function letup(s) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(s - 1, 3) + c1 * Math.pow(s - 1, 2); }

  Kubah.prototype.gambarDaftar = function (c, k, slot, lebar, fn) {
    var self = this, spr = this.sprite[SPRITE[k]];
    this.benda[k].forEach(function (b, i) {
      var s = (slot || SLOT[k])[i % 12], p = fn ? fn(s, i) : { x: s[0], y: s[1], r: 0 };
      gambarSprite(c, spr, p.x, p.y, lebar || LEBAR[k], letup(b.s), p.r);
    });
  };

  Kubah.prototype.gambar = function () {
    var c = this.ctx, o = this.o, w = o.w, h = o.h, t = this.tampil, waktu = this.waktu, self = this, F = this.fenomena, gelap = this.gelap;
    c.setTransform(this.skala, 0, 0, this.skala, 0, 0);
    c.clearRect(0, 0, w, h);
    c.save();
    c.clip(this.jalur);
    /* langit: kelabu bila awan, hujan, atau kabut banyak; hangat bila matahari banyak; biru tua di malam hari */
    var mendung = Math.min(1, t.clouds / 10 * 0.5 + t.rain / 100 * 0.45 + t.fog / 100 * 0.35 + t.snow / 100 * 0.25), sinar = t.sunshine / 100 * (1 - gelap);
    var gr = c.createLinearGradient(0, 0, 0, 320);
    gr.addColorStop(0, css(campur(campur(campur('#8FCDF6', '#9DA8C0', mendung), '#A9DCFA', sinar * 0.4), '#1F2A55', gelap)));
    gr.addColorStop(1, css(campur(campur(campur('#CFEEFB', '#D3D8E2', mendung), '#FFF1C9', sinar * 0.55), '#3B3F78', gelap)));
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    /* bintang malam: hanya terlihat bila tidak ada awan */
    if (gelap > 0.05) this.gambarDaftar(c, 'stars', null, null, function (s, i) { return { x: s[0], y: s[1] + Math.sin(waktu * 2 + i) * 1.5, r: Math.sin(waktu + i) * 0.2 }; });
    /* matahari */
    if (sinar > 0.01) {
      var sx = w - 70, sy = 34, rg = c.createRadialGradient(sx, sy, 4, sx, sy, 90 + 110 * sinar);
      rg.addColorStop(0, 'rgba(255,248,214,' + (0.95 * sinar) + ')'); rg.addColorStop(0.35, 'rgba(255,224,143,' + (0.6 * sinar) + ')'); rg.addColorStop(1, 'rgba(255,201,74,0)');
      c.fillStyle = rg; c.fillRect(0, 0, w, h);
      c.save(); c.globalAlpha = 0.16 * sinar; c.fillStyle = '#FFF4C9';
      for (var r = 0; r < 6; r++) { var a = 1.9 + r * 0.22 + Math.sin(waktu * 0.3) * 0.03; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + Math.cos(a) * 520, sy + Math.sin(a) * 520); c.lineTo(sx + Math.cos(a + 0.07) * 520, sy + Math.sin(a + 0.07) * 520); c.fill(); }
      c.restore();
    }
    /* pelangi (Fenomena Pelangi): di belakang bukit */
    if (t.rainbows > 0.02) { c.save(); c.globalAlpha = Math.min(1, t.rainbows); gambarSprite(c, this.sprite.pelangi, 300, 300, 300, 1); c.restore(); }
    /* awan: melayang pelan, lebih cepat bila berangin; makin kelabu bila hujan banyak */
    var hanyut = waktu * (4 + t.wind * 0.35), kelabu = Math.min(1, t.rain / 100 * 0.9 + t.snow / 100 * 0.3);
    this.benda.clouds.forEach(function (b, i) {
      var s = SLOT.clouds[i % 12], x = ((s[0] + hanyut + i * 37) % (w + 120)) - 60, y = s[1] + Math.sin(waktu * 0.6 + i) * 3, sk = letup(b.s);
      if (b.s >= 1) x = s[0] + Math.sin(waktu * 0.25 + i) * (6 + t.wind * 0.4);
      c.globalAlpha = 1 - kelabu * 0.85;
      gambarSprite(c, self.sprite.awan, x, y, LEBAR.clouds, sk);
      if (kelabu > 0.02) { c.globalAlpha = kelabu; gambarSprite(c, self.sprite['awan-hujan'], x, y, LEBAR.clouds, sk); }
      c.globalAlpha = 1;
    });
    /* layang-layang terbang bila angin cukup */
    var terbang = t.wind >= 35;
    if (terbang) this.benda.kites.forEach(function (b, i) {
      var s = SLOT.kitesTerbang[i % 12], ayun = Math.sin(waktu * 2 + i) * 0.18, x = s[0] + Math.sin(waktu * 1.3 + i) * 8, y = s[1] + Math.cos(waktu * 1.1 + i) * 6;
      var tanah = SLOT.kitesTanah[i % 12];
      c.strokeStyle = 'rgba(30,58,76,.45)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y + 14); c.quadraticCurveTo((x + tanah[0]) / 2 - 20, (y + tanah[1]) / 2 + 30, tanah[0], tanah[1]); c.stroke();
      gambarSprite(c, self.sprite.layang, x, y, LEBAR.kitesTerbang, letup(b.s), ayun);
    });
    /* lembah */
    if (siap(this.lembah)) c.drawImage(this.lembah, 0, this.ly, w, this.lh);
    else { c.fillStyle = '#6CC07A'; c.fillRect(0, 300, w, h); }
    /* air danau naik dan pasir pantai bertambah */
    if (t.water > 1) {
      var aw = t.water / 100;
      c.save(); c.globalAlpha = 0.55 + aw * 0.2; c.fillStyle = '#4FA3E0';
      c.beginPath(); c.ellipse(478, 386, 52 + aw * 70, 18 + aw * 20, 0, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 0.35; c.fillStyle = '#FFFFFF'; c.beginPath(); c.ellipse(460, 380, 18 + aw * 20, 3, 0, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    if (t.sand > 1) {
      var ps = t.sand / 100, pg = c.createRadialGradient(392, 404, 2, 400, 414, 22 + ps * 46);
      pg.addColorStop(0, '#F8EBCB'); pg.addColorStop(0.6, '#EAD3A2'); pg.addColorStop(1, '#CDB07A');
      c.fillStyle = pg; c.beginPath(); c.ellipse(404, 416, 16 + ps * 44, 6 + ps * 16, 0, Math.PI, 0); c.lineTo(404 + 16 + ps * 44, 418); c.fill();
    }
    /* asap cerobong dan warga kecil di jalan desa (masuk rumah saat malam) */
    if (this.asap.length) { c.save(); this.asap.forEach(function (p) { c.fillStyle = 'rgba(244,244,248,' + Math.max(0, p.a).toFixed(3) + ')'; c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill(); }); c.restore(); }
    if (gelap < 0.5) this.warga.forEach(function (w) { var q = titikJalan(w.p); gambarWarga(c, q[0], q[1], w, waktu, 1 - gelap * 2); });
    /* ikan melompat pelan di danau, genangan, katak */
    this.gambarDaftar(c, 'fish', null, null, function (s, i) { return { x: s[0] + Math.sin(waktu * 0.8 + i) * 6, y: s[1] - Math.max(0, Math.sin(waktu * 1.6 + i * 1.7)) * 6, r: Math.sin(waktu * 0.8 + i) * 0.15 }; });
    this.gambarDaftar(c, 'puddles');
    this.gambarDaftar(c, 'frogs', null, null, function (s, i) { return { x: s[0], y: s[1] - Math.max(0, Math.sin(waktu * 2.4 + i * 2.1)) * 7, r: 0 }; });
    /* payung, perahu (menunggu di dermaga saat kabut tebal), layang-layang di tanah */
    this.benda.umbrellas.forEach(function (b, i) { var s = SLOT.umbrellas[i % 12]; gambarSprite(c, self.sprite.payung, s[0], s[1] - 8, LEBAR.umbrellas, letup(b.s), Math.sin(waktu * 1.6 + i) * 0.04 * (1 + t.wind / 30)); });
    var diDermaga = t.fog >= 70;
    this.benda.boats.forEach(function (b, i) { var s = (diDermaga ? SLOT.dermaga : SLOT.boats)[i % 12]; gambarSprite(c, self.sprite.perahu, s[0], s[1] + Math.sin(waktu * 1.8 + i) * 1.5, LEBAR.boats, letup(b.s), Math.sin(waktu * 1.4 + i) * 0.05); });
    if (!terbang) this.benda.kites.forEach(function (b, i) { var s = SLOT.kitesTanah[i % 12]; gambarSprite(c, self.sprite.layang, s[0], s[1] - 10, LEBAR.kitesTanah, letup(b.s), -0.5); });
    this.benda.bunga.forEach(function (b, i) {
      if (b.s <= 0) return;
      var s = SLOT.bunga[i % 12], sk = letup(b.s);
      c.save(); c.translate(s[0], s[1]); c.scale(sk, sk);
      c.fillStyle = '#4C9A5B'; c.fillRect(-1, -7, 2, 7);
      c.fillStyle = i % 2 ? '#FF8A6B' : '#FFC94A';
      for (var p = 0; p < 5; p++) { var a = p * 1.2566; c.beginPath(); c.arc(Math.cos(a) * 3, -9 + Math.sin(a) * 3, 2.6, 0, Math.PI * 2); c.fill(); }
      c.fillStyle = '#FFF4C9'; c.beginPath(); c.arc(0, -9, 1.8, 0, Math.PI * 2); c.fill();
      c.restore();
    });
    /* daun di tanah dan yang sedang gugur, garam di tambak */
    this.gambarDaftar(c, 'leaves', null, null, function (s, i) { return { x: s[0], y: s[1], r: i * 0.9 }; });
    this.gugur.forEach(function (p, i) { gambarSprite(c, self.sprite.daun, p.x, p.y, 14, 1, waktu * 2 + i); });
    this.gambarDaftar(c, 'salt', null, null, function (s, i) { return { x: s[0], y: s[1], r: 0 }; });
    /* salju menutup puncak; manusia salju bila salju banyak sudah dijalankan */
    if (t.snow > 20) {
      c.save(); c.globalAlpha = Math.min(1, (t.snow - 20) / 50); c.fillStyle = '#FBF8F2';
      c.beginPath(); c.moveTo(30, 270); c.quadraticCurveTo(48, 238, 60, 236); c.quadraticCurveTo(74, 236, 92, 268);
      c.quadraticCurveTo(82, 276, 74, 268); c.quadraticCurveTo(64, 280, 54, 268); c.quadraticCurveTo(42, 278, 30, 270); c.fill();
      c.restore();
    }
    if (F.saljuman) gambarSprite(c, this.sprite['manusia-salju'], 92, 262, 30, 1);
    /* hangat matahari di atas lembah */
    if (sinar > 0.01) { c.fillStyle = 'rgba(255,214,120,' + (0.1 * sinar) + ')'; c.fillRect(0, 0, w, h); }
    /* hujan */
    if (this.hujan.length) {
      c.strokeStyle = 'rgba(125,188,235,.85)'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath();
      var miring = t.wind / 100 * 5;
      this.hujan.forEach(function (p) { c.moveTo(p.x, p.y); c.lineTo(p.x - 3 - miring, p.y + 14); });
      c.stroke();
    }
    /* salju */
    if (this.salju.length) {
      c.fillStyle = 'rgba(255,255,255,.95)';
      this.salju.forEach(function (p) { c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill(); });
    }
    /* kabut: pita putih yang hanyut */
    if (t.fog > 1) {
      var kb = t.fog / 100;
      for (var j = 0; j < 3; j++) {
        var y0 = 120 + j * 110, gx = c.createLinearGradient(0, y0 - 60, 0, y0 + 60);
        gx.addColorStop(0, 'rgba(250,250,252,0)'); gx.addColorStop(0.5, 'rgba(250,250,252,' + (0.55 * kb) + ')'); gx.addColorStop(1, 'rgba(250,250,252,0)');
        c.fillStyle = gx; c.fillRect(0, y0 - 60, w, 120);
      }
      c.fillStyle = 'rgba(245,247,250,' + (0.28 * kb) + ')'; c.fillRect(0, 0, w, h);
    }
    /* angin: garis lengkung yang melintas */
    if (this.garis.length) {
      c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 3; c.lineCap = 'round';
      this.garis.forEach(function (g) { c.beginPath(); c.moveTo(g.x, g.y); c.quadraticCurveTo(g.x + g.p / 2, g.y - 8, g.x + g.p, g.y); c.stroke(); });
    }
    /* Langit Mendung: lembah meredup dan jendela rumah menyala */
    var redup = F.mendung ? 1 : 0;
    if (redup && gelap < 0.5) { c.fillStyle = 'rgba(40,48,80,.28)'; c.fillRect(0, 0, w, h); this.gambarJendela(c, 0.8); }
    /* malam dan senter (Patroli Malam) */
    if (gelap > 0.02) this.gambarMalam(c, gelap);
    /* sapuan cahaya JALANKAN */
    if (this.sapu >= 0) {
      var sx2 = -120 + this.sapu * (w + 240), sg = c.createLinearGradient(sx2 - 90, 0, sx2 + 90, 0);
      sg.addColorStop(0, 'rgba(255,248,214,0)'); sg.addColorStop(0.5, 'rgba(255,248,214,.38)'); sg.addColorStop(1, 'rgba(255,248,214,0)');
      c.fillStyle = sg; c.fillRect(sx2 - 90, 0, 180, h);
    }
    /* kilau kaca kubah bergeser pelan, sekali tiap 11 detik */
    if (!UI.kurangi && gelap < 0.5 && this.sapu < 0) {
      var kk = (waktu % 11) / 11;
      if (kk < 0.35) {
        var kx = -160 + kk / 0.35 * (w + 320);
        c.save(); c.translate(kx, 0); c.rotate(0.35);
        var kg = c.createLinearGradient(-40, 0, 40, 0);
        kg.addColorStop(0, 'rgba(255,255,255,0)'); kg.addColorStop(0.5, 'rgba(255,255,255,.13)'); kg.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = kg; c.fillRect(-40, -100, 80, h + 200); c.restore();
      }
    }
    /* efek alat salah */
    if (this.efek) this.gambarEfek(c);
    c.restore();
    if (this.lensa.on) this.gambarLensa(c);
  };

  Kubah.prototype.gambarJendela = function (c, k) {
    c.save();
    JENDELA.forEach(function (p) {
      var g = c.createRadialGradient(p[0], p[1], 1, p[0], p[1], 18);
      g.addColorStop(0, 'rgba(255,230,140,' + k + ')'); g.addColorStop(1, 'rgba(255,230,140,0)');
      c.fillStyle = g; c.fillRect(p[0] - 18, p[1] - 18, 36, 36);
    });
    c.restore();
  };
  /* malam: lapisan biru gelap dengan lubang senter (destination-out), lalu jendela rumah menyala */
  Kubah.prototype.gambarMalam = function (c, gelap) {
    var m = this.lapisMalam, mc = m.getContext('2d'), S = this.senter, k = this.skala;
    mc.setTransform(k, 0, 0, k, 0, 0);
    mc.globalCompositeOperation = 'source-over';
    mc.clearRect(0, 0, this.o.w, this.o.h);
    mc.fillStyle = 'rgba(14,20,52,' + (0.86 * gelap) + ')';
    mc.fillRect(0, 0, this.o.w, this.o.h);
    if (S.on) {
      mc.globalCompositeOperation = 'destination-out';
      var g = mc.createRadialGradient(S.x, S.y, S.r * 0.55, S.x, S.y, S.r);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      mc.fillStyle = g; mc.beginPath(); mc.arc(S.x, S.y, S.r, 0, Math.PI * 2); mc.fill();
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(m, 0, 0); c.restore();
    c.setTransform(k, 0, 0, k, 0, 0);
    this.gambarJendela(c, 0.9 * gelap);
    if (S.on) {
      c.save(); c.strokeStyle = 'rgba(255,240,180,.55)'; c.lineWidth = 3; c.setLineDash([8, 8]);
      c.beginPath(); c.arc(S.x, S.y, S.r - 4, 0, Math.PI * 2); c.stroke(); c.restore();
    }
  };

  Kubah.prototype.gambarEfek = function (c) {
    var e = this.efek, cx = 262, cy = 250, k = Math.min(1, e.t * 2.5) * e.k;
    if (k <= 0) return;
    if (e.jenis === 'gumpal') {
      /* satu gumpal yang bergoyang: pasir tidak datang satu-satu */
      var col = WARNA_GUMPAL[e.id] || WARNA_GUMPAL.sand, goy = Math.sin(e.t * 9) * 0.08 * Math.max(0, 1 - e.t / 2), r = 34 * letup(Math.min(1, e.t * 2.5));
      c.save(); c.translate(cx, cy); c.scale(1 + goy, 1 - goy);
      var g = c.createRadialGradient(-10, -12, 4, 0, 0, r * 1.3);
      g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
      c.fillStyle = g; c.beginPath();
      for (var i = 0; i <= 12; i++) { var a = i / 12 * Math.PI * 2, rr = r * (1 + Math.sin(a * 3 + 1) * 0.12); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.8); }
      c.fill();
      c.fillStyle = '#1E3A4C'; c.font = '800 34px "Baloo 2", sans-serif'; c.textAlign = 'center'; c.fillText('?', 0, -r - 8);
      c.restore();
    } else {
      /* benda meleleh menjadi genangan warna: layang-layang tidak bisa ditakar */
      var spr = this.sprite[SPRITE[e.id] || 'awan'], lel = Math.min(1, e.t / 1.4);
      c.save(); c.globalAlpha = 0.85;
      c.fillStyle = WARNA_LELEH[e.id] || '#FF8A6B';
      c.beginPath(); c.ellipse(cx, cy + 40, 20 + lel * 70, 6 + lel * 14, 0, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1 - lel * 0.7;
      gambarSprite(c, spr, cx, cy + lel * 20, 70, 1);
      c.restore();
      c.save(); c.translate(cx, cy - 46); c.fillStyle = '#1E3A4C'; c.font = '800 34px "Baloo 2", sans-serif'; c.textAlign = 'center'; c.fillText('?', 0, 0); c.restore();
    }
  };

  /* Lensa: butir hujan atau salju terlihat satu-satu (GDD bagian 6.7) */
  Kubah.prototype.isiLensa = function () {
    var n = this.nilai, id = n.snow > n.rain ? 'snow' : (n.rain > 0 ? 'rain' : null);
    if (!id || n.clouds <= 0) return null;
    return { id: id, nilai: n[id], hasil: Kuantitas.lensa(id, n[id]) };
  };
  var POLA = [[-22, -16], [18, -22], [-6, 14], [26, 10], [-30, 18], [4, -36], [-38, -6], [34, -6], [10, 34], [-18, 36], [38, 26], [-2, -6]];
  Kubah.prototype.gambarLensa = function (c) {
    var L = this.lensa, isi = this.isiLensa(), r = L.r, x = L.x, y = L.y;
    c.save();
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
    c.fillStyle = isi && isi.id === 'snow' ? '#7FA9D6' : '#DDF0FB'; c.fillRect(x - r, y - r, r * 2, r * 2);
    if (isi) {
      var spr = this.sprite[isi.id === 'snow' ? 'keping-salju' : 'tetes'], waktu = this.waktu;
      for (var i = 0; i < isi.hasil.n; i++) {
        var p = POLA[i];
        gambarSprite(c, spr, x + p[0], y + p[1] + Math.sin(waktu * 2 + i) * 2, isi.id === 'snow' ? 20 : 16, 1, isi.id === 'snow' ? waktu * 0.4 + i : 0);
      }
    }
    c.restore();
    /* gagang, cincin, dan lencana angka */
    c.save();
    c.translate(x + r * 0.62, y + r * 0.62); c.rotate(-Math.PI / 4);
    c.fillStyle = '#FF8A6B'; c.strokeStyle = '#1E3A4C'; c.lineWidth = 3;
    c.beginPath(); if (c.roundRect) c.roundRect(-13, 0, 26, 64, 13); else c.rect(-13, 0, 26, 64); c.fill(); c.stroke();
    c.restore();
    c.lineWidth = 18; c.strokeStyle = '#1E3A4C'; c.beginPath(); c.arc(x, y, r + 6, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 12; c.strokeStyle = '#FFC94A'; c.beginPath(); c.arc(x, y, r + 6, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 6; c.strokeStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.arc(x, y, r * 0.78, 3.6, 4.4); c.stroke();
    if (isi) {
      var bx = x + r * 0.78, by = y - r * 0.78;
      c.fillStyle = '#FF8A6B'; c.strokeStyle = '#1E3A4C'; c.lineWidth = 3;
      c.beginPath(); c.arc(bx, by, 20, 0, Math.PI * 2); c.fill(); c.stroke();
      c.fillStyle = '#1E3A4C'; c.font = '800 24px "Baloo 2", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(isi.hasil.n), bx, by + 2);
    }
  };

  Kubah.SLOT = SLOT;
  root.Kubah = Kubah;
})(window);
