/* Semua teks Kubah Cuaca di satu tempat supaya mudah ditinjau guru (CLAUDE.md bagian 2).
   Instruksi berbahasa Indonesia (maks. 2 baris). Ucapan Kak Bayu dan Papan Kalimat berbahasa Inggris. */
window.STR = {
  judul: { a: 'KUBAH', b: 'CUACA', tagline: 'How Many Clouds? How Much Rain?', lengkap: 'Kubah Cuaca: How Many Clouds? How Much Rain?' },
  putar: 'Putar perangkatmu supaya mendatar.',
  muat: 'Menyiapkan kubah',
  muatTahu: 'Tahukah kamu? ',
  muatTips: [
    'Pelangi muncul saat ada sinar matahari dan hujan rintik.',
    'Hujan turun dari awan. Tanpa awan, tidak ada hujan.',
    'Penakar hujan mengukur berapa banyak hujan yang turun.',
    'Petani garam butuh banyak sinar matahari supaya air laut menguap.',
    'Dalam bahasa Inggris, kita menghitung awan, tetapi menakar hujan.'
  ],
  tombol: { mulai: 'MULAI', info: 'Informasi', referensi: 'Referensi', pengembang: 'Pengembang', tutup: 'Tutup', lanjut: 'Lanjut', ulangi: 'Ulangi', stasiun: 'Stasiun', jalankan: 'JALANKAN' },
  ikon: {
    pengaturan: 'Pengaturan', layarPenuh: 'Layar penuh', keluarPenuh: 'Keluar dari layar penuh', fsDitolak: 'Layar penuh tidak tersedia di perangkat ini.',
    suaraNyala: 'Suara nyala', suaraMati: 'Suara mati', jeda: 'Jeda', jurnal: 'Jurnal Cuaca', dengar: 'Dengarkan kalimat', dengarLagi: 'Dengar lagi', lebihPelan: 'Lebih pelan',
    dengarArahan: 'Dengarkan arahan', lensa: 'Lensa', cerah: 'Cerah', beranda: 'Beranda', positif: 'Kalimat biasa', tanya: 'Kalimat tanya', negatif: 'Kalimat tidak'
  },
  pengaturan: {
    judul: 'Pengaturan', nyala: 'Nyala', mati: 'Mati',
    musik: 'Musik', efek: 'Efek suara', cuaca: 'Bunyi cuaca', cuacaCatatan: 'Hujan, angin, dan salju terdengar',
    suara: 'Suara tokoh', suaraCatatan: 'Bila mati, cukup tulisan',
    bacakan: 'Bacakan arahan', santai: 'Mode Santai', santaiCatatan: 'Petunjuk lebih cepat',
    kurangi: 'Kurangi animasi', kurangiCatatan: 'Diatur oleh perangkat',
    muridBaru: 'Murid baru', muridBaruCatatan: 'Progres dihapus', hapus: 'Hapus', yakin: 'Yakin?'
  },
  jeda: { judul: 'Jeda', lanjut: 'Lanjut', ulangi: 'Ulangi level', pengaturan: 'Pengaturan', stasiun: 'Ke Stasiun', beranda: 'Ke layar judul' },
  papan: {
    negatifRedup: 'Jumlahnya tidak sedikit, jadi kalimat "tidak" belum cocok.',
    label: { positif: 'Biasa', tanya: 'Tanya', negatif: 'Tidak' },
    abu: 'Bukan sedikit, bukan banyak.'
  },
  alat: {
    hitung: 'Tombol Hitung', takar: 'Tuas Takar', hitungKet: 'satu per satu', takarKet: 'ditakar',
    penuh: 'Kubahnya sudah penuh.', kurangiAria: 'Kurangi {kata}', tambahAria: 'Tambah {kata}', butuhAwan: 'Hujan butuh awan. Tambah awan dulu.', panel: 'Panel Kendali'
  },
  /* Level 1 Pasang Alat */
  l1: {
    nama: 'Pasang Alat',
    kiriman: 'Kiriman Baru',
    terpasang: 'Alat terpasang: {n} dari {t}',
    pilih: 'Alat apa yang cocok untuk {kata}?',
    coba: 'Coba alatnya!',
    cobaHitung: 'Ketuk tombol tambah.',
    cobaTakar: 'Tarik tuasnya ke atas.',
    berhasilHitung: '{kata} datang satu-satu, jadi dihitung!',
    berhasilTakar: '{kata} tidak dihitung, tetapi ditakar.',
    salahHitung: '{kata} tidak datang satu-satu. Coba lagi!',
    salahTakar: 'Hmm, {kata} datang satu-satu. Coba lagi!',
    sorot: 'Lihat toplesnya: satu-satu atau curahan?',
    tunjuk: 'Ini alatnya. {kata} {alasan}.',
    alasanHitung: 'dihitung satu-satu',
    alasanTakar: 'ditakar',
    cekUlang: 'Ingat lagi: alat apa untuk {kata}?',
    lensaHujan: 'Tarik tuas hujan, lalu ketuk Lensa.',
    lensaSalju: 'Salju! Tarik tuasnya, lalu ketuk Lensa.',
    lensaKetuk: 'Ketuk Lensa untuk melihat lebih dekat.',
    lensaGeser: 'Geser lensa ke hujan.',
    selesai: 'Semua alat siap!'
  },
  hook: {
    awan: 'Ketuk tombol tambah awan.',
    lagi: 'Ketuk lagi!',
    hujan: 'Tarik tuas hujan ke atas.'
  },
  /* ucapan bahasa Inggris (dibaca suara en-US) */
  bayu: {
    sambut: 'Welcome, assistant! We count clouds. We measure rain.',
    kiriman: 'New supplies are here! Choose the right tool.',
    iniHitung: 'Here are some {jamak}.',
    iniTakar: 'Here is some {kata}.',
    hebat: 'Great!',
    lensa: "Let's look closer!",
    lensaHujan: 'We measure rain. We count raindrops!',
    lensaSalju: 'We measure snow. We count snowflakes!',
    selesai: 'Great job! All the tools are ready.'
  },
  /* alur bersama Level 2-5 dan Lab Bebas (arahan Kumu maks. 2 baris) */
  alur: {
    jalankan: 'JALANKAN', kirim: 'KIRIM', kartu: 'Kartu Kata', rakKosong: 'Kartu terpakai',
    isiDulu: 'Isi dulu semua lekuk kosong.',
    levelSelesai: 'Hebat! Tugas di level ini selesai.',
    fenomenaBaruKecil: 'Fenomena baru!', fenomenaKecil: 'Fenomena',
    siaranLihat: 'Coba lihat lagi *{kata}* di kubah.',
    atur: 'Atur alatnya, lalu tekan JALANKAN.',
    dengarDulu: 'Dengarkan dulu permintaannya.',
    benarPermintaan: 'Tepat! {nama} senang sekali.',
    salahZona: 'Cek lagi {kata}. Pita zonanya belum pas.',
    salahBanyak: 'Terlalu banyak {kata}. Kurangi.',
    salahSedikit: 'Terlalu sedikit {kata}. Tambah.',
    /* kalimat rapi tetapi tidak sesuai kubah: sebut faktanya, bukan kata jawabannya */
    makna: { hitung: 'Hitung lagi: ada {n} *{kata}* di kubah.', satu: 'Lihat lagi: hanya ada satu *{kata}*.', takar: 'Lihat tabungnya: *{kata}* {n} dari 100.', kosong: 'Lihat lagi: tidak ada *{kata}* di kubah.' },
    sorotZona: 'Lihat pita zona di atas kubah.',
    bantu: { hitung: '{kata}: {n}', takar: '{kata}: {n} dari 100', angka: 'angka', satu: 'a / an' },
    lensaAria: 'Lensa: geser dengan tombol panah.',
    /* alasan kebahasaan saat kartu ditolak lekuk */
    lekukAlasan: {
      kerjaIs: '*{kartu}*: satu benda atau benda ditakar.', kerjaAre: '*{kartu}*: dua benda atau lebih.',
      kuantHitung: '*{benda}* ditakar, bukan dihitung.', kuantTakar: '*{benda}* dihitung, bukan ditakar.',
      kuantSatu: '*{kartu}*: hanya untuk satu benda.', kuantBanyak: '*{kartu}*: dua benda atau lebih.'
    },
    tebakSalahHitung: 'Ternyata ada {n} *{kata}*.', tebakSalahTakar: 'Ternyata *{kata}* {n} dari 100.',
    salahLebih: '{kata} tidak diminta. Jadikan nol.',
    sorotPermintaan: 'Lihat alat yang menyala.',
    tunjukPermintaan: 'Begini caranya. Lalu tekan JALANKAN.',
    jawab: 'Jawab dengan kartu kata.',
    lekuk: '*{kartu}* tidak masuk. Lihat lekuknya.',
    salahBenar: 'Kalimatnya rapi, tapi lihat lagi kubahnya.',
    sorotKartu: 'Kartu yang cocok sedang berkilau.',
    tunjukKartu: 'Begini kalimatnya. Dengarkan, ya.',
    benarKartu: 'Kalimatmu tepat!',
    tebak: 'Tebak kalimatnya, lalu tekan JALANKAN.',
    tebakBenar: 'Tebakanmu benar!', tebakSalah: 'Ternyata kalimatnya begini.',
    jalankanDulu: 'Tekan JALANKAN untuk mencoba.',
    temuan: '*{kata}*: dihitung atau ditakar?',
    temuanHitung: 'Dihitung', temuanTakar: 'Ditakar',
    temuanBenar: '*{kata}* masuk Jurnal Cuaca!',
    temuanSalah: 'Hmm, *{kata}* {alasan}. Coba lagi!',
    alasanHitung: 'bisa dihitung satu-satu', alasanTakar: 'tidak dihitung satu-satu',
    fenomenaBaru: 'Fenomena baru: {nama}!',
    misiBelum: 'Belum muncul. Ubah alat, lalu JALANKAN.',
    lensa: 'Ketuk Lensa, lalu jawab.',
    senter: 'Geser senter ke bagian yang ditanya.',
    senterBelum: 'Sorot dulu bagian itu dengan senter.',
    senterKetemu: 'Sudah terlihat. Sekarang jawab!',
    festival: 'Penuhi tiga permintaan sekaligus.',
    festivalBelum: 'Kartu yang bergoyang belum terpenuhi.',
    siaran: 'Susun 3 kalimat siaran tentang kubah.',
    siaranSyarat: 'Pakai benda yang berbeda-beda.',
    siaranCampur: 'Pakai benda dihitung dan benda ditakar.',
    siaranSama: '*{kata}* sudah dipakai. Ganti benda.',
    siaranJudul: 'Siaran Cuaca',
    halaman: ['Langit', 'Angin', 'Lembah'],
    santaiZona: { no: 'tidak ada', satu: 'satu', few: 'beberapa', abu: 'angka', lot: 'banyak', little: 'sedikit', some: 'ada' },
    tataBahasa: {
      'much-positif': 'Kalimat biasa memakai *a lot of*.',
      'any-positif': '*any* untuk bertanya dan "tidak ada".',
      'negatif-ganda': 'Pilih salah satu: *not any* atau *no*.',
      'is-jamak': 'Lebih dari satu? Pakai *are*.',
      'are-takar': 'Benda yang ditakar memakai *is*.',
      'are-tunggal': 'Hanya satu? Pakai *is*.',
      'kelompok-takar': 'Benda ditakar: *a little* atau *a lot of*.',
      'kelompok-hitung': 'Benda dihitung: *a few* atau *many*.',
      'jamak-salah': 'Ingat: *fish* tetap *fish*, *leaf* jadi *leaves*.',
      'artikel': 'Perhatikan *a* dan *an*.',
      'yn': 'Cocokkan *Yes* atau *No* dengan kalimatnya.',
      'jawab-tanya': 'Banyak atau tidak? Pilih *Yes* atau *No*.',
      'umum': 'Coba susun ulang kalimatnya.'
    }
  },
  l2: { nama: 'Hitung Awan', tebakAtur: 'Buat {n} {kata}, lalu tebak kalimatnya.', misi: 'Buat banyak awan, lalu JALANKAN.' },
  l3: { nama: 'Takar Hujan', tebakSedikit: 'Tarik tuas {kata} sedikit, lalu tebak.', tebakBanyak: 'Tarik tuas {kata} banyak, lalu tebak.', misi: 'Coba buat pelangi, lalu JALANKAN.' },
  l4: { nama: 'Patroli Malam', perbaiki: 'Atur alatnya, lalu JALANKAN.', zona: { frogs: 'dekat kolam', fish: 'danau', boats: 'dermaga', fog: 'danau', snow: 'puncak', sunshine: 'langit', stars: 'langit' } },
  l6: { nama: 'Telepon Pendengar', sambut: 'Ada telepon! Jawab cepat dengan kartu.', sambutSantai: 'Pendengar menelepon! Jawab dengan kartu.',
    waktu: 'Bonus {n} detik', hasilCepat: 'Hebat! {n} jawaban cepat.' },
  l5: { nama: 'Festival Lembah', babak: ['Festival Pagi', 'Festival Sore'] },
  lab: { nama: 'Lab Bebas', sambut: 'Coba apa saja! Temukan fenomena cuaca.', pintu: 'Lab Bebas', terkunci: 'Lab Bebas terbuka setelah Level 1.', belumAda: 'Belum ada fenomena. Coba takaran lain!',
    tebak: 'Tebak', tebakAria: 'Tebak Dulu', tebakNyala: 'Tebak Dulu nyala: atur alat, lalu JALANKAN.', tebakMati: 'Tebak Dulu mati.' },
  jurnal: { judul: 'Jurnal Cuaca', tombol: 'Jurnal', temuanJudul: 'Kata Baru', tabKata: 'Kata', tabFenomena: 'Fenomena', dihitung: 'dihitung', ditakar: 'ditakar', belum: 'Belum ditemukan', temukan: 'Petunjuk: {petunjuk}' },
  bayu2: {
    l2Sambut: "Let's count! Clouds, kites, umbrellas, and boats.",
    l2Misi: 'Make a lot of clouds. What happens to the valley?',
    l3Sambut: "Now let's measure rain, sun, and wind.",
    l3Misi: 'Rainbows need a lot of sunshine and a little rain.',
    lensaTanya: 'Now use the lens.',
    l4Sambut: "It's night. Let's check the valley!",
    l4Kabut: 'Please take away all the fog.',
    l4Perahu: 'Add some boats, please.',
    l4Awan: 'Please take away all the clouds.',
    l5Sambut: 'Festival day! Make everyone happy.',
    l5Siaran: "Now let's tell the valley about the weather.",
    l5Buka: 'Here is the weather for Dew Valley.',
    hebat: 'Great job!', lagi: 'Try again.', bagus: 'Good!', terima: 'Thank you!', l6Sambut: 'Phone-in time! Our listeners have questions.', l6Tutup: 'Thank you for calling!', tebak: 'Guess first! Then press the button.'
  },
  /* Hasil Belajarku (bahasa anak) dan Catatan untuk Guru (tanpa data pribadi) */
  hasilBelajar: {
    judul: 'Hasil Belajarku', tombol: 'Hasil Belajarku',
    status: { dikuasai: 'Sudah bisa', berkembang: 'Hampir bisa', latihan: 'Ayo latihan', belum: 'Belum dicoba' },
    ringkas: 'Fenomena ditemukan: {f} dari 9. Kata di Jurnal: {k} dari 20.',
    guruTahan: 'Catatan untuk Guru (tahan 2 detik)', guruPendek: 'Catatan Guru',
    tahanPetunjuk: 'Tahan tombolnya 2 detik untuk membuka catatan guru.'
  },
  guru: {
    judul: 'Catatan untuk Guru',
    kolomTag: 'Tujuan pembelajaran', kolomStatus: 'Status', kolomBukti: 'Tepat coba pertama', kolomLekuk: 'Tanpa lekuk',
    nama: {
      'hitung-takar': 'TP1 Membedakan benda dihitung dan ditakar', 'few-little': 'TP2 a few dan a little', 'many-much': 'TP3 How many/much, many/much',
      'a-lot-of': 'TP4 a lot of untuk keduanya', 'some-any': 'TP5 some, any, dan no', 'there-is-are': 'TP6 There is dan There are',
      'simak-takaran': 'TP7 Menyimak permintaan lisan'
    },
    status: { dikuasai: 'Dikuasai', berkembang: 'Berkembang', latihan: 'Perlu latihan', belum: 'Belum dimainkan' },
    misJudul: 'Kesalahan yang paling sering: {daftar}.', misKosong: 'Belum ada kesalahan yang tercatat.',
    mis: {
      'pilih-hitung': 'benda dihitung dianggap ditakar', 'pilih-takar': 'benda ditakar dianggap dihitung',
      'kelompok-takar': 'a few/many untuk benda ditakar', 'kelompok-hitung': 'a little/much untuk benda dihitung',
      'is-jamak': 'is untuk benda jamak', 'are-takar': 'are untuk benda ditakar', 'are-tunggal': 'are untuk satu benda',
      'much-positif': 'much dalam kalimat positif', 'any-positif': 'any dalam kalimat positif', 'negatif-ganda': "negatif ganda (aren't no)",
      'artikel': 'a dan an tertukar', 'jamak-salah': 'jamak tidak beraturan (fishes, leafs)',
      'zona': 'jumlah atau takaran di zona yang salah', 'lebih': 'menambah benda yang tidak diminta',
      'kebenaran': 'kalimat rapi tetapi tidak sesuai kubah', 'tebak': 'tebakan kalimat belum tepat',
      'makna-jumlah': 'kata kuantitas tidak sesuai jumlah', 'makna-ada': 'ada/tidak ada (Yes/No) tertukar',
      'kuant-tunggal': 'kata kuantitas jamak untuk satu benda', 'jawab-tanya': 'jawaban Yes/No tidak menjawab pertanyaan'
    },
    saranJudul: 'Saran tindak lanjut ({tp}): ',
    saran: {
      'hitung-takar': 'ajak murid memilah benda di kelas: bisa dihitung satu per satu atau ditakar.',
      'few-little': 'bandingkan a few cookies dan a little water dengan benda nyata.',
      'many-much': 'latih tanya jawab How many/How much tentang isi tas dan botol minum.',
      'a-lot-of': 'tunjukkan bahwa a lot of cocok untuk keduanya: a lot of books, a lot of water.',
      'some-any': 'main tebak isi kotak: Is there any...? Yes, there is some... / No, there isn\'t any...',
      'there-is-are': 'tempel kartu There is/There are di papan, lalu murid mendeskripsikan gambar kelas.',
      'simak-takaran': 'bacakan permintaan pendek, murid menggambar jumlahnya.'
    },
    level: 'Level selesai: {daftar}.', levelBelum: 'belum ada', bintang: '{n} bintang', petunjuk3: 'Petunjuk tingkat 3 dipakai: {n} kali.',
    fenomena: 'Fenomena ditemukan: {n} dari 9.', santai: 'Mode Santai: {s}.', lama: 'Lama bermain: sekitar {m} menit.',
    aturan: 'Dikuasai: minimal 4 tepat coba pertama (75%); TP3, TP5, TP6 juga minimal 2 tepat saat lekuk kartu disembunyikan (kolom Tanpa lekuk, L4-L6). Berkembang: minimal 2 tepat.',
    zona: 'Zona adalah aturan gim (dalam bahasa Inggris kata ini relatif): a few 2-4, a lot of/many 8-12; a little 10-30, a lot of 70-100 dari 100. Some berlaku untuk jumlah berapa pun di atas nol.',
    privasi: 'Data hanya tersimpan di perangkat ini, tanpa nama atau data pribadi.',
    cp: 'Rujukan CP: Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.'
  },
  kumuNama: 'Kumu',
  /* Mode Santai: arti angka 0-12 di bawah kata zona */
  angkaIndo: ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'],
  santaiChip: 'Mode Santai',
  bayuNama: 'Kak Bayu',
  stasiun: {
    judul: 'Stasiun Cuaca',
    level: 'Level {n}', terkunci: 'Selesaikan Level {n} dulu.', segera: 'Level ini sedang disiapkan.',
    nama: { 1: 'Pasang Alat', 2: 'Hitung Awan', 3: 'Takar Hujan', 4: 'Patroli Malam', 5: 'Festival Lembah', 6: 'Telepon Pendengar' },
    alat: 'Alat cuaca'
  },
  hasil: {
    judul: 'Level {n} selesai!', embun: 'Butir Embun', kuasai: 'Yang sudah aku kuasai', latih: 'Ayo latih lagi',
    alatBaru: 'Alat baru di stasiun', belum: 'Terus berlatih, ya!'
  },
  keterampilan: {
    'hitung-takar': 'Aku tahu awan dihitung, hujan ditakar.',
    'few-little': 'Aku tahu kapan memakai a few dan kapan a little.',
    'many-much': 'Aku bisa bertanya How many dan How much.',
    'a-lot-of': 'Aku tahu a lot of cocok untuk keduanya.',
    'some-any': "Aku tahu some untuk 'ada', any untuk bertanya dan 'tidak ada'.",
    'there-is-are': 'Aku tahu kapan There is dan kapan There are.',
    'simak-takaran': 'Aku bisa membuat cuaca sesuai permintaan dalam bahasa Inggris.'
  },
  latihan: {
    'pilih-hitung': 'Benda yang datang satu-satu memakai Tombol Hitung.',
    'pilih-takar': 'Curahan seperti pasir dan hujan memakai Tuas Takar.',
    'kelompok-takar': 'Benda yang ditakar memakai a little atau a lot of; much untuk bertanya dan kalimat "tidak".',
    'kelompok-hitung': 'Benda yang dihitung memakai a few atau many, bukan a little atau much.',
    'is-jamak': 'Lebih dari satu benda memakai are: There are a few clouds.',
    'are-takar': 'Benda yang ditakar memakai is: There is a little rain.',
    'are-tunggal': 'Satu benda memakai is: There is a cloud.',
    'much-positif': 'Kalimat biasa memakai a lot of, bukan much.',
    'any-positif': 'any dipakai untuk bertanya dan "tidak ada".',
    'artikel': 'an dipakai sebelum bunyi vokal: an umbrella.',
    'zona': 'Perhatikan pita zona: a few = 2-4, a lot of = 8 ke atas.',
    'lebih': 'Benda yang tidak diminta dibuat nol.',
    'kebenaran': 'Lihat kubahnya dulu sebelum memilih kata kuantitas.'
  },
  alatCuaca: {
    penakar: { nama: 'Penakar hujan', fakta: 'Penakar hujan mengukur berapa banyak hujan yang turun.', sprite: 'penakar-hujan' },
    anemometer: { nama: 'Anemometer', fakta: 'Anemometer mengukur kecepatan angin.', sprite: 'anemometer' },
    kantong: { nama: 'Kantong angin', fakta: 'Kantong angin menunjukkan arah dan kekuatan angin.', sprite: 'kantong-angin' },
    termometer: { nama: 'Termometer', fakta: 'Termometer mengukur suhu udara.', sprite: 'termometer' },
    baling: { nama: 'Baling-baling angin', fakta: 'Baling-baling angin menunjukkan dari mana angin datang.', sprite: 'baling-angin' }
  },
  alatLevel: { 1: 'penakar', 2: 'anemometer', 3: 'kantong', 4: 'termometer', 5: 'baling' },
  info: {
    info: {
      judul: 'Informasi',
      tab: { tujuan: 'Tujuan', cara: 'Cara Main' },
      pengantar: 'Mata pelajaran: Bahasa Inggris. Topik: Describing Quantity.',
      /* tujuan pembelajaran dalam satu kalimat */
      tujuan: 'Setelah bermain, kamu bisa menyatakan jumlah benda dalam bahasa Inggris dengan tepat, yaitu membedakan benda yang dihitung dan ditakar serta memakai a few, a little, many, much, a lot of, some, any, no, There is, dan There are.',
      meta: 'Waktu bermain sekitar 15-20 menit.',
      cara: [
        'Ketuk Tombol Hitung untuk menambah benda satu per satu.',
        'Tarik Tuas Takar untuk menakar hujan, angin, atau pasir.',
        'Dengarkan dan baca Papan Kalimat di atas kubah.',
        'Pakai Lensa untuk melihat butir hujan dari dekat.'
      ],
      caraCatatan: 'Salah itu biasa. Kumu akan membantumu.'
    },
    referensi: {
      judul: 'Referensi',
      tab: { sumber: 'Sumber Materi', ka: 'Kecerdasan Artifisial' },
      sumberPengantar: 'Sumber materi:',
      /* [penulis dan tahun, judul (miring), penerbit] */
      sumber: [
        ['Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025).', 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.', 'Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.'],
        ['Emilia, E., Wijayanti, M.A., dkk. (2025).', 'Panduan Mata Pelajaran Bahasa Inggris Fase B-F dan Fase F Tingkat Lanjut.', 'Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.']
      ],
      topik: 'Topik: countable dan uncountable nouns, a few, a little, many, much, a lot of, some, any, no, There is dan There are.',
      huruf: 'Huruf Andika dan Baloo 2 berlisensi SIL Open Font License.',
      kaPengantar: 'Pengembang memakai kecerdasan artifisial (KA) sebagai alat bantu.',
      ka: [['Gambar', 'Dibuat dengan ChatGPT, lalu dipilih dan disunting pengembang.'], ['Musik', 'Dibuat dengan Suno.'], ['Kode dan naskah', 'Dibantu Claude.'], ['Pemeriksaan', 'Diuji otomatis. Pengembang bertanggung jawab atas isinya.']]
    },
    pengembang: {
      judul: 'Pengembang', tahun: 'Tahun pembuatan: 2026', urutan: 'Pengembang {n} dari {t}',
      sebelumnya: 'Pengembang sebelumnya', berikutnya: 'Pengembang berikutnya',
      /* digeser dengan tombol panah; foto = kunci gambar di js/data/aset.js */
      profil: [
        {
          nama: 'Jamaluddin', fotoAlt: 'Foto Jamaluddin', foto: 'pengembang',
          baris: ['UPTD SMPN 2 Robatal', 'jamaluddin551@guru.smp.belajar.id', { ikon: 'instagram', alt: 'Instagram', teks: 'tretanjamal' }],
          daftarJudul: 'Prestasi dan Pengalaman',
          daftar: [
            'Narasumber Digitalisasi Pembelajaran Kemendikdasmen',
            'Guru Pejuang Digital',
            'Juara 1 Lomba Inovasi Guru SMP Kabupaten Sampang 2026',
            'Juara 1 Guru Inspiratif SMP Kabupaten Sampang 2026',
            'Komunitas Belajar Terbaik BLPT Kemendikdasmen 2024'
          ]
        },
        { nama: 'Abdul Karim, S.Pd.SD', fotoAlt: 'Foto Abdul Karim', foto: 'pengembang2', baris: ['Guru UPTD SDN JELGUNG 1'] }
      ]
    }
  }
};
