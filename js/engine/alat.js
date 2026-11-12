/* Alat di Panel Kendali (GDD bagian 6.2 dan 6.3): Tombol Hitung untuk benda yang dihitung, Tuas Takar untuk benda yang ditakar.
   Tuas Takar bisa diseret, diketuk langsung di tabung (alternatif tanpa seret), atau digeser dengan panah keyboard.
   Mode salah (L1): Tombol Hitung untuk benda takar menghasilkan "1?", Tuas Takar untuk benda hitung terisi warna benda yang meleleh. */
(function (root) {
  var ZAT = {
    hujan: ['#8CC8F0', '#4FA3E0'], matahari: ['#FFE08F', '#FFC94A'], angin: ['#CCC3F5', '#A99BE8'],
    salju: ['#FFFFFF', '#DCD6E6'], kabut: ['#FBF8F2', '#CFD9E0'], air: ['#4FA3E0', '#2F7EBB'], pasir: ['#F5E6C4', '#EAD3A2'],
    koral: ['#FFB39E', '#FF8A6B'], biru: ['#8CC8F0', '#4FA3E0'], susu: ['#FFFFFF', '#E9E5FA']
  };
  /* warna leleh benda hitung di tabung (mode salah) */
  var LELEH = { clouds: 'susu', kites: 'koral', umbrellas: 'biru', boats: 'koral' };
  var noTabung = 0;
  /* kata zona di bawah alat; Mode Santai menambahkan artinya dalam bahasa Indonesia (GDD bagian 6.11) */
  function labelZona(id, nilai) {
    var kata = Kuantitas.kataZona(id, nilai), z = Kuantitas.zona(id, nilai).z;
    if (!root.Save || !Save.data.settings.santai) return UI.esc(kata);
    var indo = z.abu && Kuantitas.benda(id).jenis === 'hitung' ? STR.angkaIndo[nilai] : z.indo;
    return '<b>' + UI.esc(kata) + '</b><small>' + UI.esc(indo) + '</small>';
  }

  function tabungSvg(nilai, zat, id) {
    var y0 = 8, h = 118, yv = y0 + h - h * nilai / 100, c = ZAT[zat] || ZAT.hujan, z = Kuantitas.zona('rain', nilai).i;
    var t = '<defs><linearGradient id="isi-' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>' +
      '<clipPath id="klip-' + id + '"><rect x="26" y="' + y0 + '" width="38" height="' + h + '" rx="19"/></clipPath></defs>';
    /* pita zona di kiri tabung: 0 | 10-30 | 40-60 | 70-100 */
    [[0, 0], [10, 30], [40, 60], [70, 100]].forEach(function (r, i) {
      var ya = y0 + h - h * (r[1] + 5) / 100, yb = y0 + h - h * Math.max(r[0] - 5, 0) / 100;
      if (i === 0) { ya = y0 + h - 7; yb = y0 + h; }
      t += '<rect x="5" y="' + (ya + 1.5) + '" width="14" height="' + Math.max(yb - ya - 3, 4) + '" rx="5" fill="' + (i === z ? '#4FA3E0' : '#E3E8EC') + '" stroke="' + (i === z ? '#1E3A4C' : '#9FB0BC') + '" stroke-width="2"/>';
    });
    t += '<rect x="26" y="' + y0 + '" width="38" height="' + h + '" rx="19" fill="#F3F8FB"/>';
    t += '<g clip-path="url(#klip-' + id + ')"><rect x="26" y="' + yv + '" width="38" height="' + (y0 + h - yv) + '" fill="url(#isi-' + id + ')"/>';
    if (zat === 'angin' && nilai > 0) t += '<path d="M30,' + (yv + 14) + ' q8,-6 15,0 t15,0 M30,' + (yv + 30) + ' q8,-6 15,0 t15,0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".8"/>';
    if (zat === 'matahari' && nilai > 0) t += '<circle cx="40" cy="' + (yv + 16) + '" r="4" fill="#FFFFFF" opacity=".8"/><circle cx="52" cy="' + (yv + 34) + '" r="3" fill="#FFFFFF" opacity=".7"/>';
    if ((zat === 'hujan' || zat === 'air') && nilai > 0) t += '<path d="M28,' + (yv + 3) + ' q8,-5 17,0 t17,0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".75"/>';
    if (zat === 'pasir' && nilai > 0) t += '<path d="M34,' + (yv + 12) + ' h3 M48,' + (yv + 22) + ' h3 M40,' + (yv + 36) + ' h3" stroke="#CDB07A" stroke-width="3" stroke-linecap="round"/>';
    t += '</g>';
    t += '<rect x="26" y="' + y0 + '" width="38" height="' + h + '" rx="19" fill="none" stroke="#1E3A4C" stroke-width="3"/>';
    t += '<path d="M35,' + (y0 + 14) + ' L35,' + (y0 + h - 18) + '" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".7"/>';
    t += '<rect x="76" y="' + (y0 + 4) + '" width="8" height="' + (h - 8) + '" rx="4" fill="#C9D3DA" stroke="#1E3A4C" stroke-width="2"/>';
    t += '<g class="kenop-tuas"><circle cx="80" cy="' + yv + '" r="16" fill="#FFC94A" stroke="#1E3A4C" stroke-width="3"/><path d="M73,' + (yv - 3) + ' h14 M73,' + (yv + 3) + ' h14" stroke="#1E3A4C" stroke-width="2" stroke-linecap="round"/></g>';
    return t;
  }

  /* Tombol Hitung mendatar 320x110. o: x, y, w, id (benda), nilai, salah, onUbah(n, arah), onPenuh() */
  function TombolHitung(parent, o) {
    var b = Kuantitas.benda(o.id), el = U.h('div', 'alat hitung mendatar'), nilai = o.nilai || 0, api = { el: el, id: o.id, jenis: 'hitung' };
    el.style.cssText = 'left:' + o.x + 'px;top:' + o.y + 'px;width:' + (o.w || 320) + 'px;height:110px';
    el.dataset.id = 'alat-' + o.id;
    el.innerHTML = '<div class="kiri"><div class="nama" data-cek="nama ' + o.id + '">' + Seni.ikon('titik', 22) + '<span>' + UI.esc(b.jamak || b.kata) + '</span></div><div class="kata-zona"><span data-cek="zona ' + o.id + '"></span></div></div>' +
      '<div class="kanan"><div class="baris"></div><div class="zona"></div></div>';
    var baris = el.querySelector('.baris'), angka = U.h('div', 'angka');
    var kurang = Input.button(Seni.ikon('kurang', 30), 'kedua ikon statis', function () { ubah(-1); }, { aria: U.fmt(STR.alat.kurangiAria, { kata: b.jamak || b.kata }), id: 'kurang-' + o.id });
    var tambah = Input.button(Seni.ikon('tambah', 30), 'utama ikon statis tambah', function () { ubah(1); }, { aria: U.fmt(STR.alat.tambahAria, { kata: b.jamak || b.kata }), id: 'tambah-' + o.id });
    baris.appendChild(kurang); baris.appendChild(angka); baris.appendChild(tambah);
    var zonaEl = el.querySelector('.zona');
    [24, 24, 40, 40, 40].forEach(function (w) { zonaEl.insertAdjacentHTML('beforeend', '<i style="width:' + w + 'px"></i>'); });
    function gambar() {
      angka.textContent = o.salah && nilai ? nilai + '?' : nilai;
      angka.classList.toggle('ragu', !!(o.salah && nilai));
      var z = o.salah ? null : Kuantitas.zona(o.id, nilai);
      Array.prototype.forEach.call(zonaEl.children, function (seg, i) { seg.classList.toggle('on', !!z && i === z.i); });
      el.querySelector('.kata-zona span').innerHTML = o.salah ? '?' : labelZona(o.id, nilai);
      el.querySelector('.kata-zona span').classList.toggle('dua-baris', !o.salah && !!Save.data.settings.santai);
      kurang.disabled = nilai <= 0;
    }
    function ubah(arah) {
      var maks = o.salah ? 1 : KUANTITAS.maksHitung;
      if (arah > 0 && nilai >= maks) { UI.goyang(el); if (!o.salah) { Aud.sfx('bad'); if (o.onPenuh) o.onPenuh(); } return; }
      if (arah < 0 && nilai <= 0) return;
      nilai += arah;
      Aud.sfx(arah > 0 ? 'awan' : 'kurangi', nilai);
      if (!UI.kurangi && arah > 0) Tween.run(160, function (e, k) { angka.style.scale = (1 + Math.sin(k * Math.PI) * 0.18).toFixed(3); }, Ease.linear).then(function () { angka.style.scale = ''; });
      gambar();
      if (o.onUbah) o.onUbah(nilai, arah);
    }
    api.nilai = function () { return nilai; };
    api.atur = function (n) { nilai = n; gambar(); };
    api.tambah = tambah; api.kurang = kurang;
    api.ubah = ubah;
    api.hapus = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    gambar();
    parent.appendChild(el);
    return api;
  }

  /* Tuas Takar 104x220. o: x, y, w, id (benda), nilai, zat, salah, redup(), onUbah(v), onRedup() */
  function TuasTakar(parent, o) {
    var b = Kuantitas.benda(o.id), el = U.h('div', 'alat takar'), nilai = o.nilai || 0, api = { el: el, id: o.id, jenis: 'takar' }, id = 'tb' + (++noTabung);
    var zat = o.salah ? (LELEH[o.id] || 'koral') : (b.zat || 'hujan');
    el.style.cssText = 'left:' + o.x + 'px;top:' + o.y + 'px;width:' + (o.w || 104) + 'px;height:220px';
    el.dataset.id = 'alat-' + o.id;
    el.innerHTML = '<div class="kepala" data-cek="nama ' + o.id + '">' + UI.esc(b.jamak || b.kata) + '</div>' +
      '<div class="tuas" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><svg class="tabung" width="96" height="129" viewBox="0 0 100 134"></svg></div>' +
      '<div class="kata-zona"><span data-cek="zona ' + o.id + '"></span></div>';
    var tuas = el.querySelector('.tuas'), svg = el.querySelector('svg');
    tuas.setAttribute('aria-label', b.kata || b.jamak);
    function gambar() {
      svg.innerHTML = tabungSvg(nilai, zat, id);
      el.querySelector('.kata-zona span').innerHTML = o.salah ? '?' : labelZona(o.id, nilai);
      el.querySelector('.kata-zona span').classList.toggle('dua-baris', !o.salah && !!Save.data.settings.santai);
      tuas.setAttribute('aria-valuenow', nilai);
      tuas.setAttribute('aria-valuetext', o.salah ? '?' : Kuantitas.kataZona(o.id, nilai));
      el.classList.toggle('redup', !!(o.redup && o.redup()));
    }
    function setel(v) {
      if (!isFinite(v)) return;
      v = U.clamp(Math.round(v / 10) * 10, 0, 100);
      if (v === nilai) return;
      var naik = v > nilai;
      nilai = v;
      Aud.sfx('alir', v / 10);
      gambar();
      if (o.onUbah) o.onUbah(nilai, naik ? 1 : -1);
    }
    /* letak tabung dibaca dari ukurannya yang tampil (Mode Santai memakai tabung lebih pendek); dua sudut diubah ke koordinat
       panggung supaya benar juga saat panggung diputar di HP tegak */
    function nilaiDariY(clientX, clientY) {
      var p = Stage.toLocal(clientX, clientY), r = svg.getBoundingClientRect(), a = Stage.toLocal(r.left, r.top), c = Stage.toLocal(r.right, r.bottom);
      var y0 = Math.min(a.y, c.y), sk = Math.abs(c.y - a.y) / 134, atas = y0 + 8 * sk, tinggi = 118 * sk;
      return (atas + tinggi - p.y) / tinggi * 100;
    }
    function boleh() {
      if (o.redup && o.redup()) { Aud.sfx('gembok'); UI.goyang(el); if (o.onRedup) o.onRedup(); return false; }
      return true;
    }
    tuas.addEventListener('pointerdown', function (e) {
      Aud.init();
      if (!boleh()) return;
      tuas.setPointerCapture(e.pointerId);
      el.classList.add('dipegang');
      setel(nilaiDariY(e.clientX, e.clientY));
      function gerak(ev) { setel(nilaiDariY(ev.clientX, ev.clientY)); }
      function lepas() { el.classList.remove('dipegang'); tuas.removeEventListener('pointermove', gerak); tuas.removeEventListener('pointerup', lepas); tuas.removeEventListener('pointercancel', lepas); }
      tuas.addEventListener('pointermove', gerak);
      tuas.addEventListener('pointerup', lepas);
      tuas.addEventListener('pointercancel', lepas);
      e.preventDefault();
    });
    /* panah keyboard di dalam tuas tidak memindah fokus antartombol */
    tuas.addEventListener('keydown', function (e) {
      var k = e.key, d = 0;
      if (k === 'ArrowUp' || k === 'ArrowRight') d = 10;
      else if (k === 'ArrowDown' || k === 'ArrowLeft') d = -10;
      else if (k === 'Home') d = -100;
      else if (k === 'End') d = 100;
      else return;
      e.preventDefault(); e.stopPropagation();
      Aud.init();
      if (!boleh()) return;
      setel(nilai + d);
    });
    api.nilai = function () { return nilai; };
    api.atur = function (v) { nilai = v; gambar(); };
    api.setel = setel;
    api.segar = gambar;
    api.tuas = tuas;
    api.hapus = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    gambar();
    parent.appendChild(el);
    return api;
  }

  root.Alat = { TombolHitung: TombolHitung, TuasTakar: TuasTakar, LELEH: LELEH };
})(window);
