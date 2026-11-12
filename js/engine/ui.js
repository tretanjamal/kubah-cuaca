/* UI: komponen bersama Kubah Cuaca. Pola overlay, sakelar, Pengaturan, tangan penunjuk, dan partikel dari Kafe Cilik;
   tampilan mengikuti GDD bagian 12 (pelat enamel). */
(function (root) {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function stage() { return document.getElementById('stage'); }
  /* titik di panggung untuk elemen atau {x, y}; fy = letak vertikal (0 atas, 1 bawah) */
  function titik(sasaran, fy) {
    if (!sasaran) return null;
    if (sasaran.x != null && !sasaran.getBoundingClientRect) return sasaran;
    var r = sasaran.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return Stage.toLocal(r.left + r.width / 2, r.top + r.height * (fy == null ? 0.5 : fy));
  }

  var UI = {
    prefersReduced: !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches),
    kurangi: false,
    esc: esc,
    titik: titik,
    applySettings: function () {
      var s = Save.data.settings;
      Aud.setMuted(s.senyap); Aud.setBus('musik', s.musik); Aud.setBus('sfx', s.efek); Aud.setBus('cuaca', s.cuaca);
      UI.kurangi = s.kurangi || UI.prefersReduced;
      document.body.classList.toggle('kurangi-gerak', UI.kurangi);
      document.body.classList.toggle('mode-santai', !!s.santai);
      /* mode uji dipercepat, kecuali ?lambat=1 (tangkapan layar animasi) */
      Tween.speed = UI.kurangi ? 0.4 : (U.TEST && !/[?&]lambat=1/.test(location.search) ? 0.3 : 1);
    },
    ikon: function (nama, ukuran, arg) { return Seni.ikon(nama, ukuran || 38, arg); },
    tombolIkon: function (nama, aria, onTap, o) {
      o = o || {}; o.aria = aria;
      return Input.button(UI.ikon(nama, o.ukuran || 38), 'ketiga ikon ' + (o.cls || ''), onTap, o);
    },
    adaSuara: function (lang) { return Voice.available() && !!Voice.voice(lang, 'w'); },
    /* arahan bahasa Indonesia dibacakan bila diizinkan; tanpa suara id-ID tidak ada jeda kosong */
    bacakan: function (teks, paksa) {
      if (!teks || (!paksa && !Save.data.settings.bacakan) || !UI.adaSuara('id-ID')) return Promise.resolve();
      return Voice.say(teks, { lang: 'id-ID', tokoh: 'kumu' });
    },

    /* ikon pojok kanan atas: suara, layar penuh, pengaturan. Mengembalikan fungsi pembersih. */
    pojok: function (parent) {
      var s = Save.data.settings, x = 1196, fs = null;
      var atur = UI.tombolIkon('atur', STR.ikon.pengaturan, function () { UI.pengaturan(); }, { x: x, y: 18, id: 'pengaturan' });
      if (FS.supported()) {
        x -= 78;
        fs = UI.tombolIkon('penuh', STR.ikon.layarPenuh, function () { FS.toggle(function () { UI.toast(STR.ikon.fsDitolak); }); }, { x: x, y: 18, id: 'layar-penuh' });
      }
      x -= 78;
      var snd = UI.tombolIkon(s.senyap ? 'senyap' : 'suara', '', function () { s.senyap = !s.senyap; Save.save(); UI.applySettings(); segar(); }, { x: x, y: 18, id: 'suara' });
      function segar() {
        Input.label(snd, UI.ikon(s.senyap ? 'senyap' : 'suara'));
        snd.setAttribute('aria-label', s.senyap ? STR.ikon.suaraMati : STR.ikon.suaraNyala);
        if (fs) fs.setAttribute('aria-label', FS.isFull() ? STR.ikon.keluarPenuh : STR.ikon.layarPenuh);
      }
      [snd, fs, atur].forEach(function (b) { if (b) parent.appendChild(b); });
      segar();
      FS.onChange(segar);
      return function () { FS.offChange(segar); };
    },

    /* panel modal pelat enamel. Mengembalikan {el, body, panel, close} */
    overlay: function (judul, cls) {
      var ov = U.h('div', 'overlay'), panel = U.h('div', 'panel ' + (cls || '')), opener = document.activeElement;
      panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', judul);
      document.getElementById('scene-root').inert = true;
      document.querySelectorAll('.overlay').forEach(function (x) { x.inert = true; });
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      panel.innerHTML = '<div class="pita-kepala">' + esc(judul) + '</div>';
      var body = U.h('div', 'isi-panel'); panel.appendChild(body); ov.appendChild(panel);
      stage().appendChild(ov);
      UI.sembunyiTangan(true);
      if (!UI.kurangi) panel.classList.add('panel-muncul');
      var api = {
        el: ov, body: body, panel: panel,
        close: function () {
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          var rest = document.querySelectorAll('.overlay');
          if (rest.length) rest[rest.length - 1].inert = false; else document.getElementById('scene-root').inert = false;
          if (opener && opener.isConnected && !opener.disabled) opener.focus({ preventScroll: true });
          if (api.onClose) api.onClose();
        }
      };
      return api;
    },
    closeOverlays: function () {
      document.querySelectorAll('.overlay, .toast').forEach(function (x) { x.parentNode.removeChild(x); });
      UI._p.list = [];
      document.getElementById('scene-root').inert = false;
      UI.idle.fn = null;
      UI.sembunyiTangan(true);
    },
    tombolTutup: function (o, teks) {
      var b = Input.button(teks || STR.tombol.tutup, 'kedua lebar', function () { o.close(); }, { id: 'tutup' });
      o.body.appendChild(b);
      setTimeout(function () { b.focus({ preventScroll: true }); }, 30);
      return b;
    },
    /* sakelar Nyala/Mati dengan label teks (bukan hanya warna) */
    barisSakelar: function (label, get, set, id, catatan, nonaktif) {
      var row = U.h('div', 'baris-sakelar');
      row.innerHTML = '<span class="label-sakelar">' + esc(label) + (catatan ? '<small>' + esc(catatan) + '</small>' : '') + '</span>';
      var b = Input.button('', 'sakelar', function () { set(!get()); cat(); }, { id: id, aria: label });
      function cat() {
        var on = get();
        b.classList.toggle('nyala', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        Input.label(b, '<span class="kenop"></span><span class="teks-sakelar">' + (on ? STR.pengaturan.nyala : STR.pengaturan.mati) + '</span>');
      }
      if (nonaktif) b.disabled = true;
      cat(); row.appendChild(b);
      return row;
    },
    pengaturan: function (onClose) {
      var T = STR.pengaturan, s = Save.data.settings, o = UI.overlay(T.judul, 'panel-pengaturan');
      var grid = U.h('div', 'grid-sakelar');
      function simpan() { Save.save(); UI.applySettings(); }
      function baris(label, kunci, id, catatan, efek) {
        grid.appendChild(UI.barisSakelar(label, function () { return s[kunci]; }, function (v) { s[kunci] = v; simpan(); if (efek) efek(v); }, id, catatan));
      }
      baris(T.musik, 'musik', 'sw-musik');
      baris(T.efek, 'efek', 'sw-efek');
      baris(T.cuaca, 'cuaca', 'sw-cuaca', T.cuacaCatatan);
      baris(T.suara, 'suara', 'sw-suara', T.suaraCatatan, function (v) { if (!v) Voice.stop(); });
      baris(T.bacakan, 'bacakan', 'sw-bacakan');
      baris(T.santai, 'santai', 'sw-santai', T.santaiCatatan);
      grid.appendChild(UI.barisSakelar(T.kurangi, function () { return s.kurangi || UI.prefersReduced; }, function (v) { s.kurangi = v; simpan(); }, 'sw-kurangi', UI.prefersReduced ? T.kurangiCatatan : '', UI.prefersReduced));
      var row = U.h('div', 'baris-sakelar'), yakin = false;
      row.innerHTML = '<span class="label-sakelar">' + esc(T.muridBaru) + '<small>' + esc(T.muridBaruCatatan) + '</small></span>';
      var hapus = Input.button(T.hapus, 'ketiga hapus', function () {
        if (!yakin) { yakin = true; Input.label(hapus, T.yakin); return; }
        Save.newStudent(); UI.applySettings(); Scenes.go('judul');
      }, { id: 'murid-baru' });
      row.appendChild(hapus); grid.appendChild(row);
      o.body.appendChild(grid);
      UI.tombolTutup(o);
      o.onClose = onClose;
      return o;
    },
    /* menu jeda: permainan dan suara berhenti selama panel terbuka */
    jeda: function (opsi) {
      opsi = opsi || {};
      var T = STR.jeda, o = UI.overlay(T.judul, 'panel-jeda'), keluar = false;
      Voice.jeda(); Tween.paused = true;
      function tombol(label, cls, id, fn) { var b = Input.button(label, cls + ' lebar', fn, { id: id }); o.body.appendChild(b); return b; }
      var lanjut = tombol(T.lanjut, 'utama', 'jeda-lanjut', function () { o.close(); });
      if (opsi.ulangi) tombol(T.ulangi, 'kedua', 'jeda-ulangi', function () { keluar = true; o.close(); opsi.ulangi(); });
      tombol(T.pengaturan, 'ketiga', 'jeda-pengaturan', function () { UI.pengaturan(); });
      tombol(T.stasiun, 'ketiga', 'jeda-stasiun', function () { keluar = true; o.close(); Scenes.go('stasiun'); });
      tombol(T.beranda, 'ketiga', 'jeda-beranda', function () { keluar = true; o.close(); Scenes.go('judul'); });
      o.onClose = function () { Tween.paused = false; if (!keluar) Voice.lanjutTertahan(); };
      setTimeout(function () { lanjut.focus({ preventScroll: true }); }, 30);
      return o;
    },
    /* Informasi dan Referensi bertab; Pengembang berisi foto dan data yang sama dengan gim lain kreator. Tanpa tautan keluar. */
    info: function (jenis) {
      var D = STR.info[jenis], o = UI.overlay(D.judul, 'panel-info panel-' + jenis), HAL = null;
      function daftar(a, tag) { return '<' + (tag || 'ul') + ' class="daftar-info">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + (tag || 'ul') + '>'; }
      function baris(a) { return '<div class="baris-info">' + a.map(function (r) { return '<div><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>'; }
      if (jenis === 'info') HAL = {
        tujuan: function () { return '<p class="sorot-info">' + esc(D.pengantar) + '</p><p class="tujuan-info">' + esc(D.tujuan) + '</p><p class="kecil-info">' + esc(D.meta) + '</p>'; },
        cara: function () { return daftar(D.cara, 'ol') + '<p class="kecil-info">' + esc(D.caraCatatan) + '</p>'; }
      };
      if (jenis === 'referensi') HAL = {
        sumber: function () {
          return '<p><b>' + esc(D.sumberPengantar) + '</b></p>' + D.sumber.map(function (r) { return '<p class="pustaka">' + esc(r[0]) + ' <i>' + esc(r[1]) + '</i> ' + esc(r[2]) + '</p>'; }).join('') +
            '<p>' + esc(D.topik) + '</p><p class="kecil-info">' + esc(D.huruf) + '</p>';
        },
        ka: function () { return '<p>' + esc(D.kaPengantar) + '</p>' + baris(D.ka); }
      };
      if (!HAL) {
        /* beberapa pengembang, digeser dengan tombol panah kiri dan kanan */
        var P = D.profil, ke = 0, wadah = U.h('div', 'geser-pengembang'), kartu = U.h('div', 'kartu-pengembang'), urutan = U.h('p', 'urutan-pengembang');
        kartu.setAttribute('data-cek', 'info pengembang');
        function tampil(i) {
          ke = (i + P.length) % P.length;
          var p = P[ke], foto = Seni.aset(p.foto);
          kartu.innerHTML = '<div class="foto-pengembang">' + (foto ? '<img src="' + foto + '" alt="' + esc(p.fotoAlt) + '">' : '') + '</div>' +
            '<div class="data-pengembang"><b class="nama-pengembang">' + esc(p.nama) + '</b>' + p.baris.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '<span>' + esc(D.tahun) + '</span></div>' +
            (p.daftar ? '<div class="prestasi"><b>' + esc(p.daftarJudul) + '</b>' + daftar(p.daftar) + '</div>' : '');
          kartu.classList.toggle('tanpa-daftar', !p.daftar);
          urutan.textContent = U.fmt(D.urutan, { n: ke + 1, t: P.length });
          if (!UI.kurangi) UI.muncul(kartu, 260);
        }
        var kiri = UI.tombolIkon('lanjut', D.sebelumnya, function () { tampil(ke - 1); }, { id: 'pengembang-kiri', cls: 'panah-kiri' });
        var kanan = UI.tombolIkon('lanjut', D.berikutnya, function () { tampil(ke + 1); }, { id: 'pengembang-kanan' });
        [kiri, kanan].forEach(function (b) { b.classList.add('statis'); });
        wadah.appendChild(kiri); wadah.appendChild(kartu); wadah.appendChild(kanan);
        o.body.appendChild(wadah); o.body.appendChild(urutan);
        tampil(0);
        UI.tombolTutup(o);
        return o;
      }
      var tabs = U.h('div', 'tab-info'), isi = U.h('div', 'teks-info');
      isi.setAttribute('data-cek', 'info ' + jenis);
      var pilih = function (k) {
        isi.innerHTML = HAL[k]();
        Array.prototype.forEach.call(tabs.children, function (b) { var on = b.dataset.id === 'tab-' + k; b.classList.toggle('aktif', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      };
      Object.keys(HAL).forEach(function (k) {
        var b = Input.button(esc(D.tab[k]), 'ketiga tab', function () { pilih(k); }, { id: 'tab-' + k });
        b.setAttribute('role', 'tab');
        tabs.appendChild(b);
      });
      tabs.setAttribute('role', 'tablist');
      var tutup = Input.button(esc(STR.tombol.tutup), 'kedua tab', function () { o.close(); }, { id: 'tutup' });
      tabs.appendChild(tutup);
      o.body.appendChild(tabs); o.body.appendChild(isi);
      pilih(Object.keys(HAL)[0]);
      setTimeout(function () { tutup.focus({ preventScroll: true }); }, 30);
      return o;
    },
    /* teks yang meluap dari kotaknya: elemen bertanda data-cek dan teks SVG bertanda data-maxw (dipakai uji) */
    cekLuap: function () {
      var hasil = [];
      Array.prototype.forEach.call(document.querySelectorAll('#stage [data-cek], #stage .tombol .badan'), function (el) {
        if (!el.offsetParent) return;
        if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 8) hasil.push((el.getAttribute('data-cek') || el.textContent.trim().slice(0, 30)) + ': ' + el.scrollWidth + 'x' + el.scrollHeight + ' > ' + el.clientWidth + 'x' + el.clientHeight);
      });
      Array.prototype.forEach.call(document.querySelectorAll('#stage text[data-maxw]'), function (t) {
        var w = t.getComputedTextLength(), m = +t.getAttribute('data-maxw');
        if (w > m) hasil.push('svg "' + t.textContent + '": ' + Math.round(w) + ' > ' + m);
      });
      return hasil;
    },
    toast: function (text) {
      document.querySelectorAll('.toast').forEach(function (x) { x.parentNode.removeChild(x); });
      var t = U.h('div', 'toast', esc(text));
      t.setAttribute('role', 'status');
      stage().appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
    },

    /* tangan penunjuk: ujung telunjuk di titik sasaran. sumber 'idle' hilang saat murid bergerak. */
    tangan: null, sumberTangan: '',
    tunjuk: function (sasaran, o) {
      o = o || {};
      var p = titik(sasaran, o.fy);
      if (!p) return;
      if (!UI.tangan) {
        UI.tangan = U.h('div', 'tangan-penunjuk', Seni.svg(90, 110, Seni.tangan(), { vb: '-30 -20 90 110' }));
        UI.tangan.setAttribute('aria-hidden', 'true');
      }
      stage().appendChild(UI.tangan);
      UI.letakTangan(p.x, p.y, o.geser);
      UI.tangan.classList.add('tampil');
      UI.sumberTangan = o.sumber || 'petunjuk';
    },
    /* ujung jari di (x, y); geser: 'atas' memperagakan tarikan tuas ke atas */
    letakTangan: function (x, y, geser) {
      var t = UI.tangan;
      if (!t) return;
      t.style.left = Math.round(x - 30) + 'px';
      t.style.top = Math.round(y - 20) + 'px';
      t.classList.toggle('tarik', geser === 'atas');
      t.classList.toggle('balik', x > 1150);
    },
    sembunyiTangan: function (semua) {
      if (!UI.tangan) return;
      if (semua || UI.sumberTangan === 'idle') { UI.tangan.classList.remove('tampil'); UI.sumberTangan = ''; }
    },
    /* isyarat bila 8 detik tanpa aksi (CLAUDE.md bagian 4). fn mengembalikan elemen (atau [elemen, opsi]) yang ditunjuk, atau null. */
    idle: {
      fn: null, t: 0,
      atur: function (fn) { UI.idle.fn = fn; UI.idle.reset(); },
      reset: function () { UI.idle.t = performance.now(); UI.sembunyiTangan(false); },
      cek: function () {
        var I = UI.idle;
        if (!I.fn || Loop.paused || Tween.paused || Scenes.busy || document.querySelector('.overlay')) return;
        if (Voice.sibuk()) { I.t = performance.now(); return; }
        if (UI.sumberTangan === 'petunjuk') return;
        if (performance.now() - I.t > 8000 && UI.sumberTangan !== 'idle') {
          var el = I.fn();
          if (Array.isArray(el)) { var o = el[1] || {}; o.sumber = 'idle'; UI.tunjuk(el[0], o); }
          else if (el) UI.tunjuk(el, { sumber: 'idle' });
        }
      }
    },

    /* partikel kecil saat benar: tetes embun dan bintang kecil, satu kanvas untuk semua */
    _p: { kanvas: null, ctx: null, list: [], jalan: false },
    ledak: function (x, y, n) {
      if (UI.kurangi) return;
      var P = UI._p, warna = ['#FFC94A', '#8CC8F0', '#6CC07A', '#FF8A6B', '#FBF8F2'];
      if (!P.kanvas) {
        P.kanvas = U.h('canvas', 'kanvas-partikel'); P.kanvas.width = 1280; P.kanvas.height = 720;
        P.ctx = P.kanvas.getContext('2d');
      }
      if (!P.kanvas.parentNode) stage().appendChild(P.kanvas);
      for (var i = 0; i < (n || 14); i++) {
        var a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 240;
        P.list.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 180, umur: 0, maks: 0.7 + Math.random() * 0.4, r: 5 + Math.random() * 5, w: warna[i % warna.length], b: i % 3 === 0 });
      }
      if (P.jalan) return;
      P.jalan = true;
      var akhir = performance.now();
      (function tick(ts) {
        var dt = Math.min(0.05, (ts - akhir) / 1000); akhir = ts;
        var c = P.ctx;
        c.clearRect(0, 0, 1280, 720);
        if (!Loop.paused) P.list.forEach(function (q) { q.umur += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 520 * dt; });
        P.list = P.list.filter(function (q) { return q.umur < q.maks; });
        P.list.forEach(function (q) {
          var k = 1 - q.umur / q.maks;
          c.globalAlpha = Math.min(1, k * 1.5);
          c.fillStyle = q.w; c.strokeStyle = '#1E3A4C'; c.lineWidth = 2.5;
          c.beginPath();
          if (q.b) { for (var j = 0; j < 10; j++) { var rr = j % 2 ? q.r * 0.45 : q.r * 1.2, aa = j * Math.PI / 5 - Math.PI / 2; c.lineTo(q.x + rr * Math.cos(aa), q.y + rr * Math.sin(aa)); } c.closePath(); }
          else { c.moveTo(q.x, q.y - q.r * 1.3); c.quadraticCurveTo(q.x + q.r, q.y, q.x, q.y + q.r * 0.8); c.quadraticCurveTo(q.x - q.r, q.y, q.x, q.y - q.r * 1.3); }
          c.fill(); c.stroke();
        });
        c.globalAlpha = 1;
        if (P.list.length) requestAnimationFrame(tick); else { P.jalan = false; c.clearRect(0, 0, 1280, 720); }
      })(akhir);
    },
    /* angka menghitung naik dengan bunyi detak */
    hitungNaik: function (el, dari, ke, ms) {
      var lalu = dari;
      el.textContent = dari;
      return Tween.run(ms || 700, function (e) {
        var v = Math.round(dari + (ke - dari) * e);
        if (v !== lalu) { lalu = v; el.textContent = v; Aud.sfx('tick', 1 + e * 0.5); }
      }, Ease.easeOutCubic).then(function () { el.textContent = ke; });
    },
    /* goyang lembut untuk jawaban salah */
    goyang: function (el) {
      if (UI.kurangi || !el) return Promise.resolve();
      return Tween.run(380, function (e, k) { el.style.translate = (Math.sin(k * Math.PI * 5) * 9 * (1 - k)).toFixed(1) + 'px 0'; }, Ease.linear).then(function () { el.style.translate = ''; });
    },
    /* lompatan kecil untuk jawaban benar */
    lompat: function (el) {
      if (UI.kurangi || !el) return Promise.resolve();
      return Tween.run(420, function (e, k) { el.style.translate = '0 ' + (-Math.sin(k * Math.PI) * 18).toFixed(1) + 'px'; el.style.scale = (1 + Math.sin(k * Math.PI) * 0.08).toFixed(3); }, Ease.linear)
        .then(function () { el.style.translate = ''; el.style.scale = ''; });
    },
    /* muncul dengan easeOutBack */
    muncul: function (el, ms) {
      if (UI.kurangi || !el) { if (el) { el.style.opacity = ''; el.style.scale = ''; } return Promise.resolve(); }
      el.style.opacity = 0;
      return Tween.run(ms || 320, function (e) { el.style.opacity = Math.min(1, e * 2); el.style.scale = (0.5 + 0.5 * e).toFixed(3); }, Ease.easeOutBack)
        .then(function () { el.style.opacity = ''; el.style.scale = ''; });
    }
  };
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var ovs = document.querySelectorAll('.overlay'), top = ovs[ovs.length - 1];
    var b = top && (top.querySelector('.panel > .isi-panel [data-id="tutup"], [data-id="jeda-lanjut"]') || top.querySelector('[data-id="tutup"]'));
    if (b) { e.preventDefault(); b.click(); }
  });
  document.addEventListener('pointerdown', function () { UI.idle.reset(); }, true);
  document.addEventListener('keydown', function () { UI.idle.reset(); }, true);
  setInterval(function () { UI.idle.cek(); }, 500);
  root.UI = UI;
})(window);
