/* Suara tiap tokoh lewat speechSynthesis. Ubah angkanya di sini bila kurang pas setelah didengarkan.
   jenis: p pria, w wanita; suara perangkat yang sejenis didahulukan. pitch: nada bila suaranya sejenis,
   pitchLain: bila perangkat hanya punya suara lawan jenis. rate: kecepatan.
   Brief bagian 9: nada 0,9-1,15 dan kecepatan 0,85-0,95 supaya ucapan tetap jelas. */
window.SUARA = {
  namaPria: /david|mark|guy|james|george|daniel|fred|ryan|andrew|brian|christopher|eric|roger|steffan|thomas|andika|ardi|\bmale\b|pria|laki/i,
  /* arahan Kumu berbahasa Indonesia (dibacakan bila "Bacakan arahan" nyala) */
  narasi: { jenis: 'w', pitch: 1.1, pitchLain: 1.15, rate: 0.95 },
  tokoh: {
    kumu: { jenis: 'w', pitch: 1.12, pitchLain: 1.15, rate: 0.95 },    // awan kecil: riang
    bayu: { jenis: 'p', pitch: 1.0, pitchLain: 0.95, rate: 0.9 },      // prakirawan muda: hangat dan jelas
    papan: { jenis: 'w', pitch: 1.0, pitchLain: 1.0, rate: 0.88 },     // Papan Kalimat: netral dan pelan
    darto: { jenis: 'p', pitch: 0.9, pitchLain: 0.9, rate: 0.88 },
    dina: { jenis: 'w', pitch: 1.15, pitchLain: 1.15, rate: 0.93 },
    udin: { jenis: 'p', pitch: 0.95, pitchLain: 0.95, rate: 0.9 },
    wati: { jenis: 'w', pitch: 1.05, pitchLain: 1.1, rate: 0.9 }
  }
};
