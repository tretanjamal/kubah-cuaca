/* Seni SVG "plastisin lunak" Kubah Cuaca (dari mockup Fase 0). Gambar ChatGPT dipakai lewat ASET; SVG kode menjadi cadangan.
   Dunia: tanpa garis luar, gradien radial (sorotan kiri atas), tekstur halus, bayangan kontak.
   Antarmuka (lensa, ikon): garis 3 px Tinta Badai. Semua fungsi mengembalikan string SVG. */
var Seni = (function () {
  'use strict';

  /* [dasar, terang, gelap] */
  var W = {
    tinta: ['#1E3A4C', '#3D5E73', '#142836'], susu: ['#FBF8F2', '#FFFFFF', '#DCD6E6'],
    mint: ['#CFEFE4', '#E6F8F1', '#A9D9C8'], biru: ['#4FA3E0', '#8CC8F0', '#2F7EBB'],
    koral: ['#FF8A6B', '#FFB39E', '#D9654A'], kuning: ['#FFC94A', '#FFE08F', '#E0A52A'],
    lumut: ['#6CC07A', '#9ADB9F', '#4C9A5B'], lavender: ['#A99BE8', '#CCC3F5', '#8475C9'],
    pasir: ['#EAD3A2', '#F5E6C4', '#CDB07A'], tanah: ['#B88A62', '#D2A880', '#8E6544'],
    kayu: ['#C08A5B', '#D9A97E', '#94643C'], batu: ['#B9B4C9', '#D8D4E4', '#9590AB'],
    kelabu: ['#B8C2D6', '#D3DAE7', '#8F9BB3'], garam: ['#F1F5F7', '#FFFFFF', '#CFD9E0'],
    kulit1: ['#B97A56', '#D29874', '#93583A'], kulit2: ['#8D5A3B', '#A8724F', '#6E4229'],
    kulit3: ['#E0B08A', '#F0CDAE', '#C3916A'], rambut: ['#2A1F1A', '#4A3A30', '#160F0B'],
    uban: ['#D9D6DF', '#F2F0F5', '#B3AFBD'], daun: ['#58B26A', '#8ED39A', '#3E8A4E']
  };
  var PELANGI = ['#F28B82', '#FFB067', '#FFDE73', '#8FD39A', '#7EC3EC', '#8E9BE6', '#B89CE3'];

  function g(n) { return 'url(#g-' + n + ')'; }
  function f(n) { return n.toFixed ? +n.toFixed(1) : n; }
  /* Acak berbenih supaya mockup selalu sama (mulberry32) */
  function acak(benih) {
    return function () {
      benih |= 0; benih = benih + 0x6D2B79F5 | 0;
      var t = Math.imul(benih ^ benih >>> 15, 1 | benih);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function defs() {
    var s = '<defs>';
    Object.keys(W).forEach(function (k) {
      s += '<radialGradient id="g-' + k + '" cx="34%" cy="28%" r="80%"><stop offset="0" stop-color="' + W[k][1] + '"/><stop offset=".55" stop-color="' + W[k][0] + '"/><stop offset="1" stop-color="' + W[k][2] + '"/></radialGradient>';
      s += '<linearGradient id="v-' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + W[k][1] + '"/><stop offset=".5" stop-color="' + W[k][0] + '"/><stop offset="1" stop-color="' + W[k][2] + '"/></linearGradient>';
    });
    /* Tekstur sidik jari halus: derau abu-abu 9% dikalikan ke bentuk */
    s += '<filter id="tekstur" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".045 .06" numOctaves="3" seed="7" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .12  0 0 0 0 .14  0 0 0 0 .2  0 0 0 .5 -.2" result="b"/>' +
      '<feComposite in="b" in2="SourceGraphic" operator="in" result="c"/>' +
      '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="c"/></feMerge></filter>';
    s += '<filter id="kabur4" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="4"/></filter>';
    s += '<filter id="kabur10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>';
    s += '<filter id="kabur24" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>';
    s += '<filter id="kelabu"><feColorMatrix type="matrix" values=".55 .12 .05 0 0  .12 .58 .1 0 .02  .12 .14 .72 0 .1  0 0 0 1 0"/></filter>';
    s += '<radialGradient id="sinar" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF4C9" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE08F" stop-opacity=".6"/><stop offset="1" stop-color="#FFC94A" stop-opacity="0"/></radialGradient>';
    s += '<linearGradient id="kaca" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".22"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".04"/><stop offset="1" stop-color="#E9E5FA" stop-opacity=".16"/></linearGradient>';
    s += '<linearGradient id="langit-siang" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE2F6"/><stop offset=".7" stop-color="#E4F4F6"/><stop offset="1" stop-color="#F3F8EE"/></linearGradient>';
    s += '<linearGradient id="langit-fajar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7ABEB"/><stop offset=".45" stop-color="#E7C9E0"/><stop offset=".8" stop-color="#FFE3A8"/><stop offset="1" stop-color="#FFEFC7"/></linearGradient>';
    s += '<linearGradient id="dinding" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF5EC"/><stop offset="1" stop-color="#C3E9DC"/></linearGradient>';
    s += '<linearGradient id="logo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".55" stop-color="#FFC94A"/><stop offset="1" stop-color="#F2A93B"/></linearGradient>';
    return s + '</defs>';
  }

  function bayang(cx, cy, rx, ry, op) {
    return '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="#142836" opacity="' + (op || .22) + '" filter="url(#kabur4)"/>';
  }

  /* ---------- Cuaca ---------- */
  function awan(x, y, s, warna) {
    var w = g(warna || 'susu');
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' +
      '<rect x="-60" y="-8" width="120" height="36" rx="18" fill="' + w + '"/>' +
      '<circle cx="-31" cy="-2" r="27" fill="' + w + '"/><circle cx="33" cy="-1" r="25" fill="' + w + '"/>' +
      '<circle cx="1" cy="-17" r="33" fill="' + w + '"/>' +
      '<ellipse cx="-12" cy="-30" rx="12" ry="7" fill="#FFFFFF" opacity=".55"/></g>';
  }
  function tetes(x, y, s, warna) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')"><path d="M0,-16 C6,-7 11,-1 11,5 A11,11 0 1,1 -11,5 C-11,-1 -6,-7 0,-16 Z" fill="' + g(warna || 'biru') + '"/>' +
      '<ellipse cx="-4" cy="2" rx="3" ry="5" fill="#FFFFFF" opacity=".6"/></g>';
  }
  function keping(x, y, s) {
    var t = '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">';
    for (var i = 0; i < 6; i++) {
      t += '<g transform="rotate(' + i * 60 + ')"><rect x="-4" y="-22" width="8" height="22" rx="4" fill="' + g('susu') + '"/><circle cx="0" cy="-22" r="5" fill="' + g('susu') + '"/></g>';
    }
    return t + '<circle r="7" fill="' + g('susu') + '"/></g>';
  }
  /* Garis hujan ringan di antara x1-x2, y1-y2 */
  function hujan(x1, x2, y1, y2, n, benih) {
    var r = acak(benih || 3), t = '<g opacity=".9">';
    for (var i = 0; i < n; i++) {
      var x = x1 + r() * (x2 - x1), y = y1 + r() * (y2 - y1 - 18);
      t += '<path d="M' + f(x) + ',' + f(y) + ' l-3,16" stroke="#7DBCEB" stroke-width="4.5" stroke-linecap="round"/>';
    }
    return t + '</g>';
  }
  function pelangi(cx, cy, r, lebar, op) {
    var t = '<g opacity="' + (op || .9) + '" fill="none">';
    PELANGI.forEach(function (c, i) {
      var rr = r - i * lebar;
      t += '<path d="M' + f(cx - rr) + ',' + f(cy) + ' A' + f(rr) + ',' + f(rr) + ' 0 0 1 ' + f(cx + rr) + ',' + f(cy) + '" stroke="' + c + '" stroke-width="' + f(lebar + .8) + '"/>';
    });
    return t + '<path d="M' + f(cx - r - lebar / 2 + 2) + ',' + f(cy) + ' A' + f(r + lebar / 2 - 2) + ',' + f(r + lebar / 2 - 2) + ' 0 0 1 ' + f(cx + r + lebar / 2 - 2) + ',' + f(cy) + '" stroke="#FFFFFF" stroke-width="2" opacity=".5"/></g>';
  }
  function sinar(cx, cy, r) {
    var t = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#sinar)"/><g opacity=".22" fill="#FFF4C9">';
    for (var i = 0; i < 7; i++) {
      var a = (110 + i * 13) * Math.PI / 180, a2 = a + .07;
      t += '<path d="M' + cx + ',' + cy + ' L' + f(cx + Math.cos(a) * r * 2) + ',' + f(cy + Math.sin(a) * r * 2) + ' L' + f(cx + Math.cos(a2) * r * 2) + ',' + f(cy + Math.sin(a2) * r * 2) + ' Z"/>';
    }
    return t + '</g>';
  }
  function burung(x, y, s) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M-12,0 Q-6,-8 0,0 Q6,-8 12,0" stroke="#3D5E73" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>';
  }

  /* ---------- Benda lembah ---------- */
  function rumah(x, y, s, atap) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' + bayang(0, 2, 22, 4, .25) +
      '<rect x="-17" y="-24" width="34" height="26" rx="6" fill="' + g('susu') + '"/>' +
      '<path d="M-23,-21 Q-24,-25 -20,-28 L-3,-43 Q0,-46 3,-43 L20,-28 Q24,-25 23,-21 Q0,-17 -23,-21 Z" fill="' + g(atap) + '"/>' +
      '<rect x="-5" y="-13" width="10" height="15" rx="4" fill="' + g('kayu') + '"/>' +
      '<rect x="-14" y="-18" width="7" height="7" rx="2" fill="#8CC8F0"/><rect x="7" y="-18" width="7" height="7" rx="2" fill="#8CC8F0"/></g>';
  }
  function pohon(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' + bayang(0, 2, 26, 5, .25) +
      '<rect x="-6" y="-34" width="12" height="36" rx="6" fill="' + g('kayu') + '"/>' +
      '<circle cx="-18" cy="-44" r="20" fill="' + g('daun') + '"/><circle cx="18" cy="-46" r="19" fill="' + g('daun') + '"/>' +
      '<circle cx="0" cy="-62" r="25" fill="' + g('daun') + '"/></g>';
  }
  function bunga(x, y, s, warna) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')"><rect x="-1.2" y="-8" width="2.4" height="8" fill="#4C9A5B"/>' +
      '<circle cx="0" cy="-10" r="4" fill="' + g(warna) + '"/><circle cx="0" cy="-10" r="1.5" fill="#FFE08F"/></g>';
  }
  function warga(x, y, s, baju, kulit) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' + bayang(0, 1, 7, 2, .3) +
      '<rect x="-5" y="-15" width="10" height="15" rx="5" fill="' + g(baju) + '"/><circle cx="0" cy="-19" r="5.5" fill="' + g(kulit || 'kulit1') + '"/></g>';
  }
  function layang(x, y, s, rot) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + (rot || 0) + ') scale(' + s + ')">' +
      '<path d="M0,26 q-6,14 4,24 q10,10 2,22" stroke="#FF8A6B" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M0,-30 Q3,-28 22,-2 Q24,1 22,4 L3,26 Q0,29 -3,26 L-22,4 Q-24,1 -22,-2 Q-3,-28 0,-30 Z" fill="' + g('koral') + '"/>' +
      '<path d="M0,-28 L0,26 M-21,1 L21,1" stroke="#FFE08F" stroke-width="3" opacity=".9"/>' +
      '<path d="M0,-30 Q3,-28 22,-2 L0,1 Z" fill="' + g('kuning') + '" opacity=".95"/></g>';
  }
  function payung(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' +
      '<path d="M0,-4 L0,30 q0,8 -7,8 q-6,0 -6,-6" stroke="' + W.kayu[2] + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M-36,0 Q-34,-34 0,-36 Q34,-34 36,0 Q30,-6 24,0 Q18,-6 12,0 Q6,-6 0,0 Q-6,-6 -12,0 Q-18,-6 -24,0 Q-30,-6 -36,0 Z" fill="' + g('biru') + '"/>' +
      '<circle cx="0" cy="-37" r="4" fill="' + g('kuning') + '"/></g>';
  }
  function perahu(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' +
      '<path d="M-40,-10 L40,-10 Q38,10 18,12 L-18,12 Q-38,10 -40,-10 Z" fill="' + g('koral') + '"/>' +
      '<path d="M-38,-4 L38,-4" stroke="#FBF8F2" stroke-width="5" opacity=".9"/>' +
      '<rect x="-30" y="-14" width="60" height="6" rx="3" fill="' + g('kayu') + '"/></g>';
  }
  function katak(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' + bayang(0, 2, 22, 4, .25) +
      '<ellipse cx="0" cy="-12" rx="22" ry="15" fill="' + g('lumut') + '"/>' +
      '<circle cx="-10" cy="-26" r="8" fill="' + g('lumut') + '"/><circle cx="10" cy="-26" r="8" fill="' + g('lumut') + '"/>' +
      '<circle cx="-10" cy="-27" r="4" fill="#1E3A4C"/><circle cx="10" cy="-27" r="4" fill="#1E3A4C"/>' +
      '<circle cx="-11" cy="-29" r="1.4" fill="#fff"/><circle cx="9" cy="-29" r="1.4" fill="#fff"/>' +
      '<path d="M-8,-12 Q0,-7 8,-12" stroke="#2F6B3B" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>';
  }
  function daunGugur(x, y, s, rot) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + (rot || 0) + ') scale(' + s + ')"><path d="M0,-18 Q14,-8 0,18 Q-14,-8 0,-18 Z" fill="' + g('lumut') + '"/><path d="M0,-14 L0,16" stroke="#4C9A5B" stroke-width="2"/></g>';
  }
  function ikan(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')"><path d="M18,0 L32,-11 Q34,0 32,11 Z" fill="' + g('koral') + '"/>' +
      '<ellipse cx="0" cy="0" rx="22" ry="13" fill="' + g('koral') + '"/><circle cx="-11" cy="-3" r="3" fill="#1E3A4C"/></g>';
  }
  function genangan(x, y, s) {
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')"><ellipse rx="30" ry="9" fill="' + g('biru') + '"/><ellipse cx="-8" cy="-2" rx="12" ry="3" fill="#fff" opacity=".45"/></g>';
  }

  /* ---------- Lembah Embun (620 x 420 lokal) ----------
     o: { bunga: bool, warga: bool, salju: bool } */
  function lembah(o) {
    o = o || {};
    var t = '<rect width="620" height="420" fill="url(#langit-siang)"/>';
    if (o.sinar) t += sinar(o.sinar[0], o.sinar[1], o.sinar[2]);
    if (o.pelangi) t += pelangi(o.pelangi[0], o.pelangi[1], o.pelangi[2], o.pelangi[3]);
    if (o.awan) o.awan.forEach(function (a) { t += awan(a[0], a[1], a[2], a[3]); });
    if (o.hujan) t += o.hujan;
    t += '<g filter="url(#tekstur)">';
    /* bukit jauh */
    t += '<path d="M0,250 Q70,205 150,232 Q230,198 320,226 Q410,196 500,224 Q570,206 620,220 L620,300 L0,300 Z" fill="' + g('mint') + '" opacity=".95"/>';
    /* gunung */
    t += '<path d="M-10,320 Q20,250 60,170 Q84,118 104,116 Q126,116 150,168 Q190,250 250,300 L250,330 L-10,330 Z" fill="' + g('batu') + '"/>';
    t += '<path d="M36,240 Q70,214 98,236 Q120,250 150,232" stroke="#D8D4E4" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (o.salju) t += '<path d="M78,140 Q92,114 104,114 Q118,114 132,142 Q120,150 112,142 Q104,152 96,142 Q86,150 78,140 Z" fill="' + g('susu') + '"/>';
    /* tanah dasar */
    t += '<path d="M0,292 Q120,266 260,282 Q400,262 620,280 L620,420 L0,420 Z" fill="' + g('lumut') + '"/>';
    /* sawah bertingkat */
    for (var i = 0; i < 4; i++) {
      var y = 286 + i * 17, x = 118 - i * 10, w = 150 + i * 20;
      t += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="22" rx="11" fill="' + g(i % 2 ? 'lumut' : 'daun') + '"/>' +
        '<rect x="' + (x + 8) + '" y="' + (y + 2) + '" width="' + (w - 16) + '" height="4" rx="2" fill="#B5E6B8" opacity=".8"/>';
    }
    /* jalan setapak */
    t += '<path d="M300,420 Q290,380 330,360 Q380,336 420,348 Q470,362 500,346" stroke="' + W.pasir[0] + '" stroke-width="14" fill="none" stroke-linecap="round" opacity=".95"/>';
    /* tambak garam */
    for (var k = 0; k < 3; k++) {
      t += '<rect x="' + (404 + k * 34) + '" y="314" width="30" height="20" rx="6" fill="' + g('pasir') + '"/><rect x="' + (407 + k * 34) + '" y="317" width="24" height="14" rx="4" fill="#E2EEF3"/>';
      if (o.garam) t += '<ellipse cx="' + (419 + k * 34) + '" cy="327" rx="8" ry="4" fill="' + g('garam') + '"/>';
    }
    /* pantai dan danau */
    t += '<ellipse cx="540" cy="378" rx="112" ry="30" fill="' + g('pasir') + '"/>';
    t += '<ellipse cx="548" cy="364" rx="98" ry="30" fill="' + g('biru') + '"/><ellipse cx="520" cy="356" rx="46" ry="7" fill="#FFFFFF" opacity=".35"/>';
    t += '<rect x="466" y="356" width="44" height="8" rx="3" fill="' + g('kayu') + '"/><rect x="470" y="362" width="5" height="12" rx="2" fill="' + W.kayu[2] + '"/><rect x="500" y="362" width="5" height="12" rx="2" fill="' + W.kayu[2] + '"/>';
    /* desa */
    t += '<ellipse cx="350" cy="330" rx="78" ry="20" fill="' + g('pasir') + '" opacity=".9"/>';
    t += pohon(350, 316, .82);
    t += rumah(292, 326, .9, 'koral') + rumah(318, 342, .8, 'lavender') + rumah(388, 342, .85, 'koral') + rumah(412, 326, .75, 'lavender');
    /* tepi diorama: lempeng tanah di depan */
    t += '<path d="M0,396 Q310,384 620,396 L620,420 L0,420 Z" fill="' + g('tanah') + '"/>';
    t += '</g>';
    if (o.bunga) {
      var r = acak(11);
      for (var b = 0; b < 16; b++) t += bunga(110 + r() * 170, 298 + r() * 60, .9, b % 2 ? 'koral' : 'kuning');
    }
    if (o.warga) t += warga(334, 352, 1, 'kuning', 'kulit1') + warga(352, 356, 1, 'biru', 'kulit3') + warga(372, 350, .9, 'koral', 'kulit2');
    if (o.tambahan) t += o.tambahan;
    return t;
  }

  /* ---------- Kubah dan alas ---------- */
  function lengkung(x0, y0, w, h) {
    var r = w / 2, cy = y0 + r;
    return 'M' + x0 + ',' + (y0 + h) + ' L' + x0 + ',' + cy + ' A' + r + ',' + r + ' 0 0 1 ' + (x0 + w) + ',' + cy + ' L' + (x0 + w) + ',' + (y0 + h) + ' Z';
  }
  function kubah(x0, y0, w, h, isi, id) {
    id = id || 'klip-kubah';
    var p = lengkung(x0, y0, w, h), r = w / 2;
    var t = '<clipPath id="' + id + '"><path d="' + p + '"/></clipPath>';
    t += '<g clip-path="url(#' + id + ')"><g transform="translate(' + x0 + ' ' + y0 + ') scale(' + (w / 620) + ' ' + (h / 420) + ')">' + isi + '</g></g>';
    /* kaca */
    t += '<path d="' + p + '" fill="url(#kaca)" stroke="#F4FAFD" stroke-width="5" opacity=".95"/>';
    t += '<path d="' + p + '" fill="none" stroke="#8D9BB8" stroke-width="2" opacity=".55"/>';
    t += '<path d="M' + (x0 + 40) + ',' + (y0 + r + 60) + ' A' + (r - 40) + ',' + (r - 40) + ' 0 0 1 ' + (x0 + r - 70) + ',' + (y0 + 46) + '" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linecap="round" opacity=".5"/>';
    t += '<path d="M' + (x0 + 70) + ',' + (y0 + r + 40) + ' A' + (r - 70) + ',' + (r - 70) + ' 0 0 1 ' + (x0 + 96) + ',' + (y0 + r - 80) + '" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>';
    t += '<circle cx="' + (x0 + w - 70) + '" cy="' + (y0 + 86) + '" r="7" fill="#FFFFFF" opacity=".55"/>';
    return t;
  }
  function alas(x0, y0, w, h) {
    var cx = x0 + w / 2;
    return bayang(cx, y0 + h + 4, w / 2 + 10, 12, .3) +
      '<rect x="' + x0 + '" y="' + (y0 + 14) + '" width="' + w + '" height="' + (h - 14) + '" rx="22" fill="' + g('batu') + '"/>' +
      '<rect x="' + (x0 + 12) + '" y="' + y0 + '" width="' + (w - 24) + '" height="28" rx="14" fill="' + g('kayu') + '"/>' +
      '<rect x="' + (x0 + 30) + '" y="' + (y0 + 4) + '" width="' + (w - 60) + '" height="5" rx="2.5" fill="#E8C29C" opacity=".8"/>';
  }

  /* ---------- Ruang stasiun ---------- */
  function ruangStasiun(o) {
    o = o || {};
    var t = '<rect width="1280" height="720" fill="url(#dinding)"/>';
    t += '<g filter="url(#tekstur)">';
    for (var i = 0; i < 7; i++) t += '<rect x="' + (i * 190 - 30) + '" y="150" width="172" height="440" rx="40" fill="#D6F2E8" opacity=".9"/>';
    t += '<rect x="0" y="588" width="1280" height="16" fill="' + g('mint') + '"/>';
    t += '<rect x="0" y="604" width="1280" height="116" fill="url(#v-kayu)"/>';
    for (var j = 0; j < 9; j++) t += '<rect x="' + (j * 150 + 40) + '" y="604" width="4" height="116" fill="#94643C" opacity=".35"/>';
    t += '</g>';
    if (o.jendela) {
      var jx = o.jendela[0], jy = o.jendela[1], jw = o.jendela[2], jh = o.jendela[3];
      t += '<clipPath id="klip-jendela"><path d="' + lengkung(jx, jy, jw, jh) + '"/></clipPath>';
      t += '<g clip-path="url(#klip-jendela)"><rect x="' + jx + '" y="' + jy + '" width="' + jw + '" height="' + jh + '" fill="url(#langit-siang)"/>' +
        awan(jx + jw * .45, jy + jh * .42, .42) + burung(jx + jw * .7, jy + jh * .25, .8) +
        '<path d="M' + jx + ',' + (jy + jh) + ' Q' + (jx + jw * .5) + ',' + (jy + jh * .8) + ' ' + (jx + jw) + ',' + (jy + jh * .9) + ' L' + (jx + jw) + ',' + (jy + jh) + ' Z" fill="' + g('lumut') + '"/></g>';
      t += '<path d="' + lengkung(jx, jy, jw, jh) + '" fill="none" stroke="' + g('kayu') + '" stroke-width="12"/>';
      t += '<path d="M' + (jx + jw / 2) + ',' + jy + ' L' + (jx + jw / 2) + ',' + (jy + jh) + '" stroke="' + W.kayu[0] + '" stroke-width="6"/>';
      t += '<rect x="' + (jx - 12) + '" y="' + (jy + jh) + '" width="' + (jw + 24) + '" height="14" rx="7" fill="' + g('kayu') + '"/>';
    }
    return t;
  }

  /* Stasiun dari luar (layar judul) */
  function stasiunLuar(cx, by) {
    var t = '<g filter="url(#tekstur)">';
    t += '<rect x="' + (cx - 150) + '" y="' + (by - 130) + '" width="300" height="134" rx="34" fill="' + g('susu') + '"/>';
    t += '<rect x="' + (cx - 160) + '" y="' + (by - 146) + '" width="320" height="30" rx="15" fill="' + g('kayu') + '"/>';
    t += '<rect x="' + (cx - 26) + '" y="' + (by - 70) + '" width="52" height="74" rx="24" fill="' + g('koral') + '"/><circle cx="' + (cx + 14) + '" cy="' + (by - 32) + '" r="4" fill="' + g('kuning') + '"/>';
    t += '<circle cx="' + (cx - 90) + '" cy="' + (by - 70) + '" r="22" fill="' + g('lavender') + '"/><circle cx="' + (cx - 90) + '" cy="' + (by - 70) + '" r="14" fill="#FFE9A8"/>';
    t += '<circle cx="' + (cx + 90) + '" cy="' + (by - 70) + '" r="22" fill="' + g('lavender') + '"/><circle cx="' + (cx + 90) + '" cy="' + (by - 70) + '" r="14" fill="#FFE9A8"/>';
    t += '</g>';
    /* kubah atap bercahaya */
    var r = 128, ky = by - 146;
    t += '<circle cx="' + cx + '" cy="' + (ky - 50) + '" r="150" fill="url(#sinar)" opacity=".75"/>';
    t += '<clipPath id="klip-atap"><path d="M' + (cx - r) + ',' + ky + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + r) + ',' + ky + ' Z"/></clipPath>';
    t += '<g clip-path="url(#klip-atap)"><rect x="' + (cx - r) + '" y="' + (ky - r) + '" width="' + 2 * r + '" height="' + r + '" fill="#DDF1F6"/>' +
      pelangi(cx, ky + 10, 92, 7, .85) + awan(cx - 54, ky - 60, .38) +
      '<path d="M' + (cx - r) + ',' + ky + ' Q' + (cx - 40) + ',' + (ky - 40) + ' ' + cx + ',' + (ky - 18) + ' Q' + (cx + 60) + ',' + (ky - 44) + ' ' + (cx + r) + ',' + (ky - 10) + ' L' + (cx + r) + ',' + ky + ' Z" fill="' + g('lumut') + '"/>' +
      rumah(cx + 30, ky - 14, .6, 'koral') + '</g>';
    t += '<path d="M' + (cx - r) + ',' + ky + ' A' + r + ',' + r + ' 0 0 1 ' + (cx + r) + ',' + ky + '" fill="url(#kaca)" stroke="#F4FAFD" stroke-width="5"/>';
    t += '<path d="M' + (cx - r + 28) + ',' + (ky - 20) + ' A' + (r - 28) + ',' + (r - 28) + ' 0 0 1 ' + (cx - 30) + ',' + (ky - r + 26) + '" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>';
    /* anemometer di puncak kubah */
    var ay = ky - r;
    t += '<rect x="' + (cx - 3) + '" y="' + (ay - 46) + '" width="6" height="48" rx="3" fill="' + W.tinta[1] + '"/>';
    t += '<path d="M' + (cx - 30) + ',' + (ay - 46) + ' L' + (cx + 30) + ',' + (ay - 46) + '" stroke="' + W.tinta[1] + '" stroke-width="4"/>';
    t += '<circle cx="' + (cx - 32) + '" cy="' + (ay - 46) + '" r="9" fill="' + g('koral') + '"/><circle cx="' + (cx + 32) + '" cy="' + (ay - 46) + '" r="9" fill="' + g('koral') + '"/><circle cx="' + cx + '" cy="' + (ay - 52) + '" r="8" fill="' + g('kuning') + '"/>';
    /* kantong angin */
    var wx = cx + 176, wy = by - 220;
    t += '<rect x="' + (wx - 3) + '" y="' + wy + '" width="6" height="210" rx="3" fill="' + W.tinta[1] + '"/>';
    t += '<g transform="translate(' + wx + ' ' + (wy + 10) + ') rotate(8)"><path d="M0,-14 L72,-8 L72,8 L0,14 Z" fill="' + g('susu') + '"/>' +
      '<path d="M0,-14 L18,-12.5 L18,12.5 L0,14 Z M36,-11 L54,-9.5 L54,9.5 L36,11 Z" fill="' + g('koral') + '"/></g>';
    return t;
  }

  /* ---------- Kumu ---------- */
  function kumu(x, y, s, eks) {
    var berat = eks === 'berat', w = berat ? 'kelabu' : 'susu', sk = berat ? 1.15 : 1;
    var t = '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s * sk) + ')' + (eks === 'heran' ? ' rotate(-7)' : '') + '">';
    t += bayang(0, 70, 34, 6, .16);
    if (eks === 'bersorak') t += pelangi(0, -38, 34, 4.2, .95) + '<path d="M-58,-46 l4,8 l8,4 l-8,4 l-4,8 l-4,-8 l-8,-4 l8,-4 Z M54,-56 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 Z" fill="#FFE08F"/>';
    t += '<g filter="url(#tekstur)">' + awan(0, 0, 1, w) + '</g>';
    if (berat) t += tetes(-24, 50, .5) + tetes(4, 62, .5) + tetes(28, 50, .5);
    t += wajahKumu(eks);
    return t + '</g>';
  }

  function wajahKumu(eks) {
    var t = '', berat = eks === 'berat';
    var c = '#1E3A4C';
    t += '<ellipse cx="-27" cy="10" rx="8" ry="5" fill="#FF8A6B" opacity=".55"/><ellipse cx="27" cy="10" rx="8" ry="5" fill="#FF8A6B" opacity=".55"/>';
    if (eks === 'senang' || !eks) {
      t += '<ellipse cx="-14" cy="-2" rx="5.5" ry="7.5" fill="' + c + '"/><ellipse cx="14" cy="-2" rx="5.5" ry="7.5" fill="' + c + '"/>' +
        '<circle cx="-12.5" cy="-5" r="2.2" fill="#fff"/><circle cx="15.5" cy="-5" r="2.2" fill="#fff"/>' +
        '<path d="M-7,9 Q0,16 7,9" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    } else if (eks === 'heran') {
      t += '<ellipse cx="-14" cy="-1" rx="5" ry="6.5" fill="' + c + '"/><ellipse cx="14" cy="-3" rx="6.5" ry="9" fill="' + c + '"/>' +
        '<circle cx="-12.5" cy="-3.5" r="2" fill="#fff"/><circle cx="16" cy="-6.5" r="2.4" fill="#fff"/>' +
        '<path d="M8,-17 Q14,-21 21,-17" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="1" cy="12" rx="4" ry="4.6" fill="' + c + '"/>';
    } else if (berat) {
      t += '<path d="M-20,-1 Q-14,3 -8,-1 M8,-1 Q14,3 20,-1" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M-6,11 Q0,8 6,11" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } else if (eks === 'bersorak') {
      t += '<path d="M-20,1 Q-14,-8 -8,1 M8,1 Q14,-8 20,1" stroke="' + c + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
        '<path d="M-10,6 Q0,24 10,6 Z" fill="#8E3B2F"/><path d="M-5,14 Q0,19 5,14 Q0,12 -5,14 Z" fill="#FF8A6B"/>';
    } else if (eks === 'kedip') {
      t += '<path d="M-20,-1 L-8,-1 M8,-1 L20,-1" stroke="' + c + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M-7,9 Q0,16 7,9" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    }
    return t;
  }

  var AKAR = (typeof location !== 'undefined' && /\/mockup\//.test(location.pathname)) ? '../' : '';
  function gambar(src, x, y, w, h, ekstra) {
    return '<image href="' + AKAR + src + '" x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" preserveAspectRatio="xMidYMid meet"' + (ekstra || '') + '/>';
  }
  function benda(kode, cx, cy, w, ekstra) {
    var b = (window.ASET && ASET.benda[kode]) || { src: 'assets/img/benda/' + kode + '.webp', w: 256, h: 256 }, h = w * b.h / b.w;
    return gambar(b.src, cx - w / 2, cy - h / 2, w, h, ekstra);
  }
  /* Kumu dari gambar (tubuh plastisin) dengan wajah SVG supaya bisa berkedip dan berganti ekspresi */
  function kumuGambar(cx, cy, w, eks) {
    var h = w * 268 / 360, s = w / 128, t = '';
    if (eks === 'bersorak') t += benda('pelangi', cx, cy - h * .62, w * .72);
    t += bayang(cx, cy + h * .62, w * .32, 6, .18);
    t += gambar('assets/img/kumu-badan.webp', cx - w / 2, cy - h / 2, w, h, eks === 'berat' ? ' filter="url(#kelabu)"' : '');
    if (eks === 'berat') t += benda('tetes', cx - w * .2, cy + h * .62, w * .11) + benda('tetes', cx + w * .02, cy + h * .74, w * .11) + benda('tetes', cx + w * .22, cy + h * .62, w * .11);
    t += '<g transform="translate(' + f(cx) + ' ' + f(cy + h * .1) + ') scale(' + f(s) + ')' + (eks === 'heran' ? ' rotate(-6)' : '') + '">' + wajahKumu(eks) + '</g>';
    return t;
  }
  /* Kubah lebar seperti key art: alas elips di (cx, by), lebar w, puncak di y top. isi = SVG dalam koordinat layar. */
  function jalurKubah(cx, by, w, top) {
    var x0 = cx - w / 2, x1 = cx + w / 2, ry = w * .072, bahu = top + (by - top) * .5;
    return 'M' + x0 + ',' + by + ' L' + (x0 + 2) + ',' + f(bahu) + ' C' + (x0 + 4) + ',' + f(top + 40) + ' ' + f(cx - w * .26) + ',' + top + ' ' + cx + ',' + top +
      ' C' + f(cx + w * .26) + ',' + top + ' ' + (x1 - 4) + ',' + f(top + 40) + ' ' + (x1 - 2) + ',' + f(bahu) + ' L' + x1 + ',' + by + ' A' + (w / 2) + ',' + f(ry) + ' 0 0 1 ' + x0 + ',' + by + ' Z';
  }
  function kubahLebar(cx, by, w, top, isi) {
    var p = jalurKubah(cx, by, w, top), ry = w * .072, t = '';
    t += '<clipPath id="klip-kubah"><path d="' + p + '"/></clipPath>';
    t += '<g clip-path="url(#klip-kubah)">' + isi + '</g>';
    t += '<path d="' + p + '" fill="url(#kaca)"/>';
    t += '<path d="' + p + '" fill="none" stroke="#F4FAFD" stroke-width="5" opacity=".9"/>';
    t += '<path d="' + p + '" fill="none" stroke="#7F90B0" stroke-width="2" opacity=".5"/>';
    /* kilau kaca */
    t += '<path d="M' + (cx - w / 2 + 34) + ',' + (by - 40) + ' C' + (cx - w / 2 + 30) + ',' + (top + 120) + ' ' + (cx - w * .3) + ',' + (top + 34) + ' ' + (cx - w * .12) + ',' + (top + 22) + '" stroke="#FFFFFF" stroke-width="13" fill="none" stroke-linecap="round" opacity=".42"/>';
    t += '<path d="M' + (cx - w / 2 + 62) + ',' + (by - 120) + ' C' + (cx - w / 2 + 60) + ',' + (top + 160) + ' ' + (cx - w * .33) + ',' + (top + 80) + ' ' + (cx - w * .27) + ',' + (top + 68) + '" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>';
    t += '<ellipse cx="' + (cx + w * .36) + '" cy="' + (top + 70) + '" rx="9" ry="14" fill="#FFFFFF" opacity=".5" transform="rotate(35 ' + (cx + w * .36) + ' ' + (top + 70) + ')"/>';
    /* cincin dasar kaca dan tombol puncak (seperti key art) */
    t += '<path d="M' + (cx - w / 2) + ',' + by + ' A' + (w / 2) + ',' + f(ry) + ' 0 0 0 ' + (cx + w / 2) + ',' + by + '" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".6"/>';
    t += '<g filter="url(#tekstur)"><ellipse cx="' + cx + '" cy="' + (top - 2) + '" rx="46" ry="12" fill="' + g('koral') + '"/><ellipse cx="' + cx + '" cy="' + (top - 12) + '" rx="30" ry="15" fill="' + g('susu') + '"/></g>';
    return t;
  }

  /* ---------- Orang (Kak Bayu dan warga) ----------
     o: { kulit, rambut:'pendek'|'ikal'|'uban'|'kerudung'|'caping'|'topi', warnaRambut, baju, rompi, syal, celana, rok, kacamata,
          pose:'diam'|'lambai'|'pikir'|'sorak', wajah:'senyum'|'pikir'|'sorak'|'cemas', bawa:'garu'|'layang'|'jala'|'gembor' } */
  function lengan(sx, sy, sudut, panjang, warna, kulit) {
    var a = sudut * Math.PI / 180, ex = sx - panjang * Math.sin(a), ey = sy + panjang * Math.cos(a);
    return '<g transform="translate(' + sx + ' ' + sy + ') rotate(' + sudut + ')"><rect x="-9" y="-6" width="18" height="' + (panjang + 6) + '" rx="9" fill="' + g(warna) + '"/></g>' +
      '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="9.5" fill="' + g(kulit) + '"/>';
  }
  function tangan(sx, sy, sudut, panjang) {
    var a = sudut * Math.PI / 180;
    return [sx - panjang * Math.sin(a), sy + panjang * Math.cos(a)];
  }
  function orang(x, y, s, o) {
    var k = o.kulit || 'kulit1', baju = o.baju || 'susu', pose = o.pose || 'diam', c = '#1E3A4C';
    var t = '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')">' + bayang(0, 0, 50, 8, .25) + '<g filter="url(#tekstur)">';
    /* sudut lengan: 0 = lurus ke bawah */
    var L = { diam: [18, 52], lambai: [18, 52], pikir: [18, 52], sorak: [150, 52] }[pose];
    var R = { diam: [-18, 52], lambai: [-158, 52], pikir: [101, 26], sorak: [-150, 52] }[pose];
    /* kaki */
    if (o.rok) t += '<path d="M-30,-82 L30,-82 L36,-18 Q0,-12 -36,-18 Z" fill="' + g(o.rok) + '"/>';
    else t += '<rect x="-25" y="-86" width="22" height="76" rx="11" fill="' + g(o.celana || 'tinta') + '"/><rect x="3" y="-86" width="22" height="76" rx="11" fill="' + g(o.celana || 'tinta') + '"/>';
    t += '<rect x="-30" y="-18" width="27" height="16" rx="8" fill="' + g('tinta') + '"/><rect x="3" y="-18" width="27" height="16" rx="8" fill="' + g('tinta') + '"/>';
    /* badan */
    t += '<rect x="-34" y="-156" width="68" height="82" rx="26" fill="' + g(baju) + '"/>';
    if (o.rompi) t += '<path d="M-34,-130 Q-34,-156 -12,-156 L-8,-74 L-34,-74 Z" fill="' + g(o.rompi) + '"/><path d="M34,-130 Q34,-156 12,-156 L8,-74 L34,-74 Z" fill="' + g(o.rompi) + '"/>' +
      '<rect x="-30" y="-110" width="16" height="14" rx="4" fill="' + W[o.rompi][2] + '" opacity=".7"/><rect x="14" y="-110" width="16" height="14" rx="4" fill="' + W[o.rompi][2] + '" opacity=".7"/>' +
      '<circle cx="21" cy="-134" r="7" fill="' + g('kuning') + '"/><path d="M15,-134 L27,-134 M21,-140 L21,-128" stroke="' + c + '" stroke-width="1.6"/>';
    if (o.garis) t += '<path d="M-33,-136 L33,-136 M-33,-118 L33,-118 M-33,-100 L33,-100" stroke="' + W[o.garis][2] + '" stroke-width="5" opacity=".6"/>';
    if (o.kardigan) t += '<path d="M-34,-132 Q-34,-156 -14,-156 L-6,-74 L-34,-74 Z M34,-132 Q34,-156 14,-156 L6,-74 L34,-74 Z" fill="' + g(o.kardigan) + '"/>';
    /* lengan */
    var lw = o.lenganWarna || o.kardigan || baju;
    t += lengan(-30, -144, L[0], L[1], lw, k) + lengan(30, -144, R[0], R[1], lw, k);
    /* syal */
    if (o.syal) t += '<rect x="-30" y="-162" width="60" height="16" rx="8" fill="' + g(o.syal) + '"/><rect x="10" y="-152" width="15" height="40" rx="7" fill="' + g(o.syal) + '" transform="rotate(-8 17 -152)"/>';
    /* kepala */
    var hy = -196;
    if (o.rambut === 'kerudung') {
      t += '<path d="M-50,' + (hy + 4) + ' Q-52,' + (hy - 56) + ' 0,' + (hy - 56) + ' Q52,' + (hy - 56) + ' 50,' + (hy + 4) + ' Q56,' + (hy + 48) + ' 34,' + (hy + 52) + ' L-34,' + (hy + 52) + ' Q-56,' + (hy + 48) + ' -50,' + (hy + 4) + ' Z" fill="' + g(o.warnaRambut || 'lumut') + '"/>' +
        '<ellipse cx="0" cy="' + (hy + 4) + '" rx="34" ry="38" fill="' + g(k) + '"/>';
    } else {
      t += '<circle cx="-43" cy="' + (hy + 4) + '" r="8" fill="' + g(k) + '"/><circle cx="43" cy="' + (hy + 4) + '" r="8" fill="' + g(k) + '"/>';
      t += '<circle cx="0" cy="' + hy + '" r="44" fill="' + g(k) + '"/>';
      var wr = o.warnaRambut || (o.rambut === 'uban' ? 'uban' : 'rambut');
      if (o.rambut === 'ikal') t += '<path d="M-44,' + (hy - 2) + ' Q-48,' + (hy - 48) + ' 0,' + (hy - 50) + ' Q48,' + (hy - 48) + ' 44,' + (hy - 2) + ' Q36,' + (hy - 26) + ' 12,' + (hy - 28) + ' Q-20,' + (hy - 30) + ' -44,' + (hy - 2) + ' Z" fill="' + g(wr) + '"/>' +
        '<circle cx="-30" cy="' + (hy - 34) + '" r="13" fill="' + g(wr) + '"/><circle cx="-6" cy="' + (hy - 44) + '" r="14" fill="' + g(wr) + '"/><circle cx="20" cy="' + (hy - 40) + '" r="13" fill="' + g(wr) + '"/>';
      else if (o.rambut === 'pendek' || o.rambut === 'uban') t += '<path d="M-44,' + (hy - 4) + ' Q-46,' + (hy - 50) + ' 0,' + (hy - 48) + ' Q46,' + (hy - 50) + ' 44,' + (hy - 4) + ' Q30,' + (hy - 30) + ' 0,' + (hy - 28) + ' Q-30,' + (hy - 30) + ' -44,' + (hy - 4) + ' Z" fill="' + g(wr) + '"/>';
      if (o.rambut === 'caping') t += '<path d="M-74,' + (hy - 22) + ' Q-40,' + (hy - 56) + ' 0,' + (hy - 72) + ' Q40,' + (hy - 56) + ' 74,' + (hy - 22) + ' Q0,' + (hy - 8) + ' -74,' + (hy - 22) + ' Z" fill="' + g('pasir') + '"/>' +
        '<path d="M-48,' + (hy - 30) + ' Q0,' + (hy - 20) + ' 48,' + (hy - 30) + '" stroke="' + W.pasir[2] + '" stroke-width="3" fill="none"/>';
      if (o.rambut === 'topi') t += '<path d="M-42,' + (hy - 14) + ' Q-40,' + (hy - 52) + ' 0,' + (hy - 52) + ' Q40,' + (hy - 52) + ' 42,' + (hy - 14) + ' Z" fill="' + g('biru') + '"/><rect x="-6" y="' + (hy - 20) + '" width="62" height="12" rx="6" fill="' + g('biru') + '"/>';
    }
    /* wajah */
    var ey = hy + 2, mw = o.wajah || (pose === 'sorak' ? 'sorak' : pose === 'pikir' ? 'pikir' : 'senyum');
    t += '<ellipse cx="-24" cy="' + (ey + 14) + '" rx="8" ry="5" fill="#FF8A6B" opacity=".45"/><ellipse cx="24" cy="' + (ey + 14) + '" rx="8" ry="5" fill="#FF8A6B" opacity=".45"/>';
    if (mw === 'sorak') t += '<path d="M-20,' + ey + ' Q-14,' + (ey - 8) + ' -8,' + ey + ' M8,' + ey + ' Q14,' + (ey - 8) + ' 20,' + ey + '" stroke="' + c + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M-11,' + (ey + 14) + ' Q0,' + (ey + 32) + ' 11,' + (ey + 14) + ' Z" fill="#8E3B2F"/>';
    else {
      var gy = mw === 'pikir' ? -3.5 : -2.5, gx = mw === 'pikir' ? 1.5 : 1;
      t += '<ellipse cx="-14" cy="' + ey + '" rx="5" ry="7" fill="' + c + '"/><ellipse cx="14" cy="' + ey + '" rx="5" ry="7" fill="' + c + '"/>' +
        '<circle cx="' + (-14 + gx) + '" cy="' + (ey + gy) + '" r="2" fill="#fff"/><circle cx="' + (14 + gx) + '" cy="' + (ey + gy) + '" r="2" fill="#fff"/>';
      if (mw === 'pikir') t += '<path d="M-4,' + (ey + 20) + ' Q3,' + (ey + 17) + ' 8,' + (ey + 20) + '" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M6,' + (ey - 15) + ' Q14,' + (ey - 20) + ' 22,' + (ey - 15) + '" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
      else if (mw === 'cemas') t += '<path d="M-7,' + (ey + 21) + ' Q0,' + (ey + 16) + ' 7,' + (ey + 21) + '" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
      else t += '<path d="M-9,' + (ey + 15) + ' Q0,' + (ey + 24) + ' 9,' + (ey + 15) + '" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    }
    if (o.kacamata) t += '<g fill="none" stroke="' + c + '" stroke-width="3"><circle cx="-14" cy="' + ey + '" r="12"/><circle cx="14" cy="' + ey + '" r="12"/><path d="M-2,' + ey + ' L2,' + ey + '"/></g>';
    if (o.kumis) t += '<path d="M-12,' + (ey + 12) + ' Q0,' + (ey + 7) + ' 12,' + (ey + 12) + '" stroke="#9A97A3" stroke-width="5" fill="none" stroke-linecap="round"/>';
    t += '</g>';
    /* barang bawaan di tangan kanan */
    var hp = tangan(30, -144, R[0], R[1]);
    if (o.bawa === 'garu') t += '<rect x="' + (hp[0] - 3) + '" y="' + (hp[1] - 120) + '" width="6" height="150" rx="3" fill="' + g('kayu') + '"/><rect x="' + (hp[0] - 26) + '" y="' + (hp[1] + 26) + '" width="52" height="10" rx="4" fill="' + g('kayu') + '"/>';
    if (o.bawa === 'layang') t += layang(hp[0] + 34, hp[1] - 40, .9, 12) + '<path d="M' + hp[0] + ',' + hp[1] + ' L' + (hp[0] + 34) + ',' + (hp[1] - 20) + '" stroke="#3D5E73" stroke-width="2"/>';
    if (o.bawa === 'jala') t += '<circle cx="' + (hp[0] + 26) + '" cy="' + (hp[1] + 6) + '" r="24" fill="none" stroke="' + W.kayu[0] + '" stroke-width="4"/><path d="M' + (hp[0] + 6) + ',' + (hp[1] + 6) + ' L' + (hp[0] + 46) + ',' + (hp[1] + 6) + ' M' + (hp[0] + 26) + ',' + (hp[1] - 18) + ' L' + (hp[0] + 26) + ',' + (hp[1] + 30) + '" stroke="' + W.kayu[0] + '" stroke-width="2" opacity=".8"/>';
    if (o.bawa === 'gembor') t += '<g transform="translate(' + (hp[0] + 14) + ' ' + (hp[1] + 4) + ')"><rect x="-4" y="-12" width="34" height="28" rx="8" fill="' + g('lumut') + '"/><path d="M28,-6 L48,-20" stroke="' + W.lumut[2] + '" stroke-width="6" stroke-linecap="round"/><path d="M0,-12 Q13,-30 26,-12" stroke="' + W.lumut[2] + '" stroke-width="4" fill="none"/></g>';
    return t + '</g>';
  }
  var TOKOH = {
    bayu: { kulit: 'kulit1', rambut: 'ikal', baju: 'susu', rompi: 'biru', syal: 'kuning', celana: 'lumut', kacamata: true },
    darto: { kulit: 'kulit2', rambut: 'caping', baju: 'susu', celana: 'tanah', kumis: true, bawa: 'garu' },
    dina: { kulit: 'kulit1', rambut: 'kerudung', warnaRambut: 'lumut', baju: 'koral', celana: 'biru', bawa: 'layang' },
    udin: { kulit: 'kulit3', rambut: 'topi', baju: 'lavender', garis: 'lavender', celana: 'tinta', bawa: 'jala' },
    wati: { kulit: 'kulit3', rambut: 'pendek', baju: 'kuning', kardigan: 'biru', rok: 'lavender', kacamata: true, bawa: 'gembor' }
  };
  function tokoh(nama, x, y, s, pose, wajah) {
    var o = Object.assign({}, TOKOH[nama], { pose: pose || 'diam', wajah: wajah });
    return orang(x, y, s, o);
  }

  /* ---------- Lensa (alat antarmuka) ---------- */
  function lensa(cx, cy, r, isi, angka) {
    var t = '<clipPath id="klip-lensa"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath>';
    t += '<g transform="translate(' + (cx + r * .62) + ' ' + (cy + r * .62) + ') rotate(-45)"><rect x="-14" y="0" width="28" height="74" rx="14" fill="' + g('koral') + '" stroke="#1E3A4C" stroke-width="3"/></g>';
    t += '<g clip-path="url(#klip-lensa)"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#E1F1FB"/>' + isi + '</g>';
    t += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" fill="none" stroke="#1E3A4C" stroke-width="18"/>';
    t += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" fill="none" stroke="' + g('kuning') + '" stroke-width="12"/>';
    t += '<path d="M' + (cx - r * .72) + ',' + (cy - r * .3) + ' A' + r * .78 + ',' + r * .78 + ' 0 0 1 ' + (cx - r * .2) + ',' + (cy - r * .74) + '" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/>';
    if (angka !== undefined) {
      var bx = cx + r * .78, by = cy - r * .78;
      t += '<circle cx="' + bx + '" cy="' + by + '" r="22" fill="' + g('koral') + '" stroke="#1E3A4C" stroke-width="3"/>' +
        '<text x="' + bx + '" y="' + (by + 9) + '" text-anchor="middle" font-family="\'Baloo 2\', \'Arial Rounded MT Bold\', sans-serif" font-weight="800" font-size="26" fill="#1E3A4C">' + angka + '</text>';
    }
    return t;
  }

  /* ---------- Ikon antarmuka (garis 3 px Tinta Badai) ---------- */
  function ikon(nama, u, arg) {
    u = u || 36;
    var c = '#1E3A4C', s3 = 'stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"', a = 'fill="none" ' + s3, isi = '';
    switch (nama) {
      case 'dengar': isi = '<path d="M5,14 h6 l8,-7 v22 l-8,-7 h-6 Z" fill="#FFC94A" ' + s3 + '/><path d="M24,12 q4,6 0,12 M28,8 q8,10 0,20" ' + a + '/>'; break;
      case 'pelan': isi = '<path d="M4,28 h22 q6,0 6,-6 v-4 q0,-4 3,-4 h1" ' + a + '/><circle cx="16" cy="18" r="9" fill="#FFB39E" stroke="' + c + '" stroke-width="3"/><path d="M16,18 m0,-4 a4,4 0 1,1 -4,4" ' + a + '/><path d="M33,14 l2,-6 M30,14 l-1,-6" ' + a + '/>'; break;
      case 'jurnal': isi = '<path d="M7,6 h18 q4,0 4,4 v20 h-18 q-4,0 -4,-4 Z" fill="#8CC8F0" ' + s3 + '/><path d="M7,26 q0,4 4,4 M12,12 h11 M12,18 h11" ' + a + '/>'; break;
      case 'jeda': isi = '<rect x="10" y="8" width="5" height="20" rx="2.5" fill="' + c + '"/><rect x="21" y="8" width="5" height="20" rx="2.5" fill="' + c + '"/>'; break;
      case 'atur': isi = '<circle cx="18" cy="18" r="5" ' + a + '/><path d="M18,4 v5 M18,27 v5 M4,18 h5 M27,18 h5 M8,8 l3.5,3.5 M24.5,24.5 L28,28 M8,28 l3.5,-3.5 M24.5,11.5 L28,8" ' + a + '/><circle cx="18" cy="18" r="10" ' + a + '/>'; break;
      case 'suara': isi = '<path d="M5,14 h6 l8,-7 v22 l-8,-7 h-6 Z" fill="#CFEFE4" ' + s3 + '/><path d="M24,13 q3,5 0,10 M28,9 q7,9 0,18" ' + a + '/>'; break;
      case 'penuh': isi = '<path d="M6,13 v-7 h7 M23,6 h7 v7 M30,23 v7 h-7 M13,30 h-7 v-7" ' + a + '/>'; break;
      case 'lensa': isi = '<circle cx="15" cy="15" r="9" fill="#D6ECFA" stroke="' + c + '" stroke-width="3"/><path d="M22,22 l9,9" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/>'; break;
      case 'cerah': isi = '<circle cx="18" cy="18" r="7" fill="#FFC94A" stroke="' + c + '" stroke-width="3"/><path d="M18,3 v4 M18,29 v4 M3,18 h4 M29,18 h4 M7.5,7.5 l2.8,2.8 M25.7,25.7 l2.8,2.8 M7.5,28.5 l2.8,-2.8 M25.7,10.3 l2.8,-2.8" ' + a + '/>'; break;
      case 'main': isi = '<path d="M11,7 L29,18 L11,29 Z" fill="#1E3A4C" stroke="' + c + '" stroke-width="3" stroke-linejoin="round"/>'; break;
      case 'embun': isi = '<path d="M18,4 C23,12 28,17 28,22 A10,10 0 1,1 8,22 C8,17 13,12 18,4 Z" fill="#8CC8F0" stroke="' + c + '" stroke-width="3"/><ellipse cx="14" cy="21" rx="2.5" ry="4" fill="#fff"/>'; break;
      case 'titik': isi = '<circle cx="8.5" cy="18" r="5.5" fill="#FF8A6B" stroke="' + c + '" stroke-width="2.5"/><circle cx="27.5" cy="18" r="5.5" fill="#FF8A6B" stroke="' + c + '" stroke-width="2.5"/>'; break;
      case 'titik1': isi = '<circle cx="18" cy="18" r="7" fill="#FF8A6B" stroke="' + c + '" stroke-width="2.5"/>'; break;
      case 'gelombang': isi = '<path d="M18,4 C22,10 26,14 26,19 A8,8 0 1,1 10,19 C10,14 14,10 18,4 Z" fill="#4FA3E0" stroke="' + c + '" stroke-width="2.5"/><path d="M4,30 q4,-4 8,0 t8,0 t8,0 t6,0" ' + a + '/>'; break;
      case 'senter': isi = '<path d="M6,14 h12 l8,-6 v20 l-8,-6 h-12 Z" fill="#FFE08F" ' + s3 + '/><path d="M29,10 l4,-3 M30,18 h4 M29,26 l4,3" ' + a + '/>'; break;
      case 'kunci': isi = '<rect x="8" y="16" width="20" height="15" rx="4" fill="#CCC3F5" stroke="' + c + '" stroke-width="3"/><path d="M12,16 v-4 a6,6 0 0,1 12,0 v4" ' + a + '/>'; break;
      case 'awan': isi = '<path d="M9,26 h18 a6,6 0 0,0 0,-12 a8,8 0 0,0 -15,-2 a6,6 0 0,0 -3,14 Z" fill="#FBF8F2" stroke="' + c + '" stroke-width="3" stroke-linejoin="round"/>'; break;
      case 'tambah': isi = '<path d="M18,8 v20 M8,18 h20" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/>'; break;
      case 'kurang': isi = '<path d="M8,18 h20" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/>'; break;
      case 'senyap': isi = '<path d="M5,14 h6 l8,-7 v22 l-8,-7 h-6 Z" fill="#E4E0EE" ' + s3 + '/><path d="M24,13 l8,10 M32,13 l-8,10" ' + a + '/>'; break;
      case 'beranda': isi = '<path d="M5,18 L18,6 L31,18" ' + a + '/><path d="M9,16 v14 h18 v-14" fill="#FFE08F" ' + s3 + '/><rect x="15" y="21" width="6" height="9" rx="2" fill="#FF8A6B" stroke="' + c + '" stroke-width="2.5"/>'; break;
      case 'ulangi': isi = '<path d="M27,12 a11,11 0 1,0 2,10" ' + a + '/><path d="M28,4 v9 h-9" ' + a + '/>'; break;
      case 'lanjut': isi = '<path d="M7,18 h20 M19,9 l9,9 l-9,9" stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; break;
      case 'tutup': isi = '<path d="M10,10 l16,16 M26,10 l-16,16" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>'; break;
      case 'info': isi = '<circle cx="18" cy="18" r="13" fill="#D6ECFA" stroke="' + c + '" stroke-width="3"/><path d="M18,16 v9" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/><circle cx="18" cy="11" r="2.4" fill="' + c + '"/>'; break;
      case 'bintang': isi = '<path d="M18,3 l4.4,9.6 10.5,1.2 -7.8,7.1 2.2,10.4 -9.3,-5.3 -9.3,5.3 2.2,-10.4 -7.8,-7.1 10.5,-1.2 Z" fill="' + (arg === false ? '#E4E0EE' : '#FFC94A') + '" stroke="' + c + '" stroke-width="2.5" stroke-linejoin="round"/>'; break;

    }
    return '<svg width="' + u + '" height="' + u + '" viewBox="0 0 36 36" aria-hidden="true">' + isi + '</svg>';
  }

  /* ---------- Kartu kata berlekuk (lekuk di sisi bawah) ----------
     lekuk: 'satu' (benda tunggal, a/an), 'dua' (jamak, a few, many), 'gel' (takar, a little, much),
            'is' (satu + gel), 'serba' (dua + gel). warna kelompok: hitung / takar / serba / kerja / benda */
  var WARNA_K = { hitung: ['#FF8A6B', '#D9654A'], takar: ['#4FA3E0', '#2F7EBB'], serba: ['#6CC07A', '#4C9A5B'], kerja: ['#A99BE8', '#8475C9'], benda: ['#FFC94A', '#E0A52A'] };
  function lekukPath(jenis, x, y) {
    /* tonjolan di bawah tepi kartu, mulai x, pada garis y */
    var p = '';
    if (jenis === 'satu') p = 'M' + (x - 9) + ',' + y + ' a9,9 0 0,0 18,0';
    else if (jenis === 'dua') p = 'M' + (x - 21) + ',' + y + ' a8,8 0 0,0 16,0 M' + (x + 5) + ',' + y + ' a8,8 0 0,0 16,0';
    else if (jenis === 'gel') p = 'M' + (x - 22) + ',' + y + ' q5.5,9 11,0 t11,0 t11,0 t11,0';
    return p;
  }
  function kartu(teks, kelompok, lekuk, lebar, opsi) {
    opsi = opsi || {};
    var h = 60, w = lebar, wk = WARNA_K[kelompok], tinggiT = h + 14;
    var t = '<svg width="' + w + '" height="' + tinggiT + '" viewBox="0 0 ' + w + ' ' + tinggiT + '" class="kartu-svg">';
    var bawah = '';
    var cx = w / 2;
    if (!opsi.tanpaLekuk) {
      if (lekuk === 'satu' || lekuk === 'dua' || lekuk === 'gel') bawah = lekukPath(lekuk, cx, h);
      else if (lekuk === 'is') bawah = lekukPath('satu', cx - 22, h) + ' ' + lekukPath('gel', cx + 24, h);
      else if (lekuk === 'serba') bawah = lekukPath('dua', cx - 24, h) + ' ' + lekukPath('gel', cx + 26, h);
    }
    t += '<rect x="1.5" y="1.5" width="' + (w - 3) + '" height="' + (h - 3) + '" rx="14" fill="#FFFFFF" stroke="#1E3A4C" stroke-width="3"/>';
    if (bawah) t += '<path d="' + bawah + '" fill="' + wk[0] + '" stroke="#1E3A4C" stroke-width="3" stroke-linejoin="round"/>';
    t += '<rect x="3" y="' + (h - 14) + '" width="' + (w - 6) + '" height="10" rx="0" fill="' + wk[0] + '" opacity=".9"/>';
    t += '<rect x="1.5" y="1.5" width="' + (w - 3) + '" height="' + (h - 3) + '" rx="14" fill="none" stroke="#1E3A4C" stroke-width="3"/>';
    t += '<text x="' + cx + '" y="35" text-anchor="middle" data-maxw="' + (w - 20) + '" font-family="Andika, Trebuchet MS, sans-serif" font-weight="700" font-size="27" fill="#1E3A4C">' + teks + '</text>';
    return t + '</svg>';
  }

  /* ---------- Tambahan gim Fase 1 ---------- */
  /* bungkus SVG; gradien dan filter ada di satu <defs> global (pasangDefs) */
  function svg(w, h, isi, o) {
    o = o || {};
    return '<svg width="' + w + '" height="' + h + '" viewBox="' + (o.vb || ('0 0 ' + w + ' ' + h)) + '" aria-hidden="true"' + (o.cls ? ' class="' + o.cls + '"' : '') + ' overflow="visible">' + isi + '</svg>';
  }
  function pasangDefs() {
    if (typeof document === 'undefined' || document.getElementById('defs-global')) return;
    var d = document.createElement('div');
    d.id = 'defs-global'; d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0" aria-hidden="true">' + defs() + '</svg>';
    document.body.appendChild(d);
  }
  /* daftar aset (js/data/aset.js) */
  function aset(kunci) { var A = typeof window !== 'undefined' && window.ASET; return A && A.gambar ? A.gambar[kunci] : null; }
  function srcBenda(kode) { var A = typeof window !== 'undefined' && window.ASET; var b = A && A.benda && A.benda[kode]; return b ? b.src : null; }
  /* Image yang dimuat sekali untuk kanvas */
  var CACHE = {};
  function img(src) {
    if (!src) return null;
    if (CACHE[src]) return CACHE[src];
    var i = new Image(); i.decoding = 'async'; i.src = AKAR + src; CACHE[src] = i;
    return i;
  }
  function muatGambar(daftar) {
    return Promise.all(daftar.filter(Boolean).map(function (src) {
      var i = img(src);
      return i.complete && i.naturalWidth ? Promise.resolve() : new Promise(function (ok) { i.onload = i.onerror = function () { ok(); }; });
    }));
  }
  /* tangan penunjuk: ujung telunjuk di (0,0), badan tangan ke kanan bawah */
  function tangan() {
    var c = '#1E3A4C';
    return '<g transform="rotate(-18)">' +
      '<path d="M-7,4 L-7,-2 Q-7,-14 0,-14 Q7,-14 7,-2 L7,30 Q14,24 20,30 Q26,26 31,32 Q37,29 41,36 L41,62 Q41,82 22,84 L4,84 Q-10,82 -14,66 L-22,44 Q-25,36 -17,34 Q-11,33 -7,40 Z" fill="#F0CDAE" stroke="' + c + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M7,30 L7,46 M20,30 L20,46 M31,32 L31,48" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M-2,-10 Q1,-11 3,-8" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/></g>';
  }
  /* toples kapsul kiriman L1: isinya menunjukkan sifat benda (satu-satu atau curahan) tanpa menuliskan jawabannya */
  function toples(id, w) {
    var t = '', b = window.BENDA ? window.BENDA.daftar.filter(function (x) { return x.id === id; })[0] : null;
    t += '<rect x="18" y="30" width="104" height="112" rx="26" fill="#E9F6FC" stroke="#1E3A4C" stroke-width="3"/>';
    t += '<clipPath id="klip-toples-' + id + '"><rect x="21" y="33" width="98" height="106" rx="23"/></clipPath><g clip-path="url(#klip-toples-' + id + ')">';
    if (b && b.jenis === 'hitung') {
      var src = srcBenda(b.sprite);
      [[48, 104, 44], [92, 98, 40], [70, 64, 38]].forEach(function (p) {
        t += src ? '<image href="' + AKAR + src + '" x="' + (p[0] - p[2] / 2) + '" y="' + (p[1] - p[2] / 2) + '" width="' + p[2] + '" height="' + p[2] + '" preserveAspectRatio="xMidYMid meet"/>' : '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="' + g('koral') + '"/>';
      });
    } else {
      var z = b ? b.zat : 'hujan';
      if (z === 'hujan') t += '<rect x="20" y="96" width="100" height="48" fill="#8CC8F0"/>' + hujan(28, 112, 40, 100, 14, 3);
      else if (z === 'air') t += '<path d="M20,78 q25,-8 50,0 t50,0 V144 H20 Z" fill="' + g('biru') + '"/>';
      else if (z === 'pasir') t += '<path d="M20,144 V104 Q46,76 70,92 Q96,74 120,100 V144 Z" fill="' + g('pasir') + '"/><path d="M38,110 h4 M60,100 h4 M86,108 h4 M70,122 h4 M46,128 h4 M98,124 h4" stroke="#CDB07A" stroke-width="3" stroke-linecap="round"/>';
      else if (z === 'salju') t += '<path d="M20,144 V100 Q48,80 70,94 Q96,80 120,100 V144 Z" fill="' + g('susu') + '"/>';
      else if (z === 'kabut') t += '<rect x="20" y="30" width="100" height="114" fill="#FFFFFF" opacity=".55"/><path d="M24,70 q24,-10 46,0 t46,0 M24,96 q24,-10 46,0 t46,0 M24,122 q24,-10 46,0 t46,0" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>';
      else if (z === 'angin') t += '<path d="M28,62 h52 q14,0 14,-12 q0,-12 -12,-10 M28,88 h76 q14,0 14,12 q0,12 -12,10 M28,114 h44 q12,0 12,10" stroke="#A99BE8" stroke-width="7" stroke-linecap="round" fill="none"/>';
      else if (z === 'matahari') t += '<circle cx="70" cy="90" r="54" fill="url(#sinar)"/><circle cx="70" cy="90" r="20" fill="#FFF4C9" opacity=".9"/>';
    }
    t += '</g><path d="M30,44 Q28,90 34,126" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>';
    t += '<g filter="url(#tekstur)"><rect x="12" y="14" width="116" height="24" rx="12" fill="' + g('koral') + '"/></g>';
    return svg(w || 140, (w || 140) * 150 / 140, t, { vb: '0 0 140 150' });
  }
  /* gambar kecil untuk tombol pilihan alat di L1 */
  function gambarAlat(jenis) {
    var c = '#1E3A4C', t;
    if (jenis === 'hitung') t = '<rect x="6" y="20" width="36" height="36" rx="18" fill="#FBF8F2" stroke="' + c + '" stroke-width="3"/><path d="M16,38 h16" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="48" y="14" width="30" height="48" rx="8" fill="' + c + '"/><text x="63" y="49" text-anchor="middle" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="30" fill="#FBF8F2">3</text>' +
      '<rect x="84" y="20" width="36" height="36" rx="18" fill="#FF8A6B" stroke="' + c + '" stroke-width="3"/><path d="M94,38 h16 M102,30 v16" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
    else t = '<rect x="40" y="4" width="30" height="72" rx="15" fill="#F3F8FB" stroke="' + c + '" stroke-width="3"/><rect x="43" y="40" width="24" height="33" rx="10" fill="#4FA3E0"/>' +
      '<rect x="26" y="6" width="8" height="68" rx="4" fill="#E3E8EC" stroke="#9FB0BC" stroke-width="2"/><rect x="26" y="44" width="8" height="30" rx="4" fill="#4FA3E0" stroke="' + c + '" stroke-width="2"/>' +
      '<rect x="80" y="8" width="7" height="64" rx="3.5" fill="#C9D3DA" stroke="' + c + '" stroke-width="2"/><circle cx="83.5" cy="42" r="12" fill="#FFC94A" stroke="' + c + '" stroke-width="3"/>';
    return svg(126, 80, t);
  }

  return {
    svg: svg, pasangDefs: pasangDefs, aset: aset, srcBenda: srcBenda, img: img, muatGambar: muatGambar, tangan: tangan, toples: toples, gambarAlat: gambarAlat, akar: function () { return AKAR; },
    W: W, defs: defs, bayang: bayang, awan: awan, tetes: tetes, keping: keping, hujan: hujan, pelangi: pelangi, sinar: sinar, burung: burung,
    rumah: rumah, pohon: pohon, bunga: bunga, warga: warga, layang: layang, payung: payung, perahu: perahu, katak: katak, daunGugur: daunGugur,
    ikan: ikan, genangan: genangan, lembah: lembah, lengkung: lengkung, kubah: kubah, alas: alas, ruangStasiun: ruangStasiun,
    stasiunLuar: stasiunLuar, kumu: kumu, wajahKumu: wajahKumu, kumuGambar: kumuGambar, gambar: gambar, benda: benda, kubahLebar: kubahLebar, jalurKubah: jalurKubah, orang: orang, tokoh: tokoh, lensa: lensa, ikon: ikon, kartu: kartu, acak: acak
  };
})();
