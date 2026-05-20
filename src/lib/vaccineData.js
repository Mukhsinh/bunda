/**
 * Data Jadwal Imunisasi Rutin Indonesia
 * Berdasarkan: Permenkes RI No. 12 Tahun 2017 & Program Imunisasi Nasional Terbaru
 */
export const vaccineData = [
    // ── IMUNISASI DASAR (0-12 BULAN) ──
    {
        id: 'hb0',
        name: 'Hepatitis B (HB-0)',
        age: 0,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah penyakit Hepatitis B (infeksi hati)',
        description: 'Diberikan segera setelah lahir (< 24 jam) untuk mencegah penularan Hepatitis B dari ibu ke bayi.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'bcg',
        name: 'BCG',
        age: 1,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah penyakit Tuberkulosis (TBC) berat',
        description: 'Mencegah TBC paru, TBC selaput otak (meningitis), dan TBC tulang.',
        cara: 'Suntikan Intrakutan'
    },
    {
        id: 'polio1',
        name: 'Polio Tetetas 1 (OPV 1)',
        age: 1,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Pemberian pertama vaksin polio tetes.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'dpt_hb_hib_1',
        name: 'DPT-HB-Hib 1',
        age: 2,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Difteri, Pertusis, Tetanus, Hepatitis B, Meningitis & Pneumonia (Hib)',
        description: 'Vaksin kombinasi (Pentavalen) dosis pertama.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'polio2',
        name: 'Polio Tetes 2 (OPV 2)',
        age: 2,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Dosis kedua polio tetes.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'pcv1',
        name: 'PCV 1',
        age: 2,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Pneumonia dan Meningitis akibat Pneumokokus',
        description: 'Melindungi bayi dari infeksi bakteri penyebab radang paru.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'rotavirus1',
        name: 'Rotavirus 1 (RV 1)',
        age: 2,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Diare berat akibat Rotavirus',
        description: 'Vaksin tetes untuk mencegah dehidrasi akibat diare.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'dpt_hb_hib_2',
        name: 'DPT-HB-Hib 2',
        age: 3,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Difteri, Pertusis, Tetanus, Hepatitis B, Meningitis & Pneumonia (Hib)',
        description: 'Dosis kedua vaksin kombinasi.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'polio3',
        name: 'Polio Tetes 3 (OPV 3)',
        age: 3,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Dosis ketiga polio tetes.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'pcv2',
        name: 'PCV 2',
        age: 3,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Pneumonia dan Meningitis akibat Pneumokokus',
        description: 'Dosis kedua pelindung radang paru.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'rotavirus2',
        name: 'Rotavirus 2 (RV 2)',
        age: 3,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Diare berat akibat Rotavirus',
        description: 'Dosis kedua vaksin diare.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'dpt_hb_hib_3',
        name: 'DPT-HB-Hib 3',
        age: 4,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Difteri, Pertusis, Tetanus, Hepatitis B, Meningitis & Pneumonia (Hib)',
        description: 'Dosis ketiga vaksin kombinasi.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'polio4',
        name: 'Polio Tetes 4 (OPV 4)',
        age: 4,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Dosis keempat polio tetes.',
        cara: 'Tetes Mulut'
    },
    {
        id: 'ipv1',
        name: 'Polio Suntik (IPV) 1',
        age: 4,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Vaksin polio suntik dosis pertama.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'rotavirus3',
        name: 'Rotavirus 3 (RV 3)',
        age: 4,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Diare berat akibat Rotavirus',
        description: 'Dosis ketiga (tergantung jenis vaksin RV).',
        cara: 'Tetes Mulut'
    },
    {
        id: 'ipv2',
        name: 'Polio Suntik (IPV) 2',
        age: 9,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah kelumpuhan (Poliomielitis)',
        description: 'Dosis kedua polio suntik.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'mr1',
        name: 'Campak-Rubella (MR) 1',
        age: 9,
        unit: 'bulan',
        mandatory: true,
        category: 'dasar',
        fungsi: 'Mencegah Campak dan Rubella',
        description: 'Mencegah cacat bawaan dan komplikasi radang otak akibat virus campak.',
        cara: 'Suntikan Subkutan'
    },
    {
        id: 'pcv3',
        name: 'PCV 3',
        age: 12,
        unit: 'bulan',
        mandatory: true,
        category: 'lanjutan',
        fungsi: 'Mencegah Pneumonia dan Meningitis akibat Pneumokokus',
        description: 'Dosis booster (penguat) untuk perlindungan jangka panjang.',
        cara: 'Suntikan Intramuskular'
    },

    // ── IMUNISASI LANJUTAN BADUTA (18 BULAN) ──
    {
        id: 'dpt_hb_hib_booster',
        name: 'DPT-HB-Hib Booster',
        age: 18,
        unit: 'bulan',
        mandatory: true,
        category: 'lanjutan',
        fungsi: 'Penguat kekebalan Difteri, Pertusis, Tetanus, Hepatitis B, Hib',
        description: 'Sangat penting untuk menjaga kekebalan yang sudah mulai menurun.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'mr2',
        name: 'Campak-Rubella (MR) 2',
        age: 18,
        unit: 'bulan',
        mandatory: true,
        category: 'lanjutan',
        fungsi: 'Penguat kekebalan Campak dan Rubella',
        description: 'Dosis kedua untuk memastikan perlindungan optimal.',
        cara: 'Suntikan Subkutan'
    },

    // ── IMUNISASI LANJUTAN ANAK SEKOLAH (BIAS) ──
    {
        id: 'mr_bias',
        name: 'MR (BIAS Kelas 1)',
        age: 7, // ~7 tahun
        unit: 'tahun',
        mandatory: true,
        category: 'bias',
        fungsi: 'Mencegah Campak dan Rubella',
        description: 'Imunisasi rutin tahunan di sekolah dasar kelas 1.',
        cara: 'Suntikan Subkutan'
    },
    {
        id: 'dt_bias',
        name: 'DT (BIAS Kelas 1)',
        age: 7,
        unit: 'tahun',
        mandatory: true,
        category: 'bias',
        fungsi: 'Mencegah Difteri dan Tetanus',
        description: 'Imunisasi untuk anak SD kelas 1.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'td_bias_1',
        name: 'Td (BIAS Kelas 2)',
        age: 8,
        unit: 'tahun',
        mandatory: true,
        category: 'bias',
        fungsi: 'Mencegah Tetanus dan Difteri',
        description: 'Imunisasi lanjutan untuk anak SD kelas 2.',
        cara: 'Suntikan Intramuskular'
    },
    {
        id: 'td_bias_2',
        name: 'Td (BIAS Kelas 5)',
        age: 11,
        unit: 'tahun',
        mandatory: true,
        category: 'bias',
        fungsi: 'Mencegah Tetanus dan Difteri',
        description: 'Imunisasi lanjutan untuk anak SD kelas 5.',
        cara: 'Suntikan Intramuskular'
    }
];
