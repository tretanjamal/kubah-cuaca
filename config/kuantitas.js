/* Zona jumlah (brief keputusan 4). Ini aturan main gim, dijelaskan di catatan guru: dalam bahasa Inggris sungguhan kata-kata ini relatif.
   Dipakai bersama oleh Papan Kalimat, Lensa, generator, penilai, dan pemeriksa kebenaran.
   Tugas tidak pernah menarget zona abu-abu (5-7 benda, takaran 40-60). */
window.KUANTITAS = {
  maksHitung: 12,
  langkahTakar: 10,
  angka: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
  /* benda yang dihitung: zona per jumlah */
  hitung: [
    { id: 'no', min: 0, maks: 0, kata: 'no', indo: 'tidak ada' },
    { id: 'satu', min: 1, maks: 1, kata: 'a', indo: 'satu' },
    { id: 'few', min: 2, maks: 4, kata: 'a few', indo: 'beberapa' },
    { id: 'abu', min: 5, maks: 7, kata: null, indo: 'angka', abu: true },
    { id: 'lot', min: 8, maks: 12, kata: 'a lot of', alt: 'many', indo: 'banyak' }
  ],
  /* benda yang ditakar: zona per takaran (lompatan 10) */
  takar: [
    { id: 'no', min: 0, maks: 0, kata: 'no', indo: 'tidak ada' },
    { id: 'little', min: 10, maks: 30, kata: 'a little', indo: 'sedikit' },
    { id: 'some', min: 40, maks: 60, kata: 'some', indo: 'ada', abu: true },
    { id: 'lot', min: 70, maks: 100, kata: 'a lot of', indo: 'banyak' }
  ],
  /* Lensa: takaran hujan atau salju -> jumlah butir di dalam lensa (zona dipetakan satu lawan satu) */
  lensa: { 0: 0, 10: 2, 20: 3, 30: 4, 40: 5, 50: 6, 60: 7, 70: 8, 80: 10, 90: 11, 100: 12 },
  /* kelompok kata kuantitas untuk warna, ikon, dan lekuk */
  kelompok: { 'a': 'hitung', 'an': 'hitung', 'a few': 'hitung', 'many': 'hitung', 'How many': 'hitung', 'a little': 'takar', 'much': 'takar', 'How much': 'takar',
    'some': 'serba', 'any': 'serba', 'no': 'serba', 'a lot of': 'serba' }
};
