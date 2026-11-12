/* Fenomena Cuaca (brief keputusan 7). Diperiksa setiap kali JALANKAN ditekan. Akurat secara IPAS, disederhanakan untuk anak.
   syarat(n): n = takaran dan jumlah di kubah, ditambah n.malam (Patroli Malam).
   benda: kata benda baru yang muncul (digolongkan dulu lewat Kartu Temuan sebelum masuk Jurnal).
   petunjuk: bisikan Kumu di Lab Bebas bila lama tidak ada fenomena baru (tanpa memberi kalimat Inggrisnya). */
window.FENOMENA = {
  daftar: [
    { id: 'mendung', nama: 'Langit Mendung', sprite: 'awan-hujan', benda: [],
      syarat: function (n) { return n.clouds >= 8; },
      kalimat: ['There are a lot of clouds.', 'The valley is dark.'],
      petunjuk: 'Bagaimana kalau awannya banyak sekali?' },
    { id: 'pelangi', nama: 'Pelangi', sprite: 'pelangi', benda: ['rainbows'],
      syarat: function (n) { return n.sunshine >= 70 && n.rain >= 10 && n.rain <= 30 && n.clouds >= 1; },
      kalimat: ['There is a lot of sunshine and a little rain.'],
      petunjuk: 'Pelangi: matahari banyak, hujan sedikit.' },
    { id: 'genangan', nama: 'Genangan dan Katak', sprite: 'katak', benda: ['puddles', 'frogs'],
      syarat: function (n) { return n.rain >= 70 && n.clouds >= 1; },
      kalimat: ['There are a few puddles.', 'There are a few frogs.'],
      petunjuk: 'Hujan deras membuat sesuatu di tanah.' },
    { id: 'layang', nama: 'Layang-layang Terbang', sprite: 'layang', benda: [],
      syarat: function (n) { return n.wind >= 70 && n.rain === 0 && n.kites >= 1; },
      kalimat: ['There is a lot of wind and no rain.'],
      petunjuk: 'Layang-layang: angin kencang, tanpa hujan.' },
    { id: 'daun', nama: 'Daun Berguguran', sprite: 'daun', benda: ['leaves'],
      syarat: function (n) { return n.wind >= 70; },
      kalimat: ['There are a lot of leaves on the ground.'],
      petunjuk: 'Pohon besar goyang bila angin kencang.' },
    { id: 'saljuman', nama: 'Manusia Salju', sprite: 'manusia-salju', benda: [],
      syarat: function (n) { return n.snow >= 70 && n.clouds >= 1; },
      kalimat: ['There is a lot of snow on the peak.'],
      petunjuk: 'Salju yang banyak bisa jadi teman baru.' },
    { id: 'kabut', nama: 'Kabut Dermaga', sprite: 'perahu', benda: [],
      syarat: function (n) { return n.fog >= 70; },
      kalimat: ['There is a lot of fog.', 'The boats stay at the pier.'],
      petunjuk: 'Nelayan tidak berlayar kalau kabutnya tebal.' },
    { id: 'garam', nama: 'Panen Garam', sprite: 'garam', benda: ['salt'],
      syarat: function (n) { return n.sunshine >= 70 && n.rain === 0 && n.water >= 10; },
      kalimat: ['There is a lot of sunshine.', 'Now there is a little salt.'],
      petunjuk: 'Garam: matahari, air, tanpa hujan.' },
    { id: 'bintang', nama: 'Malam Berbintang', sprite: 'bintang', benda: ['stars'],
      syarat: function (n) { return !!n.malam && n.clouds === 0; },
      kalimat: ['There are a lot of stars.'],
      petunjuk: 'Malam hari: awan menutupi yang berkilau.' }
  ]
};
