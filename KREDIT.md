# Kredit: Kubah Cuaca: How Many Clouds? How Much Rain?
Konten Lab Maya Bahasa Inggris, topik Describing Quantity, ID 482. Pengembang: Jamaluddin (UPTD SMPN 2 Robatal) dan Abdul Karim, S.Pd.SD (UPTD SDN JELGUNG 1), 2026.

## Huruf (dibundel di `assets/fonts/`, lisensi di folder yang sama)
- **Andika** 400/700, SIL International, SIL Open Font License 1.1 (`OFL-Andika.txt`).
- **Baloo 2** 800, Ek Type, SIL Open Font License 1.1 (`OFL-Baloo2.txt`).

## Gambar
- **Dibuat dengan ChatGPT (OpenAI) oleh kreator, 10 November 2026**, dari prompt di `docs/ASET-PROMPT.md`: `lembah-siang`, `lab-dalam`, `judul-latar`, `kumu-badan`, `kumu-ekspresi`, `benda-a`, `benda-b`, `instrumen`, `bayu-acuan`, `warga-acuan`, `keyart`.
- Diproses dengan `tools/proses-aset.py`: dipotong, sprite dipisah, potret dipotong, langit lembah dibuat transparan, salju dan garam bawaan gambar dihapus, lalu dikompres ke WebP.
- Thumbnail 840x472: key art `keyart` (ChatGPT) dipotong 16:9, judul ditulis kode dengan huruf Baloo 2 dan Andika (`tools/thumbnail.html`).
- Foto pengembang: milik masing-masing pengembang (`Jamal.png`, `Abdul Karim.jpe`), dipakai atas izin mereka.
- Gambar lain (ikon, tombol, Tombol Hitung, Tuas Takar, kartu kata, lensa, wajah Kumu, partikel cuaca) digambar dengan kode SVG khusus untuk gim ini. Setiap gambar ChatGPT juga punya versi SVG cadangan.

## Musik
- **Dibuat dengan Suno oleh kreator, 10 November 2026**, dari prompt di `docs/ASET-PROMPT.md` bagian 12: "Kubah Cuaca Lab", "Kubah Cuaca Opening", "Kubah Cuaca Night Patrol", dan "Kubah Cuaca Festival". Diproses menjadi loop mono 64 kbps (`js/data/musik_bgm_*.js`) dengan `tools/proses-aset.py`. Dipakai di layar judul dan Stasiun, Level 1-3, Level 4 (malam), serta Level 5-6 (festival).
- **Perlu dilengkapi kreator sebelum terbit:** paket Suno yang dipakai. Paket gratis Suno tidak memberi hak pakai komersial.
- Efek suara dan lapisan cuaca adaptif: sintesis WebAudio di dalam kode.

## Suara
- Suara perangkat (speechSynthesis). Bila nanti memakai rekaman, sumbernya dicatat di sini.

## Sumber materi
- Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025). *Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.* Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.
- Emilia, E., Wijayanti, M.A., dkk. (2025). *Panduan Mata Pelajaran Bahasa Inggris Fase B-F dan Fase F Tingkat Lanjut.* Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.
