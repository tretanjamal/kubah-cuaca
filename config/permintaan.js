/* Permintaan cuaca warga Lembah Embun (brief keputusan 9 dan 12; GDD bagian 11). Selalu kalimat perintah, tanpa "Can you add some...?".
   boleh: alat -> zona yang masuk akal untuk alasan warga (Pak Darto tidak pernah meminta hujan).
   Zona: hitung no | satu | few | lot ; takar no | little | lot. Zona abu-abu tidak pernah menjadi sasaran.
   pola: {daftar} diganti frasa kuantitas, misalnya "a few clouds and a lot of kites". */
window.PERMINTAAN = {
  warga: {
    dina: { nama: 'Dina', alasan: 'Klub layang-layang', tokoh: 'dina',
      boleh: { kites: ['few', 'lot'], wind: ['lot'], clouds: ['few', 'satu'], rain: ['no'] } },
    wati: { nama: 'Bu Wati', alasan: 'Kebun sekolah', tokoh: 'wati',
      boleh: { rain: ['little'], clouds: ['few', 'satu'], sunshine: ['little', 'lot'], umbrellas: ['satu', 'few'] } },
    udin: { nama: 'Pak Udin', alasan: 'Nelayan danau', tokoh: 'udin',
      boleh: { boats: ['few', 'lot', 'satu'], fog: ['no'], wind: ['little', 'no'], water: ['lot'] } },
    darto: { nama: 'Pak Darto', alasan: 'Petani garam', tokoh: 'darto',
      boleh: { sunshine: ['lot'], rain: ['no'], water: ['little'], clouds: ['no'] } }
  },
  pola: ['Please make {daftar}.', 'We need {daftar}, please.', 'Please add {daftar}.', '{Daftar}, please.'],
  /* alat untuk tiap level (L2 hanya benda yang dihitung, L3 campur) */
  alatLevel: {
    2: ['clouds', 'kites', 'umbrellas', 'boats'],
    3: ['clouds', 'kites', 'umbrellas', 'boats', 'rain', 'sunshine', 'wind', 'snow', 'fog', 'water']
  },
  /* Festival Lembah L5: alat di panel paling banyak 2 Tombol Hitung dan 3 Tuas Takar */
  festival: { maksHitung: 2, maksTakar: 3 }
};
