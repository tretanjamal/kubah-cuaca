/* Kartu Kata Berlekuk (GDD bagian 6.8; mockup komponen.html): kartu di Rak Kartu (panel kanan) dan Rel Kalimat di Papan.
   Ketuk kartu = kartu masuk ke lekuk jenisnya (alternatif tanpa seret); seret kartu ke papan juga bisa; Enter untuk keyboard.
   Ketuk kartu di rel = kartu kembali ke rak. Bila lekuk tampil, kartu yang lekuknya tidak memuat alur kata benda ditolak.
   Kelompok warna pita: hitung koral, takar biru, serba hijau, kerja lavender, benda kuning, jawab (Yes/No) mint. */
(function (root) {
  var WARNA = { hitung: ['#FF8A6B', '#FFE1D8'], takar: ['#4FA3E0', '#D6ECFA'], serba: ['#6CC07A', '#D9F1DC'], kerja: ['#A99BE8', '#E9E5FA'], benda: ['#FFC94A', '#FFF1C9'], jawab: ['#8FD3BC', '#CFEFE4'] };
  var KERJA = ['is', 'are', "isn't", "aren't"], YN = ['Yes,', 'No,'];
  var H = 60, BUMP = 12;

  function kelompok(kata) {
    if (KERJA.indexOf(kata) >= 0) return 'kerja';
    if (YN.indexOf(kata) >= 0) return 'jawab';
    if (['a few', 'many', 'a', 'an', 'one'].indexOf(kata) >= 0) return 'hitung';
    if (['a little', 'much'].indexOf(kata) >= 0) return 'takar';
    if (['some', 'any', 'no', 'a lot of'].indexOf(kata) >= 0) return 'serba';
    return 'benda';
  }
  function slotUntuk(kata) { var k = kelompok(kata); return k === 'kerja' ? 'kerja' : k === 'jawab' ? 'yn' : k === 'benda' ? 'benda' : 'kuant'; }
  /* nama lekuk: satu | dua | gel | is (satu+gel) | serba (dua+gel) | null */
  function lekukKata(kata) { return kelompok(kata) === 'benda' ? Tugas.alur(kata) : Tugas.namaLekuk(kata); }
  /* penanda unik: "No," (jawaban) berbeda dari "no" (kuantitas) */
  function slug(kata) { return kata.toLowerCase().replace(/,/g, ' jawab').replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '-'); }

  var ukur = null;
  function lebar(kata) {
    if (!ukur) ukur = document.createElement('canvas').getContext('2d');
    ukur.font = "700 26px Andika, 'Trebuchet MS', sans-serif";
    return Math.max(70, Math.ceil(ukur.measureText(kata).width) + 32);
  }
  function jalurLekuk(jenis, x, y) {
    if (jenis === 'satu') return 'M' + (x - 9) + ',' + y + ' a9,9 0 0,0 18,0';
    if (jenis === 'dua') return 'M' + (x - 20) + ',' + y + ' a8,8 0 0,0 16,0 M' + (x + 4) + ',' + y + ' a8,8 0 0,0 16,0';
    if (jenis === 'gel') return 'M' + (x - 22) + ',' + y + ' q5.5,10 11,0 t11,0 t11,0 t11,0';
    return '';
  }
  function bentukLekuk(nama, cx, y) {
    if (nama === 'is') return jalurLekuk('satu', cx - 22, y) + ' ' + jalurLekuk('gel', cx + 22, y);
    if (nama === 'serba') return jalurLekuk('dua', cx - 24, y) + ' ' + jalurLekuk('gel', cx + 26, y);
    return jalurLekuk(nama, cx, y);
  }
  /* SVG kartu: pelat putih, pita kelompok di bawah, tonjolan lekuk (bila tampil) */
  function svg(kata, o) {
    o = o || {};
    var w = o.w || lebar(kata), k = WARNA[kelompok(kata)], lk = o.tanpaLekuk ? null : lekukKata(kata), cx = w / 2;
    var t = '<svg width="' + w + '" height="' + (H + BUMP + 2) + '" viewBox="0 0 ' + w + ' ' + (H + BUMP + 2) + '" aria-hidden="true">';
    if (lk) t += '<path d="' + bentukLekuk(lk, cx, H - 2) + '" fill="' + k[0] + '" stroke="#1E3A4C" stroke-width="3" stroke-linejoin="round"/>';
    t += '<rect x="1.5" y="1.5" width="' + (w - 3) + '" height="' + (H - 3) + '" rx="13" fill="#FFFFFF"/>';
    t += '<path d="M3,' + (H - 15) + ' H' + (w - 3) + ' V' + (H - 14) + ' q0,10 -11,10 H14 q-11,0 -11,-10 Z" fill="' + k[0] + '"/>';
    t += '<rect x="1.5" y="1.5" width="' + (w - 3) + '" height="' + (H - 3) + '" rx="13" fill="none" stroke="#1E3A4C" stroke-width="3"/>';
    t += '<text x="' + cx + '" y="' + (H / 2 + 2) + '" text-anchor="middle" data-maxw="' + (w - 12) + '" font-family="Andika, Trebuchet MS, sans-serif" font-weight="700" font-size="26" fill="#1E3A4C">' + UI.esc(kata) + '</text>';
    return t + '</svg>';
  }
  /* lekuk kosong di rel: kotak putus-putus kuning; soket alur kata benda di bawahnya bila lekuk tampil */
  function svgSlot(w, alur) {
    var t = '<svg width="' + w + '" height="' + (H + BUMP + 2) + '" aria-hidden="true">';
    t += '<rect x="3" y="3" width="' + (w - 6) + '" height="' + (H - 6) + '" rx="12" fill="#FFF1C9" stroke="#E0A52A" stroke-width="3" stroke-dasharray="7 6"/>';
    if (alur) t += '<path d="' + bentukLekuk(alur, w / 2, H - 4) + '" fill="none" stroke="#E0A52A" stroke-width="3" stroke-dasharray="4 4"/>';
    return t + '</svg>';
  }

  /* ---------- Soal: rak + rel ----------
     o: papan (elemen baris rel), rak (elemen wadah rak), kerangka [str | {slot}], kartu [kata], lekuk (bool), pakaiUlang (siaran),
        onUbah(), onTolak(kata, nounWord), boleh() -> false bila kartu belum boleh dipakai (senter) */
  function Soal(o) {
    var rel = o.rel, rak = o.rak, isi = {}, slotEl = {}, kartuRak = {}, seretBaru = 0, api = {};
    rel.innerHTML = ''; rak.innerHTML = '';
    rel.classList.add('rel-aktif');
    o.kerangka.forEach(function (x) {
      if (typeof x === 'string') { rel.insertAdjacentHTML('beforeend', '<span class="kata-rel">' + UI.esc(x) + '</span>'); return; }
      var s = U.h('span', 'slot-rel'); s.dataset.slot = x.slot; s.dataset.id = 'slot-' + x.slot;
      rel.appendChild(s); slotEl[x.slot] = s;
    });
    rel.insertAdjacentHTML('beforeend', '<i class="garis-rel"></i>');
    function nounWord() {
      if (isi.benda) return isi.benda;
      var f = o.kerangka.filter(function (x) { return typeof x === 'string'; });
      for (var i = f.length - 1; i >= 0; i--) { var w = f[i].replace(/[.,?]/g, ''); if (Tugas.alur(w)) return w; }
      return null;
    }
    function gambarSlot(nama) {
      var s = slotEl[nama], k = isi[nama];
      s.innerHTML = '';
      if (k) {
        var b = Input.button(svg(k, { tanpaLekuk: !o.lekuk }), 'kartu-kata di-rel', function () { lepas(nama); }, { aria: k, id: 'rel-' + slug(k) });
        s.appendChild(b);
        s.classList.add('terisi');
      } else {
        var alur = o.lekuk && nama !== 'benda' && nama !== 'yn' ? Tugas.alur(nounWord() || '') : null;
        s.innerHTML = svgSlot(nama === 'yn' ? 96 : nama === 'kerja' ? 96 : 118, alur);
        s.classList.remove('terisi');
      }
    }
    function segarRak() {
      Object.keys(kartuRak).forEach(function (k) {
        var dipakai = Object.keys(isi).some(function (n) { return isi[n] === k; });
        kartuRak[k].classList.toggle('terpakai', dipakai && !o.pakaiUlang);
      });
    }
    function segarSemua() { Object.keys(slotEl).forEach(gambarSlot); segarRak(); if (o.onUbah) o.onUbah(); }
    function lepas(nama) {
      if (api.kunci || !isi[nama]) return;
      Aud.sfx('kurangi');
      delete isi[nama];
      segarSemua();
    }
    function taruh(kata) {
      if (api.kunci) return false;
      if (o.boleh && !o.boleh()) return false;
      var nama = slotUntuk(kata), b = kartuRak[kata];
      if (!slotEl[nama]) { UI.goyang(b); Aud.sfx('bad'); return false; }
      if (o.lekuk) {
        var nw = nama === 'benda' ? kata : nounWord(), tolak = false;
        if (nama === 'benda') tolak = Object.keys(isi).some(function (n) { return n !== 'benda' && n !== 'yn' && !Tugas.cocok(isi[n], kata); });
        else if (nama !== 'yn' && nw) tolak = !Tugas.cocok(kata, nw);
        if (tolak) {
          UI.goyang(b); Aud.sfx('bad');
          if (o.onTolak) o.onTolak(kata, nw);
          return false;
        }
      }
      isi[nama] = kata;
      Aud.sfx('pasang');
      segarSemua();
      var s = slotEl[nama].firstChild;
      if (s && !UI.kurangi) UI.muncul(s, 220);
      return true;
    }
    o.kartu.forEach(function (kata) {
      var b = Input.button(svg(kata, { tanpaLekuk: !o.lekuk }), 'kartu-kata', function () {
        if (performance.now() - seretBaru < 300) return;
        taruh(kata);
      }, { aria: kata, id: 'kartu-' + slug(kata) });
      b.dataset.kata = kata;
      pasangSeret(b, kata);
      rak.appendChild(b); kartuRak[kata] = b;
    });
    /* seret: kartu bayangan mengikuti jari; dilepas di atas rel = masuk lekuk */
    function pasangSeret(b, kata) {
      b.addEventListener('pointerdown', function (e) {
        if (api.kunci || b.classList.contains('terpakai')) return;
        var awal = Stage.toLocal(e.clientX, e.clientY), hantu = null;
        try { b.setPointerCapture(e.pointerId); } catch (x) { /* peramban lama */ }
        function gerak(ev) {
          var p = Stage.toLocal(ev.clientX, ev.clientY);
          if (!hantu && Math.hypot(p.x - awal.x, p.y - awal.y) > 12) {
            hantu = U.h('div', 'kartu-hantu', svg(kata, { tanpaLekuk: !o.lekuk }));
            document.getElementById('stage').appendChild(hantu);
            b.classList.add('diseret');
          }
          if (hantu) { hantu.style.left = (p.x - lebar(kata) / 2) + 'px'; hantu.style.top = (p.y - 30) + 'px'; }
        }
        function selesai(ev) {
          document.removeEventListener('pointermove', gerak); document.removeEventListener('pointerup', selesai); document.removeEventListener('pointercancel', selesai);
          if (!hantu) return;
          seretBaru = performance.now();
          hantu.remove(); b.classList.remove('diseret');
          var p = Stage.toLocal(ev.clientX, ev.clientY), r = rel.getBoundingClientRect(), a = Stage.toLocal(r.left, r.top), z = Stage.toLocal(r.right, r.bottom);
          if (p.x > a.x - 30 && p.x < z.x + 30 && p.y > a.y - 40 && p.y < z.y + 40) taruh(kata);
        }
        document.addEventListener('pointermove', gerak); document.addEventListener('pointerup', selesai); document.addEventListener('pointercancel', selesai);
      });
    }
    segarSemua();
    api.kunci = false;
    api.isi = isi;
    api.taruh = taruh;
    api.kartuRak = kartuRak;
    api.lengkap = function () { return Object.keys(slotEl).every(function (n) { return !!isi[n]; }); };
    api.teks = function () {
      return o.kerangka.map(function (x) { return typeof x === 'string' ? x : (isi[x.slot] || '___'); }).join(' ').replace(/\s+([.,?])/g, '$1');
    };
    api.kosongkan = function () { Object.keys(isi).forEach(function (n) { delete isi[n]; }); segarSemua(); };
    api.lekuk = function (on) {
      o.lekuk = on;
      Object.keys(kartuRak).forEach(function (k) { Input.label(kartuRak[k], svg(k, { tanpaLekuk: !on })); });
      segarSemua();
    };
    api.sorot = function (daftar) { Object.keys(kartuRak).forEach(function (k) { kartuRak[k].classList.toggle('kilau', !!daftar && daftar.indexOf(k) >= 0); }); };
    api.tanda = function (benar) { rel.classList.toggle('benar', benar === true); rel.classList.toggle('salah', benar === false); };
    api.hapus = function () { rel.innerHTML = ''; rel.classList.remove('rel-aktif', 'benar', 'salah'); rak.innerHTML = ''; };
    return api;
  }

  root.Kartu = { svg: svg, lebar: lebar, kelompok: kelompok, slotUntuk: slotUntuk, lekukKata: lekukKata, slug: slug, Soal: Soal, KERJA: KERJA, YN: YN };
})(window);
