/* Kata benda Kubah Cuaca (brief bagian 5). Guru boleh meninjau arti dan bentuk jamak di sini.
   jenis: hitung (bisa dihitung) | takar (tidak bisa dihitung, ditakar).
   alat: hitung (Tombol Hitung) | takar (Tuas Takar) | lensa (terlihat lewat Lensa) | fenomena (muncul lewat fenomena).
   artikel: a | an (untuk bentuk tunggal). sprite: berkas di assets/img/benda/. zat: warna isi tabung ukur.
   lensa: kata benda yang dihitung saat diperbesar (rain -> raindrops). */
window.BENDA = {
  daftar: [
    { id: 'clouds', jenis: 'hitung', tunggal: 'cloud', jamak: 'clouds', artikel: 'a', alat: 'hitung', arti: 'awan', sprite: 'awan' },
    { id: 'kites', jenis: 'hitung', tunggal: 'kite', jamak: 'kites', artikel: 'a', alat: 'hitung', arti: 'layang-layang', sprite: 'layang' },
    { id: 'umbrellas', jenis: 'hitung', tunggal: 'umbrella', jamak: 'umbrellas', artikel: 'an', alat: 'hitung', arti: 'payung', sprite: 'payung' },
    { id: 'boats', jenis: 'hitung', tunggal: 'boat', jamak: 'boats', artikel: 'a', alat: 'hitung', arti: 'perahu', sprite: 'perahu' },
    { id: 'rain', jenis: 'takar', kata: 'rain', alat: 'takar', arti: 'hujan', zat: 'hujan', lensa: 'raindrops', butuhAwan: true },
    { id: 'snow', jenis: 'takar', kata: 'snow', alat: 'takar', arti: 'salju', zat: 'salju', lensa: 'snowflakes', butuhAwan: true },
    { id: 'wind', jenis: 'takar', kata: 'wind', alat: 'takar', arti: 'angin', zat: 'angin' },
    { id: 'sunshine', jenis: 'takar', kata: 'sunshine', alat: 'takar', arti: 'sinar matahari', zat: 'matahari' },
    { id: 'fog', jenis: 'takar', kata: 'fog', alat: 'takar', arti: 'kabut', zat: 'kabut' },
    { id: 'water', jenis: 'takar', kata: 'water', alat: 'takar', arti: 'air', zat: 'air' },
    { id: 'sand', jenis: 'takar', kata: 'sand', alat: 'takar', arti: 'pasir', zat: 'pasir' },
    { id: 'raindrops', jenis: 'hitung', tunggal: 'raindrop', jamak: 'raindrops', artikel: 'a', alat: 'lensa', arti: 'tetes hujan', sprite: 'tetes' },
    { id: 'snowflakes', jenis: 'hitung', tunggal: 'snowflake', jamak: 'snowflakes', artikel: 'a', alat: 'lensa', arti: 'kepingan salju', sprite: 'keping-salju' },
    { id: 'puddles', jenis: 'hitung', tunggal: 'puddle', jamak: 'puddles', artikel: 'a', alat: 'fenomena', arti: 'genangan', sprite: 'genangan' },
    { id: 'frogs', jenis: 'hitung', tunggal: 'frog', jamak: 'frogs', artikel: 'a', alat: 'fenomena', arti: 'katak', sprite: 'katak' },
    { id: 'leaves', jenis: 'hitung', tunggal: 'leaf', jamak: 'leaves', artikel: 'a', alat: 'fenomena', arti: 'daun', sprite: 'daun' },
    { id: 'fish', jenis: 'hitung', tunggal: 'fish', jamak: 'fish', artikel: 'a', alat: 'fenomena', arti: 'ikan', sprite: 'ikan' },
    { id: 'rainbows', jenis: 'hitung', tunggal: 'rainbow', jamak: 'rainbows', artikel: 'a', alat: 'fenomena', arti: 'pelangi', sprite: 'pelangi' },
    { id: 'stars', jenis: 'hitung', tunggal: 'star', jamak: 'stars', artikel: 'a', alat: 'fenomena', arti: 'bintang', sprite: 'bintang' },
    { id: 'salt', jenis: 'takar', kata: 'salt', alat: 'fenomena', arti: 'garam', zat: 'pasir' }
  ],
  /* Level 1 Pasang Alat (GDD bagian 9). clouds dan rain dipasang di hook.
     Putaran 1 terpandu tangan penunjuk, lalu putaran 2 dan 3 dicampur supaya pola tidak bisa ditebak. */
  kapsulL1: [['kites', 'wind'], ['sunshine', 'umbrellas', 'sand'], ['boats', 'fog', 'snow', 'water']]
};
