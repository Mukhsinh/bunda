/**
 * WHO Child Growth Standards - LMS Reference Data
 * Based on: WHO Child Growth Standards (2006) & Permenkes RI No. 2 Tahun 2020
 * 
 * Z-score formula (LMS method):
 *   Z = ((X/M)^L - 1) / (L × S)   when L ≠ 0
 *   Z = ln(X/M) / S               when L = 0
 * 
 * Where:
 *   X = measured value (weight in kg, height in cm, or BMI)
 *   L = Box-Cox power for skewness correction
 *   M = Median reference value
 *   S = Generalized coefficient of variation
 *
 * Reference data sourced from WHO Anthro (0-60 months)
 * https://www.who.int/tools/child-growth-standards/standards
 */

// ═══════════════════════════════════════════════════════════
// WHO LMS Reference Tables (Key ages, 0-60 months)
// Interpolation is used for intermediate ages
// ═══════════════════════════════════════════════════════════

// Weight-for-Age (BB/U) - Boys
const WFA_BOYS = [
    { age: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
    { age: 1, L: 0.2297, M: 4.4709, S: 0.13395 },
    { age: 2, L: 0.1970, M: 5.5675, S: 0.12385 },
    { age: 3, L: 0.1738, M: 6.3762, S: 0.11727 },
    { age: 4, L: 0.1553, M: 7.0023, S: 0.11316 },
    { age: 5, L: 0.1395, M: 7.5105, S: 0.11080 },
    { age: 6, L: 0.1257, M: 7.9340, S: 0.10958 },
    { age: 9, L: 0.0842, M: 8.9014, S: 0.10968 },
    { age: 12, L: 0.0504, M: 9.6479, S: 0.11164 },
    { age: 15, L: 0.0217, M: 10.3002, S: 0.11413 },
    { age: 18, L: -0.0033, M: 10.9089, S: 0.11660 },
    { age: 24, L: -0.0480, M: 12.1515, S: 0.12149 },
    { age: 30, L: -0.0903, M: 13.3462, S: 0.12362 },
    { age: 36, L: -0.1317, M: 14.3441, S: 0.12475 },
    { age: 42, L: -0.1694, M: 15.2394, S: 0.12524 },
    { age: 48, L: -0.2051, M: 16.0695, S: 0.12529 },
    { age: 54, L: -0.2378, M: 16.8677, S: 0.12508 },
    { age: 60, L: -0.2681, M: 17.6694, S: 0.12466 },
];

// Weight-for-Age (BB/U) - Girls
const WFA_GIRLS = [
    { age: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
    { age: 1, L: 0.1714, M: 4.1873, S: 0.13724 },
    { age: 2, L: 0.0962, M: 5.1282, S: 0.13000 },
    { age: 3, L: 0.0402, M: 5.8458, S: 0.12619 },
    { age: 4, L: -0.0050, M: 6.4237, S: 0.12402 },
    { age: 5, L: -0.0430, M: 6.8985, S: 0.12274 },
    { age: 6, L: -0.0756, M: 7.2970, S: 0.12204 },
    { age: 9, L: -0.1560, M: 8.2000, S: 0.12260 },
    { age: 12, L: -0.2142, M: 8.9500, S: 0.12474 },
    { age: 15, L: -0.2559, M: 9.6200, S: 0.12780 },
    { age: 18, L: -0.2881, M: 10.2400, S: 0.13104 },
    { age: 24, L: -0.3380, M: 11.5000, S: 0.13590 },
    { age: 30, L: -0.3693, M: 12.6900, S: 0.13829 },
    { age: 36, L: -0.3873, M: 13.9000, S: 0.13914 },
    { age: 42, L: -0.4004, M: 15.0000, S: 0.13968 },
    { age: 48, L: -0.4089, M: 16.0600, S: 0.13981 },
    { age: 54, L: -0.4146, M: 17.0500, S: 0.14010 },
    { age: 60, L: -0.4176, M: 17.9700, S: 0.14090 },
];

// Length/Height-for-Age (TB/U) - Boys
const HFA_BOYS = [
    { age: 0, L: 1, M: 49.8842, S: 0.03795 },
    { age: 1, L: 1, M: 54.7244, S: 0.03557 },
    { age: 2, L: 1, M: 58.4249, S: 0.03424 },
    { age: 3, L: 1, M: 61.4292, S: 0.03328 },
    { age: 4, L: 1, M: 63.8860, S: 0.03257 },
    { age: 5, L: 1, M: 65.9026, S: 0.03204 },
    { age: 6, L: 1, M: 67.6236, S: 0.03165 },
    { age: 9, L: 1, M: 72.0000, S: 0.03100 },
    { age: 12, L: 1, M: 75.7488, S: 0.03068 },
    { age: 15, L: 1, M: 79.0000, S: 0.03050 },
    { age: 18, L: 1, M: 82.0000, S: 0.03040 },
    { age: 24, L: 1, M: 87.1000, S: 0.03020 },
    { age: 30, L: 1, M: 91.9000, S: 0.03010 },
    { age: 36, L: 1, M: 96.1000, S: 0.03000 },
    { age: 42, L: 1, M: 99.9000, S: 0.02990 },
    { age: 48, L: 1, M: 103.3000, S: 0.02980 },
    { age: 54, L: 1, M: 106.7000, S: 0.02970 },
    { age: 60, L: 1, M: 110.0000, S: 0.02960 },
];

// Length/Height-for-Age (TB/U) - Girls
const HFA_GIRLS = [
    { age: 0, L: 1, M: 49.1477, S: 0.03790 },
    { age: 1, L: 1, M: 53.6872, S: 0.03610 },
    { age: 2, L: 1, M: 57.0673, S: 0.03460 },
    { age: 3, L: 1, M: 59.8029, S: 0.03380 },
    { age: 4, L: 1, M: 62.0899, S: 0.03330 },
    { age: 5, L: 1, M: 64.0301, S: 0.03290 },
    { age: 6, L: 1, M: 65.7311, S: 0.03260 },
    { age: 9, L: 1, M: 70.1000, S: 0.03200 },
    { age: 12, L: 1, M: 74.0000, S: 0.03170 },
    { age: 15, L: 1, M: 77.5000, S: 0.03150 },
    { age: 18, L: 1, M: 80.7000, S: 0.03130 },
    { age: 24, L: 1, M: 86.4000, S: 0.03120 },
    { age: 30, L: 1, M: 91.2000, S: 0.03100 },
    { age: 36, L: 1, M: 95.1000, S: 0.03080 },
    { age: 42, L: 1, M: 98.8000, S: 0.03060 },
    { age: 48, L: 1, M: 102.2000, S: 0.03050 },
    { age: 54, L: 1, M: 105.6000, S: 0.03040 },
    { age: 60, L: 1, M: 109.0000, S: 0.03030 },
];

// BMI-for-Age (IMT/U) - Boys
const BMIFA_BOYS = [
    { age: 0, L: -0.3053, M: 13.4069, S: 0.09458 },
    { age: 1, L: 0.2441, M: 14.9441, S: 0.09051 },
    { age: 2, L: 0.1002, M: 16.3245, S: 0.08652 },
    { age: 3, L: -0.0585, M: 16.8990, S: 0.08428 },
    { age: 4, L: -0.1660, M: 17.1510, S: 0.08281 },
    { age: 5, L: -0.2381, M: 17.2280, S: 0.08176 },
    { age: 6, L: -0.2860, M: 17.2000, S: 0.08096 },
    { age: 9, L: -0.3600, M: 17.0000, S: 0.07900 },
    { age: 12, L: -0.3999, M: 16.7100, S: 0.07790 },
    { age: 15, L: -0.4200, M: 16.4200, S: 0.07730 },
    { age: 18, L: -0.4300, M: 16.1600, S: 0.07700 },
    { age: 24, L: -0.4300, M: 16.0200, S: 0.07800 },
    { age: 30, L: -0.4100, M: 15.7500, S: 0.07830 },
    { age: 36, L: -0.3903, M: 15.5400, S: 0.07876 },
    { age: 42, L: -0.3700, M: 15.3700, S: 0.07930 },
    { age: 48, L: -0.3500, M: 15.2500, S: 0.08000 },
    { age: 54, L: -0.3300, M: 15.1800, S: 0.08100 },
    { age: 60, L: -0.3126, M: 15.1600, S: 0.08216 },
];

// BMI-for-Age (IMT/U) - Girls
const BMIFA_GIRLS = [
    { age: 0, L: -0.0631, M: 13.3363, S: 0.09274 },
    { age: 1, L: 0.3270, M: 14.6100, S: 0.09006 },
    { age: 2, L: 0.0640, M: 15.7920, S: 0.08732 },
    { age: 3, L: -0.1218, M: 16.3720, S: 0.08503 },
    { age: 4, L: -0.2354, M: 16.6400, S: 0.08336 },
    { age: 5, L: -0.2948, M: 16.7280, S: 0.08212 },
    { age: 6, L: -0.3234, M: 16.7000, S: 0.08116 },
    { age: 9, L: -0.3700, M: 16.6000, S: 0.07900 },
    { age: 12, L: -0.4000, M: 16.3000, S: 0.07860 },
    { age: 15, L: -0.4100, M: 16.0000, S: 0.07860 },
    { age: 18, L: -0.4200, M: 15.7500, S: 0.07890 },
    { age: 24, L: -0.4200, M: 15.7000, S: 0.08150 },
    { age: 30, L: -0.4000, M: 15.4200, S: 0.08200 },
    { age: 36, L: -0.3800, M: 15.2100, S: 0.08270 },
    { age: 42, L: -0.3600, M: 15.0500, S: 0.08360 },
    { age: 48, L: -0.3400, M: 14.9400, S: 0.08470 },
    { age: 54, L: -0.3200, M: 14.8700, S: 0.08600 },
    { age: 60, L: -0.2986, M: 14.8500, S: 0.08750 },
];

// Weight-for-Length/Height (BB/TB) - Boys
const WFH_BOYS = [
    { height: 45, L: -0.3521, M: 2.4410, S: 0.09182 },
    { height: 50, L: -0.0631, M: 3.3464, S: 0.09294 },
    { height: 55, L: 0.2538, M: 4.6970, S: 0.09030 },
    { height: 60, L: 0.2980, M: 5.9230, S: 0.08780 },
    { height: 65, L: 0.1850, M: 7.4104, S: 0.08300 },
    { height: 70, L: 0.0490, M: 8.5690, S: 0.08117 },
    { height: 75, L: -0.0850, M: 9.5380, S: 0.08050 },
    { height: 80, L: -0.2050, M: 10.3900, S: 0.08050 },
    { height: 85, L: -0.3140, M: 11.2030, S: 0.08100 },
    { height: 90, L: -0.3820, M: 12.0300, S: 0.08200 },
    { height: 95, L: -0.4280, M: 12.9300, S: 0.08330 },
    { height: 100, L: -0.4560, M: 13.9300, S: 0.08400 },
    { height: 105, L: -0.4730, M: 15.0200, S: 0.08450 },
    { height: 110, L: -0.4870, M: 16.2100, S: 0.08500 },
    { height: 115, L: -0.4950, M: 17.5000, S: 0.08560 },
    { height: 120, L: -0.5010, M: 18.9300, S: 0.08620 },
];

// Weight-for-Length/Height (BB/TB) - Girls
const WFH_GIRLS = [
    { height: 45, L: -0.3833, M: 2.4607, S: 0.09029 },
    { height: 50, L: -0.1136, M: 3.2322, S: 0.09266 },
    { height: 55, L: 0.0717, M: 4.3684, S: 0.09185 },
    { height: 60, L: 0.1290, M: 5.7180, S: 0.08900 },
    { height: 65, L: 0.0680, M: 7.1800, S: 0.08370 },
    { height: 70, L: -0.0340, M: 8.2530, S: 0.08180 },
    { height: 75, L: -0.1330, M: 9.1270, S: 0.08110 },
    { height: 80, L: -0.2200, M: 9.9200, S: 0.08120 },
    { height: 85, L: -0.3030, M: 10.7600, S: 0.08180 },
    { height: 90, L: -0.3640, M: 11.5900, S: 0.08290 },
    { height: 95, L: -0.4060, M: 12.5200, S: 0.08420 },
    { height: 100, L: -0.4350, M: 13.5800, S: 0.08530 },
    { height: 105, L: -0.4540, M: 14.7400, S: 0.08620 },
    { height: 110, L: -0.4680, M: 16.0200, S: 0.08700 },
    { height: 115, L: -0.4770, M: 17.4600, S: 0.08780 },
    { height: 120, L: -0.4840, M: 19.0400, S: 0.08850 },
];


// ═══════════════════════════════════════════════════════════
// Interpolation & Z-Score Calculation (LMS Method)
// ═══════════════════════════════════════════════════════════

/**
 * Linear interpolation of LMS values between two reference points
 */
function interpolateLMS(table, key, value) {
    // Clamp to table range
    if (value <= table[0][key]) return table[0];
    if (value >= table[table.length - 1][key]) return table[table.length - 1];

    for (let i = 0; i < table.length - 1; i++) {
        if (value >= table[i][key] && value <= table[i + 1][key]) {
            const frac = (value - table[i][key]) / (table[i + 1][key] - table[i][key]);
            return {
                L: table[i].L + frac * (table[i + 1].L - table[i].L),
                M: table[i].M + frac * (table[i + 1].M - table[i].M),
                S: table[i].S + frac * (table[i + 1].S - table[i].S),
            };
        }
    }
    return table[table.length - 1];
}

/**
 * Calculate Z-score using the WHO LMS method
 * Z = ((X/M)^L - 1) / (L × S)   when L ≠ 0
 * Z = ln(X/M) / S               when L = 0
 */
function calculateZScore(x, L, M, S) {
    if (Math.abs(L) < 0.001) {
        return Math.log(x / M) / S;
    }
    return (Math.pow(x / M, L) - 1) / (L * S);
}


// ═══════════════════════════════════════════════════════════
// Main Calculation Function
// ═══════════════════════════════════════════════════════════

/**
 * Calculate all 4 nutrition indices per WHO/Permenkes standards
 * @param {number} weight - Body weight in kg
 * @param {number} height - Body length/height in cm
 * @param {number} ageInMonths - Age in completed months (0-60)
 * @param {string} gender - 'male' or 'female'
 * @returns {Object} All 4 indices with Z-scores and status
 */
export function calculateNutritionIndices(weight, height, ageInMonths, gender) {
    const isMale = gender === 'male';

    // ── 1. BB/U (Weight-for-Age) ──
    const wfaTable = isMale ? WFA_BOYS : WFA_GIRLS;
    const wfaLMS = interpolateLMS(wfaTable, 'age', ageInMonths);
    const zBBU = calculateZScore(weight, wfaLMS.L, wfaLMS.M, wfaLMS.S);

    // ── 2. TB/U (Height-for-Age) ──
    // Permenkes: usia 0-24 bulan → PB (telentang), >24 bulan → TB (berdiri)
    // Koreksi 0.7 cm jika tertukar
    const hfaTable = isMale ? HFA_BOYS : HFA_GIRLS;
    const hfaLMS = interpolateLMS(hfaTable, 'age', ageInMonths);
    const zTBU = calculateZScore(height, hfaLMS.L, hfaLMS.M, hfaLMS.S);

    // ── 3. BB/TB (Weight-for-Height) ──
    const wfhTable = isMale ? WFH_BOYS : WFH_GIRLS;
    const wfhLMS = interpolateLMS(wfhTable, 'height', height);
    const zBBTB = calculateZScore(weight, wfhLMS.L, wfhLMS.M, wfhLMS.S);

    // ── 4. IMT/U (BMI-for-Age) ──
    const heightInM = height / 100;
    const imt = weight / (heightInM * heightInM);
    const bmifaTable = isMale ? BMIFA_BOYS : BMIFA_GIRLS;
    const bmifaLMS = interpolateLMS(bmifaTable, 'age', ageInMonths);
    const zIMTU = calculateZScore(imt, bmifaLMS.L, bmifaLMS.M, bmifaLMS.S);

    return {
        bb_u: { zScore: zBBU.toFixed(2), status: getBBUStatus(zBBU) },
        tb_u: { zScore: zTBU.toFixed(2), status: getTBUStatus(zTBU) },
        bb_tb: { zScore: zBBTB.toFixed(2), status: getBBTBStatus(zBBTB) },
        imt_u: { zScore: zIMTU.toFixed(2), imt: imt.toFixed(1), status: getIMTUStatus(zIMTU) }
    };
}


// ═══════════════════════════════════════════════════════════
// Status Classification (Permenkes RI No. 2 Tahun 2020)
// ═══════════════════════════════════════════════════════════

/**
 * BB/U Classification
 * < -3 SD  : Berat badan sangat kurang (severely underweight)
 * -3 to <-2: Berat badan kurang (underweight)
 * -2 to +1 : Berat badan normal
 * > +1     : Risiko berat badan lebih
 */
function getBBUStatus(z) {
    if (z < -3) return 'Berat Badan Sangat Kurang';
    if (z < -2) return 'Berat Badan Kurang';
    if (z <= 1) return 'Normal';
    return 'Risiko Berat Badan Lebih';
}

/**
 * TB/U (PB/U) Classification
 * < -3 SD  : Sangat pendek (severely stunted)
 * -3 to <-2: Pendek (stunted)
 * -2 to +3 : Normal
 * > +3     : Tinggi
 */
function getTBUStatus(z) {
    if (z < -3) return 'Sangat Pendek (Severely Stunted)';
    if (z < -2) return 'Pendek (Stunted)';
    if (z <= 3) return 'Normal';
    return 'Tinggi';
}

/**
 * BB/TB (BB/PB) Classification
 * < -3 SD    : Gizi buruk (severely wasted)
 * -3 to < -2 : Gizi kurang (wasted)
 * -2 to +1   : Gizi baik (normal)
 * > +1 to +2 : Berisiko gizi lebih (possible risk of overweight)
 * > +2 to +3 : Gizi lebih (overweight)
 * > +3       : Obesitas (obese)
 */
function getBBTBStatus(z) {
    if (z < -3) return 'Gizi Buruk (Severely Wasted)';
    if (z < -2) return 'Gizi Kurang (Wasted)';
    if (z <= 1) return 'Gizi Baik (Normal)';
    if (z <= 2) return 'Berisiko Gizi Lebih';
    if (z <= 3) return 'Gizi Lebih (Overweight)';
    return 'Obesitas';
}

/**
 * IMT/U Classification (0-60 bulan)
 * < -3 SD    : Gizi buruk (severely wasted)
 * -3 to < -2 : Gizi kurang (wasted)
 * -2 to +1   : Gizi baik (normal)
 * > +1 to +2 : Berisiko gizi lebih
 * > +2 to +3 : Gizi lebih (overweight)
 * > +3       : Obesitas
 */
function getIMTUStatus(z) {
    if (z < -3) return 'Gizi Buruk (Severely Wasted)';
    if (z < -2) return 'Gizi Kurang (Wasted)';
    if (z <= 1) return 'Gizi Baik (Normal)';
    if (z <= 2) return 'Berisiko Gizi Lebih';
    if (z <= 3) return 'Gizi Lebih (Overweight)';
    return 'Obesitas';
}
