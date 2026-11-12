/* Kuantitas: zona, perangkai kalimat Papan Kalimat, Lensa, dan pemeriksa tata bahasa (brief bagian 4, 5, 7; GDD bagian 7).
   Kalimat dirangkai dari token, sehingga satu sumber melayani papan, suara, dan uji. Token: { t: teks, cip: hitung|takar|serba }. */
(function (root) {
  var K = root.KUANTITAS, B = root.BENDA, PETA = {};
  B.daftar.forEach(function (b) { PETA[b.id] = b; });

  function benda(id) { return PETA[id]; }
  function zona(id, nilai) {
    var b = PETA[id], daftar = b.jenis === 'hitung' ? K.hitung : K.takar;
    for (var i = 0; i < daftar.length; i++) if (nilai >= daftar[i].min && nilai <= daftar[i].maks) return { i: i, z: daftar[i] };
    return { i: daftar.length - 1, z: daftar[daftar.length - 1] };
  }
  /* kata zona yang tampil di bawah alat (bukan kalimat): a / an / a few / six / a lot of / a little / some */
  function kataZona(id, nilai) {
    var b = PETA[id], z = zona(id, nilai).z;
    if (b.jenis === 'hitung') {
      if (z.id === 'satu') return b.artikel;
      if (z.id === 'abu') return K.angka[nilai];
    }
    return z.kata;
  }
  function kelompok(kata) { return K.kelompok[kata] || null; }
  function tok(t, cip) { return cip ? { t: t, cip: cip } : { t: t }; }
  function teks(tokens) { return tokens.map(function (x) { return x.t; }).join(' ').replace(/ ([.?,])/g, '$1'); }

  /* kalimat positif (selalu ada) */
  function positif(id, n) {
    var b = PETA[id], z = zona(id, n).z;
    if (b.jenis === 'hitung') {
      if (z.id === 'satu') return [tok('There'), tok('is', 'hitung'), tok(b.artikel, 'hitung'), tok(b.tunggal + '.')];
      if (z.id === 'abu') return [tok('There'), tok('are', 'hitung'), tok(K.angka[n], 'hitung'), tok(b.jamak + '.')];
      return [tok('There'), tok('are', 'hitung'), tok(z.kata, kelompok(z.kata)), tok(b.jamak + '.')];
    }
    return [tok('There'), tok('is', 'takar'), tok(z.kata, kelompok(z.kata)), tok(b.kata + '.')];
  }
  /* pertanyaan dan jawaban; jawaban untuk tepat satu memakai "one" (There is one cloud.) */
  function tanya(id, n) {
    var b = PETA[id], jawab = positif(id, n);
    if (b.jenis === 'hitung' && zona(id, n).z.id === 'satu') jawab = [tok('There'), tok('is', 'hitung'), tok('one', 'hitung'), tok(b.tunggal + '.')];
    var t = b.jenis === 'hitung' ? [tok('How many', 'hitung'), tok(b.jamak), tok('are', 'hitung'), tok('there?')] : [tok('How much', 'takar'), tok(b.kata), tok('is', 'takar'), tok('there?')];
    return [t, jawab];
  }
  /* negatif hanya bila benar: 0 (not any) dan zona sedikit (not many / not much). Selain itu null (tombol redup). */
  function negatif(id, n) {
    var b = PETA[id], z = zona(id, n).z;
    if (b.jenis === 'hitung') {
      if (z.id === 'no') return [tok('There'), tok("aren't", 'hitung'), tok('any', 'serba'), tok(b.jamak + '.')];
      if (z.id === 'few' || z.id === 'satu') return [tok('There'), tok("aren't", 'hitung'), tok('many', 'hitung'), tok(b.jamak + '.')];
      return null;
    }
    if (z.id === 'no') return [tok('There'), tok("isn't", 'takar'), tok('any', 'serba'), tok(b.kata + '.')];
    if (z.id === 'little') return [tok('There'), tok("isn't", 'takar'), tok('much', 'takar'), tok(b.kata + '.')];
    return null;
  }
  /* bentuk: positif | tanya | negatif. Hasil: daftar baris token (1 atau 2 baris), atau null bila bentuk itu tidak cocok. */
  function kalimat(id, n, bentuk) {
    if (bentuk === 'tanya') return tanya(id, n);
    if (bentuk === 'negatif') { var g = negatif(id, n); return g ? [g] : null; }
    return [positif(id, n)];
  }
  /* Lensa: hujan atau salju diperbesar menjadi butir yang dihitung */
  function lensa(id, nilai) {
    var b = PETA[id];
    if (!b || !b.lensa) return null;
    return { benda: b.lensa, n: K.lensa[Math.round(nilai / 10) * 10] || 0 };
  }

  /* ---------- pemeriksa tata bahasa (brief bagian 7) ---------- */
  var hitungKata = [], takarKata = [], jamakTakBeraturan = { fishes: 'fish', leafs: 'leaves' };
  B.daftar.forEach(function (b) {
    if (b.jenis === 'hitung') hitungKata.push(b.tunggal, b.jamak); else takarKata.push(b.kata);
  });
  function jenisKata(w) {
    w = w.toLowerCase();
    if (takarKata.indexOf(w) >= 0) return 'takar';
    if (hitungKata.indexOf(w) >= 0) return 'hitung';
    return null;
  }
  function jamak(w) { w = w.toLowerCase(); return B.daftar.some(function (b) { return b.jenis === 'hitung' && b.jamak === w && b.tunggal !== w; }) || w === 'fish'; }
  function periksa(kalimatTeks) {
    var s = kalimatTeks.replace(/[.?!,]/g, ' ').replace(/\s+/g, ' ').trim(), lower = s.toLowerCase(), m = [];
    var tanyaK = /\?\s*$/.test(kalimatTeks), neg = /n't\b|\bnot\b/.test(lower);
    var kata = s.split(' ');
    Object.keys(jamakTakBeraturan).forEach(function (x) { if (new RegExp('\\b' + x + '\\b', 'i').test(s)) m.push('jamak-salah:' + x); });
    if (/\bmuch\b/.test(lower) && !tanyaK && !neg) m.push('much-positif');
    if (/\bany\b/.test(lower) && !tanyaK && !neg) m.push('any-positif');
    if (/\b(aren't|isn't)\s+no\b/.test(lower)) m.push('negatif-ganda');
    for (var i = 0; i < kata.length; i++) {
      var w = kata[i].toLowerCase(), dua = (w + ' ' + (kata[i + 1] || '')).toLowerCase(), sasaran = null, q = null;
      if (dua === 'a few' || dua === 'how many') { q = 'hitung'; sasaran = kata[i + 2]; }
      else if (dua === 'a little' || dua === 'how much') { q = 'takar'; sasaran = kata[i + 2]; }
      else if (w === 'many') q = 'hitung', sasaran = kata[i + 1];
      else if (w === 'much') q = 'takar', sasaran = kata[i + 1];
      if (q && sasaran) {
        var j = jenisKata(sasaran);
        if (j && j !== q) m.push('kelompok:' + w + '+' + sasaran);
        if (q === 'hitung' && j === 'hitung' && !jamak(sasaran)) m.push('perlu-jamak:' + sasaran);
      }
    }
    /* There is/are dan Is/Are there: cocokkan dengan kata benda pertama sesudahnya */
    if (/^(there|how|is|are|yes|no)/.test(lower)) {
      var kerja = null, idx = -1;
      ['there is', 'there are', "there isn't", "there aren't", 'is there', 'are there'].forEach(function (p) { var k = lower.indexOf(p); if (k >= 0 && (idx < 0 || k < idx)) { idx = k; kerja = p; } });
      if (/^how many .* is there/.test(lower)) m.push('is-jamak');
      if (/^how much .* are there/.test(lower)) m.push('are-takar');
      if (kerja) {
        var sisa = lower.slice(idx + kerja.length).trim().split(' '), nb = null;
        for (var k = 0; k < sisa.length; k++) if (jenisKata(sisa[k])) { nb = sisa[k]; break; }
        if (nb) {
          var isK = /\bis\b|\bisn't\b/.test(kerja), jen = jenisKata(nb), pl = jen === 'hitung' && jamak(nb);
          /* "a" tunggal, bukan bagian dari "a few", "a lot of", atau "a little" */
          var artTunggal = sisa[0] === 'one' || sisa[0] === 'an' || (sisa[0] === 'a' && ['few', 'lot', 'little'].indexOf(sisa[1]) < 0);
          if (isK && pl && !artTunggal) m.push('is-jamak');
          /* are + a/an/one (There are a fish.) */
          if (!isK && artTunggal && jen === 'hitung') m.push('are-tunggal');
          if (!isK && (jen === 'takar' || (jen === 'hitung' && !pl))) m.push('are-' + (jen === 'takar' ? 'takar' : 'tunggal'));
          var art = sisa[0];
          if ((art === 'a' || art === 'an') && jen === 'hitung') {
            var b = B.daftar.filter(function (x) { return x.tunggal === nb; })[0];
            if (b && b.artikel !== art) m.push('artikel:' + art + '+' + nb);
          }
        }
      }
    }
    return m;
  }

  var Kuantitas = { benda: benda, zona: zona, kataZona: kataZona, kelompok: kelompok, kalimat: kalimat, positif: positif, lensa: lensa, teks: teks, periksa: periksa };
  root.Kuantitas = Kuantitas;
  if (typeof module !== 'undefined') module.exports = Kuantitas;
})(typeof window !== 'undefined' ? window : globalThis);
