/* Hasil Belajarku dan Catatan untuk Guru (GDD bagian 4 dan 8; CLAUDE.md bagian 5). Pola dari gim 477.
   Hasil Belajarku: 7 keterampilan dalam bahasa anak dengan status, jumlah fenomena dan kata Jurnal.
   Catatan untuk Guru: dibuka dengan menahan tombol 2 detik (supaya tidak terbuka tak sengaja). Tanpa nama dan tanpa data pribadi. */
(function (root) {
  var TAG = ['hitung-takar', 'few-little', 'many-much', 'a-lot-of', 'some-any', 'there-is-are', 'simak-takaran'];
  var esc = function (s) { return UI.esc(s); };

  /* tombol yang harus ditahan 2 detik; ketuk biasa memberi petunjuk. Di mode uji klik biasa langsung membuka. */
  function tombolTahan(label, cls, onTahan, o) {
    var b = Input.button('<span class="isi-tahan">' + label + '</span><i class="cincin-tahan"></i>', cls + ' tahan', null, o), t = 0;
    function mulai() { clearTimeout(t); b.classList.add('menahan'); t = setTimeout(function () { b.classList.remove('menahan'); onTahan(); }, U.TEST ? 50 : 2000); }
    function batal() { clearTimeout(t); b.classList.remove('menahan'); }
    b.addEventListener('pointerdown', mulai);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { b.addEventListener(n, batal); });
    b.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); mulai(); } });
    b.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') batal(); });
    b.addEventListener('click', function () { if (U.TEST) onTahan(); else if (!b.classList.contains('menahan')) UI.toast(STR.hasilBelajar.tahanPetunjuk); });
    return b;
  }

  function guru() {
    var G = STR.guru, o = UI.overlay(G.judul, 'panel-guru'), baris = '';
    TAG.forEach(function (t) {
      var k = Save.data.keterampilan[t], st = Save.status(t);
      baris += '<tr><td>' + esc(G.nama[t]) + '</td><td class="status-' + st + '">' + esc(G.status[st]) + '</td><td>' + (k ? k.benarAwal + ' / ' + k.kesempatan : '-') + '</td><td>' + (k ? k.tanpaLekuk : '-') + '</td></tr>';
    });
    /* saran tindak lanjut untuk TP yang sudah dimainkan tetapi paling rendah ketepatannya */
    var lemah = TAG.filter(function (t) { var k = Save.data.keterampilan[t]; return k && k.kesempatan && Save.status(t) !== 'dikuasai'; })
      .sort(function (a, b) { var x = Save.data.keterampilan[a], y = Save.data.keterampilan[b]; return x.benarAwal / x.kesempatan - y.benarAwal / y.kesempatan; })[0];
    var M = Save.data.miskonsepsi, mk = Object.keys(M).filter(function (x) { return G.mis[x]; }).sort(function (a, b) { return M[b] - M[a]; }).slice(0, 4), p3 = 0;
    Object.keys(Save.data.level).forEach(function (n) { p3 += Save.data.level[n].petunjuk3 || 0; });
    var selesai = [1, 2, 3, 4, 5, 6].filter(function (n) { return Save.selesai(n); }).map(function (n) { return 'L' + n + ' (' + U.fmt(G.bintang, { n: Save.data.level[n].bintang }) + ')'; }).join(', ');
    o.body.insertAdjacentHTML('beforeend', '<div class="teks-guru" data-cek="catatan guru">' +
      '<table><thead><tr><th>' + esc(G.kolomTag) + '</th><th>' + esc(G.kolomStatus) + '</th><th>' + esc(G.kolomBukti) + '</th><th>' + esc(G.kolomLekuk) + '</th></tr></thead><tbody>' + baris + '</tbody></table>' +
      (mk.length ? '<p>' + esc(U.fmt(G.misJudul, { daftar: mk.map(function (x) { return G.mis[x] + ' (' + M[x] + ')'; }).join(', ') })) + '</p>' : '<p>' + esc(G.misKosong) + '</p>') +
      (lemah ? '<p><b>' + esc(U.fmt(G.saranJudul, { tp: G.nama[lemah].split(' ')[0] })) + '</b>' + esc(G.saran[lemah]) + '</p>' : '') +
      '<p>' + esc(U.fmt(G.level, { daftar: selesai || G.levelBelum })) + ' ' + esc(U.fmt(G.petunjuk3, { n: p3 })) + ' ' +
      esc(U.fmt(G.fenomena, { n: Save.data.fenomena.length })) + ' ' + esc(U.fmt(G.santai, { s: Save.data.settings.santai ? STR.pengaturan.nyala : STR.pengaturan.mati })) + ' ' + esc(U.fmt(G.lama, { m: Math.round(Save.data.detik / 60) })) + '</p>' +
      '<p class="kecil">' + esc(G.aturan) + ' ' + esc(G.zona) + '</p><p class="kecil">' + esc(G.privasi) + ' ' + esc(G.cp) + '</p></div>');
    UI.tombolTutup(o);
    return o;
  }

  function hasilBelajar() {
    var H = STR.hasilBelajar, o = UI.overlay(H.judul, 'panel-belajar'), isi = '';
    TAG.forEach(function (t) {
      var st = Save.status(t);
      isi += '<div class="baris-belajar status-' + st + '">' + Seni.ikon(st === 'dikuasai' ? 'bintang' : 'titik1', 26, st === 'dikuasai' ? undefined : false) +
        '<span class="cap-belajar">' + esc(H.status[st]) + '</span><span class="teks-belajar">' + esc(STR.keterampilan[t]) + '</span></div>';
    });
    var kata = BENDA.daftar.filter(function (b) { return Save.punyaKata(b.id); }).length;
    o.body.insertAdjacentHTML('beforeend', '<div class="daftar-belajar" data-cek="hasil belajar">' + isi + '</div>' +
      '<p class="ringkas-belajar" data-cek="ringkas belajar">' + Seni.ikon('jurnal', 26) + esc(U.fmt(H.ringkas, { f: Save.data.fenomena.length, k: kata })) + '</p>');
    var baris = U.h('div', 'baris-tombol');
    baris.appendChild(tombolTahan(esc(H.guruTahan), 'ketiga lebar', guru, { id: 'guru', aria: H.guruTahan, w: 480 }));
    var tutup = Input.button(esc(STR.tombol.tutup), 'kedua lebar', function () { o.close(); }, { id: 'tutup' });
    baris.appendChild(tutup);
    o.body.appendChild(baris);
    setTimeout(function () { tutup.focus({ preventScroll: true }); }, 30);
    return o;
  }

  UI.tombolTahan = tombolTahan;
  UI.guru = guru;
  UI.hasilBelajar = hasilBelajar;
})(window);
