/* Bersama: kerangka layar bermain (GDD bagian 14) yang dipakai hook dan semua level:
   latar stasiun, Kubah Cuaca dan kaca, Kumu dan balon arahan, Papan Kalimat tiga bentuk, HUD (Butir Embun, Jeda),
   balon radio Kak Bayu (Dengar lagi, Lebih pelan), panel kanan, tombol Lensa dan Cerah. */
(function (root) {
  var KUBAH = { x0: 379, y0: 140, w: 524, h: 472, cx: 641, by: 562, top: 152 };

  /* ---------- Kumu: tubuh gambar, wajah SVG; berkedip dan berganti ekspresi ---------- */
  function Kumu(parent, x, y, w) {
    var el = U.h('div', 'kumu melayang'), dasar = 'senang', sementara = 0, kedipT = 2 + Math.random() * 2, W = w + 40, H = w * 1.25;
    el.style.cssText = 'left:' + (x - W / 2) + 'px;top:' + (y - H / 2) + 'px;width:' + W + 'px;height:' + H + 'px';
    el.setAttribute('aria-hidden', 'true');
    parent.appendChild(el);
    function render(e) { el.innerHTML = Seni.svg(W, H, Seni.kumuGambar(W / 2, H * 0.58, w, e)); }
    render(dasar);
    return {
      el: el,
      eks: function (e) { dasar = e; sementara = 0; render(e); },
      sesaat: function (e, detik) { sementara = detik || 1.6; render(e); },
      update: function (dt) {
        if (sementara > 0) { sementara -= dt; if (sementara <= 0) render(dasar); return; }
        if (dasar !== 'senang' || UI.kurangi) return;
        kedipT -= dt;
        if (kedipT <= 0) { render('kedip'); kedipT = 3 + Math.random() * 2; setTimeout(function () { if (sementara <= 0) render(dasar); }, 140); }
      }
    };
  }

  /* ---------- Papan Kalimat (GDD bagian 6.4) ---------- */
  function Papan(parent) {
    var el = U.h('div', 'pelat papan'), st = { id: null, nilai: 0, bentuk: 'positif', lensa: null, tanda: null }, waktu = 0, baris = [];
    el.innerHTML = '<div class="baris b1" data-cek="papan baris 1"></div><div class="baris b2" data-cek="papan baris 2"></div><div class="rel-kalimat"></div>';
    parent.appendChild(el);
    var b1 = el.querySelector('.b1'), b2 = el.querySelector('.b2'), relEl = el.querySelector('.rel-kalimat'), teksRel = null, teksFenomena = null;
    var dengar = UI.tombolIkon('dengar', STR.ikon.dengar, function () { Voice.stop(); api.ucap(); }, { x: 664, y: 22, id: 'dengar-papan', ukuran: 38 });
    el.appendChild(dengar);
    var tombolBentuk = {};
    [['positif', '+', STR.ikon.positif], ['tanya', '?', STR.ikon.tanya], ['negatif', '−', STR.ikon.negatif]].forEach(function (x, i) {
      var b = Input.button('<span class="tanda-bentuk">' + x[1] + '</span><span class="label-bentuk">' + UI.esc(STR.papan.label[x[0]]) + '</span>', 'kedua ikon-label bentuk', function () { pilihBentuk(x[0]); }, { x: 12 + i * 76, y: 18, w: 72, id: 'bentuk-' + x[0], aria: x[2] });
      parent.appendChild(b); tombolBentuk[x[0]] = b;
    });
    function htmlBaris(tokens, kecil) {
      var i = 0;
      return tokens.map(function (tk) {
        var kata = tk.t.split(' ').map(function (w) { return '<span class="kata" data-i="' + (i++) + '">' + UI.esc(w) + '</span>'; }).join(' ');
        if (!tk.cip) return kata;
        var ik = tk.cip === 'serba' ? Seni.ikon('titik', 20) + Seni.ikon('gelombang', 20) : Seni.ikon(tk.cip === 'hitung' ? 'titik' : 'gelombang', kecil ? 20 : 22);
        return '<span class="cip ' + tk.cip + (kecil ? ' kecil' : '') + '">' + kata + ik + '</span>';
      }).join(' ');
    }
    function segarBentuk() {
      ['positif', 'tanya', 'negatif'].forEach(function (k) {
        var b = tombolBentuk[k];
        b.classList.toggle('nyala', st.bentuk === k);
        b.setAttribute('aria-pressed', st.bentuk === k ? 'true' : 'false');
        var ada = st.id ? !!Kuantitas.kalimat(st.id, st.nilai, k) : false;
        b.classList.toggle('redup', k === 'negatif' && !ada);
        b.disabled = !st.id;
      });
    }
    function render() {
      baris = [];
      b2.classList.remove('lensa');
      if (teksFenomena && !st.tanda) {
        if (st.id) { var k0 = Kuantitas.kalimat(st.id, st.nilai, st.bentuk) || Kuantitas.kalimat(st.id, st.nilai, 'positif'); baris.push(k0[0]); b1.innerHTML = htmlBaris(k0[0]); }
        else b1.innerHTML = '';
        b2.innerHTML = Seni.ikon('bintang', 26) + '<span class="teks-fenomena">' + UI.esc(teksFenomena) + '</span>';
        baris.push([{ t: teksFenomena }]);
        segarBentuk(); return;
      }
      if (st.tanda) { b1.innerHTML = '<span class="tanda-ragu">' + UI.esc(st.tanda) + '</span>'; b2.innerHTML = ''; segarBentuk(); return; }
      if (!st.id) { b1.innerHTML = ''; b2.innerHTML = ''; segarBentuk(); return; }
      var k = Kuantitas.kalimat(st.id, st.nilai, st.bentuk);
      if (!k) { st.bentuk = 'positif'; k = Kuantitas.kalimat(st.id, st.nilai, 'positif'); }
      baris = k.slice();
      b1.innerHTML = htmlBaris(k[0]);
      if (k[1]) b2.innerHTML = htmlBaris(k[1], true);
      else if (st.lensa) {
        var L = Kuantitas.positif(st.lensa.benda, st.lensa.n);
        baris.push(L);
        b2.innerHTML = Seni.ikon('lensa', 28) + '<span class="sama">=</span>' + htmlBaris(L, true);
        b2.classList.add('lensa');
      } else b2.innerHTML = '';
      segarBentuk();
    }
    function pilihBentuk(k) {
      if (!st.id) return;
      if (!Kuantitas.kalimat(st.id, st.nilai, k)) { UI.toast(STR.papan.negatifRedup); UI.goyang(tombolBentuk[k]); return; }
      st.bentuk = k; render(); Voice.stop(); api.ucap();
    }
    var api = {
      el: el,
      st: st,
      tampil: function (id, nilai, diam) {
        st.id = id; st.nilai = nilai; st.tanda = null;
        if (id && !Kuantitas.kalimat(id, nilai, st.bentuk)) st.bentuk = 'positif';
        render();
        clearTimeout(waktu);
        if (!diam && id) waktu = setTimeout(function () { api.ucap(); }, 450);
      },
      tanda: function (t) { st.tanda = t; render(); clearTimeout(waktu); },
      lensa: function (L) { st.lensa = L; render(); },
      kosong: function () { st.id = null; st.lensa = null; st.tanda = null; teksFenomena = null; render(); clearTimeout(waktu); },
      /* kalimat fenomena di baris 2 (GDD bagian 6.6) */
      fenomena: function (t) { teksFenomena = t; render(); },
      /* mode rel: baris diganti Rel Kalimat untuk Kartu Kata; fn() memberi teks rel untuk tombol Dengar */
      rel: function (fn) {
        teksRel = fn || null;
        el.classList.toggle('mode-rel', !!fn);
        Object.keys(tombolBentuk).forEach(function (k) { tombolBentuk[k].style.visibility = fn ? 'hidden' : ''; });
        if (fn) { st.id = null; st.tanda = null; teksFenomena = null; render(); clearTimeout(waktu); }
      },
      relEl: relEl,
      teks: function () { return baris.map(function (b) { return Kuantitas.teks(b); }); },
      /* ucapkan semua baris berurutan dengan sorot kata; info: hanya kalimat terbaru yang antre */
      ucap: function () {
        clearTimeout(waktu);
        if (teksRel) { var tr = teksRel(); return tr ? Voice.say(tr.replace(/_+/g, ' '), { tokoh: 'papan', lang: 'en-US', info: true }) : Promise.resolve(); }
        var janji = Promise.resolve();
        [b1, b2].forEach(function (elB, i) {
          if (!baris[i]) return;
          var teks = Kuantitas.teks(baris[i]), kata = elB.querySelectorAll('.kata');
          janji = Voice.say(teks, { tokoh: 'papan', lang: 'en-US', info: i === 0 && !teksFenomena, onWord: function (j) { Array.prototype.forEach.call(kata, function (k, n) { k.classList.toggle('aktif', n === j); }); } });
        });
        return janji;
      }
    };
    render();
    return api;
  }

  /* ---------- Balon radio Kak Bayu (bahasa Inggris) ---------- */
  function Radio(parent) {
    var foto = U.h('div', 'potret-bayu'), el = U.h('div', 'pelat balon-bayu'), teksAkhir = '', eksAkhir = 'senyum';
    foto.innerHTML = '<img alt="' + UI.esc(STR.bayuNama) + '" src="' + (Seni.akar() + ((Seni.aset('potret') || {})['bayu-senyum'] || '')) + '">';
    el.innerHTML = '<p class="teks-bayu" aria-live="polite" data-cek="balon bayu"></p>';
    var p = el.querySelector('.teks-bayu');
    el.appendChild(UI.tombolIkon('dengar', STR.ikon.dengarLagi, function () { Voice.stop(); api.ulang(); }, { x: 398, y: 3, id: 'dengar-lagi', ukuran: 36 }));
    el.appendChild(UI.tombolIkon('pelan', STR.ikon.lebihPelan, function () { Voice.stop(); api.ulang(0.72); }, { x: 468, y: 3, id: 'lebih-pelan', ukuran: 36 }));
    parent.appendChild(foto); parent.appendChild(el);
    var tokohAkhir = 'bayu';
    function potret(e, tokoh) {
      var P = Seni.aset('potret') || {}, src = tokoh && tokoh !== 'bayu' ? P[tokoh] : (P['bayu-' + e] || P['bayu-senyum']);
      if (src) foto.querySelector('img').src = Seni.akar() + src;
      foto.classList.toggle('warga', !!tokoh && tokoh !== 'bayu');
    }
    var api = {
      el: el, foto: foto,
      tulis: function (teks) {
        teksAkhir = teks;
        if (api.sembunyi) { p.innerHTML = '<span class="teks-tersembunyi">' + UI.esc(STR.alur.dengarDulu) + '</span>'; return; }
        p.innerHTML = teks.split(/\s+/).map(function (w, i) { return '<span class="kata" data-i="' + i + '">' + UI.esc(w) + '</span>'; }).join(' ');
        /* permintaan tiga benda: balon tumbuh ke atas menjadi 3 baris */
        el.classList.remove('panjang');
        if (p.scrollHeight > p.clientHeight + 4) el.classList.add('panjang');
      },
      sembunyi: false,
      /* tampilkan teks permintaan yang tadinya disembunyikan (L3: dengar dulu) */
      buka: function () { api.sembunyi = false; api.tulis(teksAkhir); },
      ulang: function (rate) { return tokohAkhir === 'bayu' ? api.ucap(teksAkhir, eksAkhir, rate) : api.warga(tokohAkhir, teksAkhir, { rate: rate, sembunyi: api.sembunyi }); },
      /* permintaan warga lewat radio: potret dan suara warga */
      warga: function (id, teks, o) {
        o = o || {};
        tokohAkhir = id; api.sembunyi = !!o.sembunyi;
        potret(null, id);
        api.tulis(teks);
        var kata = p.querySelectorAll('.kata');
        foto.classList.add('bicara');
        return Voice.say(teks, { tokoh: id, lang: 'en-US', rate: o.rate, onWord: function (j) { Array.prototype.forEach.call(kata, function (k, n) { k.classList.toggle('aktif', n === j); }); } })
          .then(function () { foto.classList.remove('bicara'); });
      },
      ucap: function (teks, eks, rate) {
        eksAkhir = eks || 'senyum'; tokohAkhir = 'bayu'; api.sembunyi = false;
        potret(eksAkhir);
        api.tulis(teks);
        if (U.TEST) { var m = Kuantitas.periksa(teks); if (m.length) console.error('Kalimat bermasalah: ' + teks + ' (' + m.join(', ') + ')'); }
        var kata = p.querySelectorAll('.kata');
        foto.classList.add('bicara');
        return Voice.say(teks, { tokoh: 'bayu', lang: 'en-US', rate: rate, onWord: function (j) { Array.prototype.forEach.call(kata, function (k, n) { k.classList.toggle('aktif', n === j); }); } })
          .then(function () { foto.classList.remove('bicara'); });
      }
    };
    return api;
  }

  /* ---------- kerangka layar bermain ---------- */
  var Lab = {
    KUBAH: KUBAH,
    Kumu: Kumu,
    bangun: function (parent, o) {
      o = o || {};
      var lab = { o: o };
      var latar = Seni.aset('labDalam');
      parent.insertAdjacentHTML('beforeend', latar ? '<img class="latar" alt="" src="' + latar + '">' : Seni.svg(1280, 720, Seni.ruangStasiun({ jendela: [22, 30, 228, 350] }), { cls: 'latar' }));
      lab.jendela = Jendela(parent, function () { return lab.kubah ? lab.kubah.gelap : 0; });
      lab.kubah = new Kubah(parent, KUBAH);
      parent.insertAdjacentHTML('beforeend', Seni.svg(1280, 720, Seni.kubahLebar(KUBAH.cx, KUBAH.by, KUBAH.w, KUBAH.top, ''), { cls: 'kaca-kubah' }));
      /* Kumu dan balon arahan */
      lab.kumu = Kumu(parent, 300, 330, 124);
      /* Kumu ikut cuaca (GDD bagian 5): makin kelabu dan besar saat hujan bertambah, berat mengantuk saat hujan lebat */
      lab.kubah.onAtur = function () {
        var r = (lab.kubah.nilai.rain || 0) / 100, berat = r >= 0.7;
        lab.kumu.el.style.filter = r ? 'saturate(' + (1 - r * 0.6).toFixed(2) + ') brightness(' + (1 - r * 0.18).toFixed(2) + ')' : '';
        lab.kumu.el.style.scale = r ? (1 + r * 0.12).toFixed(3) : '';
        if (berat !== !!lab.kumuBerat) { lab.kumuBerat = berat; lab.kumu.eks(berat ? 'kedip' : 'senang'); }
      };
      var ar = U.h('div', 'pelat balon-kumu');
      ar.innerHTML = '<p class="teks-arahan" aria-live="polite" data-cek="arahan"></p>';
      ar.appendChild(UI.tombolIkon('dengar', STR.ikon.dengarArahan, function () { Voice.stop(); UI.bacakan(lab.teksArahan, true); }, { x: 314, y: 15, id: 'dengar-arahan', ukuran: 34 }));
      parent.appendChild(ar);
      lab.teksArahan = '';
      lab.arahan = function (teks, bacakan) {
        lab.teksArahan = teks;
        ar.querySelector('.teks-arahan').innerHTML = UI.esc(teks).replace(/\*(.+?)\*/g, '<i>$1</i>');
        ar.classList.toggle('kosong', !teks);
        if (teks && !UI.kurangi) UI.lompat(ar);
        return bacakan === false || !teks ? Promise.resolve() : UI.bacakan(teks.replace(/\*/g, ''));
      };
      lab.papan = Papan(parent);
      /* HUD */
      var pil = U.h('div', 'pelat pil-embun');
      pil.innerHTML = Seni.ikon('embun', 38) + '<span class="nilai-embun" data-cek="embun">' + Save.data.embun + '</span>';
      pil.setAttribute('aria-label', STR.hasil.embun);
      parent.appendChild(pil);
      var tampilEmbun = Save.data.embun;
      lab.embun = function (n, dari) {
        if (!n) return Promise.resolve();
        var awal = tampilEmbun;
        tampilEmbun += n; Save.tambahEmbun(n);
        Aud.sfx('embun');
        if (dari) { var p = UI.titik(dari); if (p) UI.ledak(p.x, p.y, 10); }
        var chip = U.h('div', 'tambah-embun', '+' + n); parent.appendChild(chip);
        Tween.run(900, function (e) { chip.style.opacity = e < 0.7 ? 1 : (1 - e) / 0.3; chip.style.translate = '0 ' + (-24 * e) + 'px'; }, Ease.easeOutCubic).then(function () { chip.remove(); });
        return UI.hitungNaik(pil.querySelector('.nilai-embun'), awal, tampilEmbun, 600);
      };
      parent.appendChild(UI.tombolIkon('jeda', STR.ikon.jeda, function () { UI.jeda({ ulangi: o.ulangi }); }, { x: 1204, y: 20, id: 'jeda' }));
      /* chip Mode Santai di bawah Butir Embun (GDD bagian 6.11) */
      if (Save.data.settings.santai) parent.appendChild(U.h('div', 'chip-santai', '<span data-cek="chip santai">' + UI.esc(STR.santaiChip) + '</span>'));
      if (o.jurnal) parent.appendChild(UI.tombolIkon('jurnal', STR.jurnal.judul, function () { Jurnal.buka(); }, { x: 1132, y: 20, id: 'jurnal' }));
      /* panel kanan dan judulnya */
      lab.panel = U.h('div', 'pelat panel-kanan');
      lab.panel.innerHTML = '<div class="judul-panel" data-cek="judul panel"></div>';
      parent.appendChild(lab.panel);
      lab.judulPanel = function (t) { lab.panel.querySelector('.judul-panel').textContent = t; };
      lab.isiPanel = U.h('div', 'isi-panel-kanan');
      parent.appendChild(lab.isiPanel);
      /* radio Kak Bayu */
      lab.bayu = Radio(parent);
      /* Lensa dan Cerah */
      lab.tombolLensa = Input.button(Seni.ikon('lensa', 32) + '<span>' + STR.ikon.lensa + '</span>', 'kedua ikon-label', function () { if (o.onLensa) o.onLensa(); }, { x: 928, y: 640, id: 'lensa', aria: STR.ikon.lensa });
      lab.tombolCerah = Input.button(Seni.ikon('cerah', 32) + '<span>' + STR.ikon.cerah + '</span>', 'kedua ikon-label', function () { if (o.onCerah) o.onCerah(); }, { x: 1016, y: 640, id: 'cerah', aria: STR.ikon.cerah });
      parent.appendChild(lab.tombolLensa); parent.appendChild(lab.tombolCerah);
      if (o.jalankan) {
        lab.tombolJalan = Input.button('<span class="label-jalan">' + UI.esc(STR.alur.jalankan) + '</span>', 'utama jalankan', function () { o.jalankan(); }, { x: 1104, y: 640, id: 'jalankan', aria: STR.alur.jalankan });
        parent.appendChild(lab.tombolJalan);
        lab.labelJalan = function (t) { Input.label(lab.tombolJalan, '<span class="label-jalan">' + UI.esc(t) + '</span>'); lab.tombolJalan.setAttribute('aria-label', t); };
      }
      /* lensa bisa diseret di kubah; ketuk kubah memindah lensa (alternatif tanpa seret) */
      var kan = lab.kubah.kanvas;
      /* senter (L4) diseret atau diketuk di kubah; panah keyboard memindah senter atau lensa */
      kan.tabIndex = -1;
      kan.setAttribute('aria-label', STR.alur.senter);
      kan.addEventListener('keydown', function (e) {
        var K = lab.kubah, S = K.lensa.on ? K.lensa : (K.senter.on ? K.senter : null), d = { ArrowLeft: [-30, 0], ArrowRight: [30, 0], ArrowUp: [0, -30], ArrowDown: [0, 30] }[e.key];
        if (!S || !d) return;
        e.preventDefault(); e.stopPropagation();
        S.x = U.clamp(S.x + d[0], 40, KUBAH.w - 40); S.y = U.clamp(S.y + d[1], 40, 440);
        if (S === K.senter) { if (o.onSenter) o.onSenter(); } else if (o.onLensaGeser) o.onLensaGeser();
      });
      kan.addEventListener('pointerdown', function (e) {
        if (!lab.kubah.lensa.on && !lab.kubah.senter.on) return;
        e.preventDefault();   /* ketukan tidak memindah fokus (fokus memicu gulir halaman) */
        Aud.init();
        kan.setPointerCapture(e.pointerId);
        var senter = !lab.kubah.lensa.on;
        function pindah(ev) {
          var p = Stage.toLocal(ev.clientX, ev.clientY), L = lab.kubah.lokal(p.x, p.y);
          if (senter) {
            lab.kubah.senter.x = U.clamp(L.x, 30, KUBAH.w - 30); lab.kubah.senter.y = U.clamp(L.y, 30, 450);
            if (o.onSenter) o.onSenter();
            return;
          }
          lab.kubah.lensa.x = U.clamp(L.x, 70, KUBAH.w - 80); lab.kubah.lensa.y = U.clamp(L.y, 70, 340);
          if (o.onLensaGeser) o.onLensaGeser();
        }
        pindah(e);
        function lepas() { kan.removeEventListener('pointermove', pindah); kan.removeEventListener('pointerup', lepas); kan.removeEventListener('pointercancel', lepas); }
        kan.addEventListener('pointermove', pindah); kan.addEventListener('pointerup', lepas); kan.addEventListener('pointercancel', lepas);
      });
      lab.update = function (dt) {
        lab.kumu.update(dt);
        var fokus = lab.kubah.lensa.on || lab.kubah.senter.on ? 0 : -1;
        if (kan.tabIndex !== fokus) { kan.tabIndex = fokus; kan.setAttribute('aria-label', lab.kubah.lensa.on ? STR.alur.lensaAria : STR.alur.senter); }
      };
      lab.lepas = function () { lab.kubah.lepas(); lab.jendela.lepas(); lab.papan.kosong(); Aud.cuaca({}); };
      return lab;
    }
  };
  root.Lab = Lab;
})(window);
