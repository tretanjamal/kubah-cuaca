/* Level 4 Patroli Malam (GDD bagian 6.9 dan 9; TP5, TP6). Kubah gelap, senter mengikuti jari (ketuk juga bisa, panah keyboard).
   Pertanyaan baru bisa dijawab setelah senter menyorot zona yang ditanya. Lekuk kartu disembunyikan, tampil sesudah salah pertama.
   Alur: 6 pertanyaan senter -> 2 tugas perbaikan dari Kak Bayu -> misi Malam Berbintang -> Cek Ulang -> hasil. */
(function () {
  /* zona di kubah (koordinat lokal kubah) */
  var ZONA = { kolam: { x: 388, y: 430, r: 70 }, puncak: { x: 62, y: 258, r: 70 }, dermaga: { x: 470, y: 392, r: 80 }, danau: { x: 478, y: 396, r: 80 }, langit: { x: 262, y: 110, r: 110 } };
  var MALAM = { clouds: 4, frogs: 3, snow: 30, fog: 20, fish: 2, boats: 0 };
  var TANYA = [
    ['ada', 'frogs', 'kolam'], ['ada', 'snow', 'puncak'], ['ada', 'boats', 'dermaga'],
    ['tidak', 'fog', 'danau'], ['ada', 'fish', 'danau'], ['ada', 'sunshine', 'langit']
  ];

  Scenes.add('level4', {
    enter: function (root) {
      var A = Alur.mulai(root, 4, { musik: 'malam' }), lab = A.lab, dunia = {};
      this.uji = A.uji;
      function salin(o) { var x = {}; for (var k in o) x[k] = o[k]; return x; }
      function serupa(j, id, z) {
        return function () {
          /* nilai pengganti selalu bisa dijawab dengan kartunya: "tidak" tetap di zona few/little, "ada" bergantian ada dan tidak ada */
          var p = salin(dunia), v = p[id] || 0, h = Kuantitas.benda(id).jenis === 'hitung';
          if (j === 'tidak') p[id] = h ? (v === 3 ? 2 : 3) : (v === 20 ? 30 : 20);
          else p[id] = id === 'sunshine' ? 0 : (v ? 0 : (h ? 3 : 20));
          return A.tanya(Tugas.pertanyaan(j, id, p[id]), { preset: p, malam: true, senter: ZONA[z], lekuk: false });
        };
      }
      A.jalan(async function () {
        dunia = salin(MALAM);
        A.preset(dunia, true);
        lab.kubah.senter.x = 260; lab.kubah.senter.y = 250;
        await A.hidup(lab.bayu.ucap(STR.bayu2.l4Sambut, 'pikir'));
        for (var i = 0; i < TANYA.length; i++) {
          var q = TANYA[i], id = q[1];
          if ((id === 'frogs' || id === 'fish') && !Save.punyaKata(id)) await A.hidup(A.temuan(id));
          await A.tanya(Tugas.pertanyaan(q[0], id, dunia[id] || 0), { senter: ZONA[q[2]], lekuk: false, serupa: serupa(q[0], id, q[2]) });
        }
        /* perbaikan: hapus kabut, lalu tambah perahu ("some" = dua atau lebih) */
        await A.minta({ warga: 'bayu', teks: STR.bayu2.l4Kabut, target: { fog: 'no' } }, { alat: ['boats', 'fog'], preset: dunia, malam: true });
        dunia.fog = 0;
        await A.minta({ warga: 'bayu', teks: STR.bayu2.l4Perahu, target: { boats: 'some' }, wakil: { boats: 3 },
          cek: function (n) { return n.boats >= 2 ? [] : [{ id: 'boats', harus: 'some', ada: Tugas.zonaId('boats', n.boats) }]; } }, { alat: ['boats', 'fog'], preset: dunia, malam: true });
        dunia.boats = Math.max(2, lab.kubah.nilai.boats);
        /* misi Malam Berbintang */
        await A.misi({ fenomena: 'bintang', alat: ['clouds', 'boats', 'fog'], preset: dunia, malam: true, arahan: STR.l4.perbaiki, bayu: STR.bayu2.l4Awan, solusi: { clouds: 0 } });
        await A.cekUlang();
        A.hapusAlat();
        lab.arahan(STR.alur.levelSelesai, false);
        await A.hidup(lab.bayu.ucap(STR.bayu2.hebat, 'sorak'));
        A.selesai(['some-any', 'there-is-are', 'many-much', 'simak-takaran']);
      });
    },
    update: function (dt) { Alur.update(dt); },
    exit: function () { Alur.akhiri(); }
  });
})();
