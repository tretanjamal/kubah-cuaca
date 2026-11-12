/* Jurnal Cuaca (GDD bagian 8): tab Kata (20 kartu bergambar dan bersuara) dan tab Fenomena (9 kartu, siluet bila belum ditemukan).
   Kartu Temuan: kata benda baru dari fenomena digolongkan dulu (dihitung atau ditakar) sebelum masuk Jurnal. */
(function (root) {
  var WARNA_ZAT = { hujan: ['#8CC8F0', '#4FA3E0'], matahari: ['#FFE08F', '#FFC94A'], angin: ['#CCC3F5', '#A99BE8'], salju: ['#FFFFFF', '#DCD6E6'],
    kabut: ['#FBF8F2', '#CFD9E0'], air: ['#4FA3E0', '#2F7EBB'], pasir: ['#F5E6C4', '#EAD3A2'] };
  var GAMBAR = { rain: 'awan-hujan', snow: 'manusia-salju', salt: 'garam' };

  /* gambar kata: sprite benda bila ada; benda ditakar tanpa sprite memakai gumpal warna zatnya */
  function gambarKata(b, u) {
    var src = Seni.srcBenda(b.sprite || GAMBAR[b.id]);
    if (src) return '<img alt="" src="' + src + '" style="max-width:' + u + 'px;max-height:' + u + 'px">';
    var c = WARNA_ZAT[b.zat] || WARNA_ZAT.hujan, id = 'gz-' + b.id + u;
    return '<svg width="' + u + '" height="' + u + '" viewBox="0 0 80 80" aria-hidden="true"><defs><radialGradient id="' + id + '" cx=".35" cy=".3"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></radialGradient></defs>' +
      '<path d="M14,56 Q8,34 26,26 Q34,10 52,18 Q72,20 68,44 Q74,64 50,66 Q24,72 14,56 Z" fill="url(#' + id + ')" stroke="#1E3A4C" stroke-width="3" stroke-linejoin="round"/>' +
      (b.zat === 'angin' ? '<path d="M24,40 q10,-8 20,0 t20,0 M28,52 q8,-6 16,0" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>' : '') +
      (b.zat === 'matahari' ? '<circle cx="40" cy="42" r="10" fill="#FFF4C9"/>' : '') + '</svg>';
  }
  function ucapKata(b) {
    Voice.stop();
    Voice.say(b.jamak || b.kata, { tokoh: 'papan', lang: 'en-US', segera: true });
  }

  var Jurnal = {
    buka: function (tab) {
      var J = STR.jurnal, o = UI.overlay(J.judul, 'panel-jurnal'), jedaLama = Tween.paused;
      /* alur dan ucapan berhenti selama Jurnal terbuka */
      Voice.jeda(); Tween.paused = true;
      o.onClose = function () { Voice.stop(); Tween.paused = jedaLama; if (!jedaLama) Voice.lanjutTertahan(); };
      var tabs = U.h('div', 'tab-info'), isi = U.h('div', 'isi-jurnal');
      isi.setAttribute('data-cek', 'isi jurnal');
      var HAL = {
        kata: function () {
          isi.className = 'isi-jurnal grid-kata';
          isi.innerHTML = '';
          BENDA.daftar.forEach(function (b) {
            var ada = Save.punyaKata(b.id), h = b.jenis === 'hitung';
            var label = ada ? '<span class="gambar-jurnal">' + gambarKata(b, 52) + '</span><span class="teks-jurnal"><b data-cek="kata jurnal">' + UI.esc(b.jamak || b.kata) + '</b><small>' + UI.esc(b.arti) + (h && b.jamak !== b.tunggal + 's' ? ' (1: ' + b.tunggal + ')' : '') + '</small>' +
              '<i class="lencana-jenis ' + b.jenis + '">' + Seni.ikon(h ? 'titik' : 'gelombang', 18) + UI.esc(h ? J.dihitung : J.ditakar) + '</i></span>'
              : '<span class="gambar-jurnal siluet">?</span><span class="teks-jurnal"><small data-cek="kata belum">' + UI.esc(J.belum) + '</small></span>';
            var t = Input.button(label, 'kedua kartu-jurnal' + (ada ? '' : ' belum'), function () { if (ada) ucapKata(b); else { Aud.sfx('gembok'); UI.goyang(t); } }, { aria: ada ? (b.jamak || b.kata) + ', ' + b.arti : J.belum, id: 'jurnal-' + b.id });
            isi.appendChild(t);
          });
        },
        fenomena: function () {
          isi.className = 'isi-jurnal grid-fenomena';
          isi.innerHTML = '';
          FENOMENA.daftar.forEach(function (f) {
            var ada = Save.data.fenomena.indexOf(f.id) >= 0, src = Seni.srcBenda(f.sprite);
            var label = '<span class="gambar-jurnal' + (ada ? '' : ' siluet-img') + '">' + (src ? '<img alt="" src="' + src + '">' : '') + '</span><span class="teks-jurnal"><b data-cek="nama fenomena jurnal">' + UI.esc(ada ? f.nama : J.belum) + '</b>' +
              '<small data-cek="kalimat fenomena">' + UI.esc(ada ? f.kalimat[0] : f.petunjuk) + '</small></span>';
            var t = Input.button(label, 'kedua kartu-fenomena' + (ada ? '' : ' belum'), function () {
              if (ada) { Voice.stop(); Voice.say(f.kalimat[0], { tokoh: 'papan', lang: 'en-US', segera: true }); } else Voice.say(f.petunjuk, { lang: 'id-ID', tokoh: 'kumu', segera: true });
            }, { aria: ada ? f.nama : J.belum, id: 'jurnal-f-' + f.id });
            isi.appendChild(t);
          });
        }
      };
      function pilih(k) {
        HAL[k]();
        Array.prototype.forEach.call(tabs.children, function (b) { var on = b.dataset.id === 'tab-' + k; b.classList.toggle('aktif', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      }
      [['kata', J.tabKata], ['fenomena', J.tabFenomena]].forEach(function (x) {
        var b = Input.button(UI.esc(x[1]) + ' <span class="hitung-jurnal">' + (x[0] === 'kata' ? BENDA.daftar.filter(function (b) { return Save.punyaKata(b.id); }).length + '/' + BENDA.daftar.length : Save.data.fenomena.length + '/' + FENOMENA.daftar.length) + '</span>', 'ketiga tab', function () { pilih(x[0]); }, { id: 'tab-' + x[0] });
        b.setAttribute('role', 'tab'); tabs.appendChild(b);
      });
      var tutup = Input.button(UI.esc(STR.tombol.tutup), 'kedua tab', function () { o.close(); }, { id: 'tutup' });
      tabs.appendChild(tutup);
      o.body.appendChild(tabs); o.body.appendChild(isi);
      pilih(tab || 'kata');
      setTimeout(function () { tutup.focus({ preventScroll: true }); }, 30);
      return o;
    },

    /* Kartu Temuan: hasil Promise(pertama) setelah murid memilih golongan yang benar */
    temuan: function (id) {
      var b = Kuantitas.benda(id), A = STR.alur, o = UI.overlay(STR.jurnal.temuanJudul, 'panel-temuan'), pertama = true;
      return new Promise(function (ok) {
        var kartu = U.h('div', 'kartu-temuan', '<span class="gambar-temuan">' + gambarKata(b, 120) + '</span><b class="kata-temuan" data-cek="kata temuan">' + UI.esc(b.jamak || b.kata) + '</b><span class="arti-temuan">' + UI.esc(b.arti) + '</span>');
        kartu.appendChild(UI.tombolIkon('dengar', STR.ikon.dengar, function () { ucapKata(b); }, { x: 296, y: 12, id: 'dengar-temuan', ukuran: 34 }));
        var tanya = U.h('p', 'tanya-temuan', UI.esc(U.fmt(A.temuan, { kata: b.jamak || b.kata })).replace(/\*/g, ''));
        tanya.setAttribute('data-cek', 'tanya temuan');
        var baris = U.h('div', 'baris-hasil');
        ['hitung', 'takar'].forEach(function (j) {
          var t = Input.button(Seni.ikon(j === 'hitung' ? 'titik' : 'gelombang', 30) + '<span>' + (j === 'hitung' ? A.temuanHitung : A.temuanTakar) + '</span>', 'kedua', function () {
            if (j === b.jenis) {
              Save.temukanKata(id);
              Aud.sfx('good'); UI.lompat(kartu);
              tanya.textContent = U.fmt(A.temuanBenar, { kata: b.jamak || b.kata }).replace(/\*/g, '');
              baris.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
              Voice.say(b.jamak || b.kata, { tokoh: 'papan', lang: 'en-US', segera: true });
              Tween.wait(1300).then(function () { o.close(); ok(pertama); });
            } else {
              pertama = false;
              Aud.sfx('bad'); UI.goyang(t);
              Save.catatMis(b.jenis === 'hitung' ? 'pilih-hitung' : 'pilih-takar');
              tanya.textContent = U.fmt(A.temuanSalah, { kata: b.jamak || b.kata, alasan: b.jenis === 'hitung' ? A.alasanHitung : A.alasanTakar }).replace(/\*/g, '');
              UI.bacakan(tanya.textContent);
            }
          }, { w: 230, id: 'temuan-' + j });
          baris.appendChild(t);
        });
        o.body.appendChild(kartu); o.body.appendChild(tanya); o.body.appendChild(baris);
        ucapKata(b);
        UI.bacakan(tanya.textContent);
      });
    }
  };
  root.Jurnal = Jurnal;
})(window);
