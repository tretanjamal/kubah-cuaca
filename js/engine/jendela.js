/* Jendela stasiun hidup (GDD bagian 12, brief "dunia hidup"): awan lewat pelan dan burung terbang sesekali di balik kaca jendela
   gambar latar lab-dalam. Bentuk kaca diukur dari piksel langit latar (dua panel atas berlengkung, dua panel bawah).
   Kurangi animasi: awan tetap lewat sangat pelan, burung tidak muncul. */
(function (root) {
  var W = 230, H = 360;
  var PANEL = [
    [[105, 56], [94, 60], [80, 68], [70, 76], [62, 84], [55, 92], [49, 100], [44, 108], [40, 116], [36, 124], [33, 132], [30, 140], [28, 148], [26, 156], [25, 164], [24, 172], [23, 180], [22, 190], [105, 190]],
    [[126, 62], [140, 62], [146, 68], [156, 76], [163, 84], [170, 92], [176, 100], [181, 108], [185, 116], [189, 124], [191, 132], [194, 140], [196, 148], [198, 156], [199, 164], [201, 172], [202, 190], [126, 190]],
    [[22, 216], [104, 216], [104, 344], [22, 344]],
    [[126, 216], [202, 216], [202, 336], [126, 336]]
  ];
  function jalurKaca() {
    var p = new Path2D();
    PANEL.forEach(function (poli) { poli.forEach(function (t, i) { if (i) p.lineTo(t[0], t[1]); else p.moveTo(t[0], t[1]); }); p.closePath(); });
    return p;
  }
  function awan(c, x, y, s, a) {
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#FFFFFF';
    c.beginPath(); c.arc(-18, 6, 14, 0, Math.PI * 2); c.arc(0, -2, 19, 0, Math.PI * 2); c.arc(20, 5, 13, 0, Math.PI * 2); c.rect(-30, 6, 62, 12); c.fill();
    c.fillStyle = 'rgba(169,155,232,.25)'; c.fillRect(-30, 14, 62, 4);
    c.restore();
  }
  function burung(c, x, y, k) {
    var sayap = Math.sin(k * 10) * 4;
    c.beginPath(); c.moveTo(x - 7, y - sayap); c.quadraticCurveTo(x - 3, y - 2, x, y); c.quadraticCurveTo(x + 3, y - 2, x + 7, y - sayap); c.stroke();
  }

  function Jendela(parent, gelapFn) {
    var kan = U.h('canvas', 'kanvas-jendela'), c = kan.getContext('2d'), skala = 0, klip = jalurKaca(), t = Math.random() * 100;
    kan.style.cssText = 'left:0;top:0;width:' + W + 'px;height:' + H + 'px';
    kan.setAttribute('aria-hidden', 'true');
    parent.appendChild(kan);
    var daftar = [{ x: 30, y: 110, s: 1, v: 9 }, { x: 150, y: 260, s: 0.8, v: 6 }, { x: 260, y: 160, s: 0.65, v: 7.5 }];
    var kawanan = null, tunggu = 4 + Math.random() * 5, jeda = 0;
    function ukur(s) {
      var k = Math.min(2, Math.max(1, s * (root.devicePixelRatio || 1)));
      if (k === skala) return;
      skala = k; kan.width = Math.round(W * k); kan.height = Math.round(H * k);
    }
    ukur(Stage.scale || 1);
    Stage.onFit(ukur);
    function gambar() {
      c.setTransform(skala, 0, 0, skala, 0, 0);
      c.clearRect(0, 0, W, H);
      c.save(); c.clip(klip);
      daftar.forEach(function (a) { awan(c, a.x, a.y, a.s, 0.82); });
      if (kawanan) {
        c.strokeStyle = 'rgba(30,58,76,.7)'; c.lineWidth = 2; c.lineCap = 'round';
        kawanan.b.forEach(function (b) { burung(c, kawanan.x + b[0], kawanan.y + b[1] + Math.sin(t * 2 + b[0]) * 3, t + b[0]); });
      }
      /* malam (Patroli Malam): langit jendela ikut gelap dan berbintang */
      var g = gelapFn ? gelapFn() : 0;
      if (g > 0.02) {
        c.fillStyle = 'rgba(20,26,64,' + (0.85 * g).toFixed(3) + ')'; c.fillRect(0, 0, W, H);
        c.fillStyle = 'rgba(255,244,201,' + g.toFixed(3) + ')';
        [[60, 120], [150, 90], [90, 260], [170, 240], [45, 300], [130, 160]].forEach(function (p, i) { c.beginPath(); c.arc(p[0], p[1], 1.6 + (i % 2), 0, Math.PI * 2); c.fill(); });
      }
      c.restore();
    }
    function update(dt) {
      t += dt;
      var lambat = UI.kurangi ? 0.25 : 1;
      daftar.forEach(function (a) { a.x += a.v * dt * lambat; if (a.x > W + 50) { a.x = -50; a.y = 70 + Math.random() * 250; } });
      if (!UI.kurangi) {
        if (kawanan) { kawanan.x += 55 * dt; kawanan.y -= 6 * dt; if (kawanan.x > W + 30) kawanan = null; }
        else if ((tunggu -= dt) <= 0) { tunggu = 9 + Math.random() * 5; kawanan = { x: -30, y: 90 + Math.random() * 180, b: [[0, 0], [-16, 8], [-30, 3]].slice(0, 2 + Math.floor(Math.random() * 2)) }; }
      } else kawanan = null;
      /* gambar ulang 30 kali per detik sudah cukup halus untuk gerak selambat ini */
      jeda += dt; if (jeda < 1 / 30) return; jeda = 0;
      gambar();
    }
    gambar();
    Loop.add(update);
    return {
      el: kan,
      lepas: function () { Loop.remove(update); var i = Stage.fits.indexOf(ukur); if (i >= 0) Stage.fits.splice(i, 1); if (kan.parentNode) kan.parentNode.removeChild(kan); }
    };
  }
  root.Jendela = Jendela;
})(window);
