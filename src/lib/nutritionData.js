// ═══════════════════════════════════════════════════════════
// WHO LMS Reference Tables (Monthly for 0-24, Quarterly for 24-60)
// Sourced from WHO Child Growth Standards & Permenkes RI 2/2020
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
    { age: 7, L: 0.1136, M: 8.2974, S: 0.10903 },
    { age: 8, L: 0.1025, M: 8.6148, S: 0.10904 },
    { age: 9, L: 0.0842, M: 8.9014, S: 0.10968 },
    { age: 10, L: 0.0754, M: 9.1651, S: 0.11051 },
    { age: 11, L: 0.0655, M: 9.4124, S: 0.11124 },
    { age: 12, L: 0.0504, M: 9.6479, S: 0.11164 },
    { age: 15, L: 0.0217, M: 10.3002, S: 0.11413 },
    { age: 18, L: -0.0033, M: 10.9089, S: 0.11660 },
    { age: 21, L: -0.0250, M: 11.4500, S: 0.11900 },
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
    { age: 7, L: -0.1035, M: 7.6366, S: 0.12169 },
    { age: 8, L: -0.1278, M: 7.9348, S: 0.12188 },
    { age: 9, L: -0.1560, M: 8.2000, S: 0.12260 },
    { age: 10, L: -0.1774, M: 8.4553, S: 0.12324 },
    { age: 11, L: -0.1966, M: 8.7062, S: 0.12400 },
    { age: 12, L: -0.2142, M: 8.9500, S: 0.12474 },
    { age: 15, L: -0.2559, M: 9.6200, S: 0.12780 },
    { age: 18, L: -0.2881, M: 10.2400, S: 0.13104 },
    { age: 21, L: -0.3150, M: 10.8500, S: 0.13350 },
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
    { age: 15, L: 1, M: 79.1000, S: 0.03050 },
    { age: 18, L: 1, M: 82.3000, S: 0.03040 },
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

// BMI-for-Age (IMT/U) - Boys (0-60 months)
const BMIFA_BOYS = [
    { age: 0, L: -0.3053, M: 13.4069, S: 0.09458 },
    { age: 6, L: -0.2860, M: 17.2000, S: 0.08096 },
    { age: 12, L: -0.3999, M: 16.7100, S: 0.07790 },
    { age: 18, L: -0.4300, M: 16.1600, S: 0.07700 },
    { age: 24, L: -0.4300, M: 16.0200, S: 0.07800 },
    { age: 36, L: -0.3903, M: 15.5400, S: 0.07876 },
    { age: 48, L: -0.3500, M: 15.2500, S: 0.08000 },
    { age: 60, L: -0.3126, M: 15.1600, S: 0.08216 },
];

// BMI-for-Age (IMT/U) - Girls (0-60 months)
const BMIFA_GIRLS = [
    { age: 0, L: -0.0631, M: 13.3363, S: 0.09274 },
    { age: 6, L: -0.3234, M: 16.7000, S: 0.08116 },
    { age: 12, L: -0.4000, M: 16.3000, S: 0.07860 },
    { age: 18, L: -0.4200, M: 15.7500, S: 0.07890 },
    { age: 24, L: -0.4200, M: 15.7000, S: 0.08150 },
    { age: 36, L: -0.3800, M: 15.2100, S: 0.08270 },
    { age: 48, L: -0.3400, M: 14.9400, S: 0.08470 },
    { age: 60, L: -0.2986, M: 14.8500, S: 0.08750 },
];

// WHO 2007 Reference (5-18 Years) - BMIFA
const BMIFA_BOYS_5_18 = [
    { age: 60, L: -0.3126, M: 15.1600, S: 0.08216 },
    { age: 72, L: -0.421, M: 15.1, S: 0.091 },
    { age: 84, L: -0.551, M: 15.2, S: 0.103 },
    { age: 96, L: -0.686, M: 15.4, S: 0.116 },
    { age: 108, L: -0.822, M: 15.7, S: 0.129 },
    { age: 120, L: -0.957, M: 16.1, S: 0.141 },
    { age: 132, L: -1.088, M: 16.7, S: 0.152 },
    { age: 144, L: -1.211, M: 17.3, S: 0.161 },
    { age: 156, L: -1.325, M: 18.0, S: 0.169 },
    { age: 168, L: -1.428, M: 18.8, S: 0.174 },
    { age: 180, L: -1.516, M: 19.5, S: 0.179 },
    { age: 192, L: -1.589, M: 20.3, S: 0.182 },
    { age: 204, L: -1.644, M: 21.0, S: 0.184 },
    { age: 216, L: -1.679, M: 21.6, S: 0.185 },
];

const BMIFA_GIRLS_5_18 = [
    { age: 60, L: -0.2986, M: 14.8500, S: 0.08750 },
    { age: 72, L: -0.45, M: 14.7, S: 0.097 },
    { age: 84, L: -0.63, M: 14.8, S: 0.111 },
    { age: 96, L: -0.83, M: 15.0, S: 0.126 },
    { age: 108, L: -1.03, M: 15.3, S: 0.139 },
    { age: 120, L: -1.23, M: 15.9, S: 0.152 },
    { age: 132, L: -1.41, M: 16.5, S: 0.163 },
    { age: 144, L: -1.58, M: 17.3, S: 0.173 },
    { age: 156, L: -1.72, M: 18.2, S: 0.180 },
    { age: 168, L: -1.84, M: 19.1, S: 0.186 },
    { age: 180, L: -1.93, M: 20.0, S: 0.190 },
    { age: 192, L: -1.99, M: 20.9, S: 0.192 },
    { age: 204, L: -2.03, M: 21.7, S: 0.194 },
    { age: 216, L: -2.05, M: 22.4, S: 0.195 },
];

// Weight-for-Length/Height (BB/TB) - Boys
const WFH_BOYS = [
    { height: 45, L: -0.3521, M: 2.4410, S: 0.09182 },
    { height: 50, L: -0.0631, M: 3.3464, S: 0.09294 },
    { height: 60, L: 0.2980, M: 5.9230, S: 0.08780 },
    { height: 70, L: 0.0490, M: 8.5690, S: 0.08117 },
    { height: 80, L: -0.2050, M: 10.3900, S: 0.08050 },
    { height: 90, L: -0.3820, M: 12.0300, S: 0.08200 },
    { height: 100, L: -0.4560, M: 13.9300, S: 0.08400 },
    { height: 110, L: -0.4870, M: 16.2100, S: 0.08500 },
    { height: 120, L: -0.5010, M: 18.9300, S: 0.08620 },
];

// Weight-for-Length/Height (BB/TB) - Girls
const WFH_GIRLS = [
    { height: 45, L: -0.3833, M: 2.4607, S: 0.09029 },
    { height: 50, L: -0.1136, M: 3.2322, S: 0.09266 },
    { height: 60, L: 0.1290, M: 5.7180, S: 0.08900 },
    { height: 70, L: -0.0340, M: 8.2530, S: 0.08180 },
    { height: 80, L: -0.2200, M: 9.9200, S: 0.08120 },
    { height: 90, L: -0.3640, M: 11.5900, S: 0.08290 },
    { height: 100, L: -0.4350, M: 13.5800, S: 0.08530 },
    { height: 110, L: -0.4680, M: 16.0200, S: 0.08700 },
    { height: 120, L: -0.4840, M: 19.0400, S: 0.08850 },
];

/**
 * Linear interpolation of LMS values between two reference points
 */
function interpolateLMS(table, key, value) {
    if (!table || table.length === 0) return null;
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
 */
function calculateZScore(x, L, M, S) {
    if (!L || !M || !S) return 0;
    if (Math.abs(L) < 0.01) {
        return Math.log(x / M) / S;
    }
    return (Math.pow(x / M, L) - 1) / (L * S);
}

/**
 * Applied 0.7cm correction for PB/TB measurement according to Permenkes 2/2020
 * @param {number} height - Input height/length in cm
 * @param {number} ageInMonths - Age in months
 * @param {boolean} isLyingDown - Measured lying down (True) or Standing (False)
 * @returns {number} Corrected height
 */
export function correctHeight(height, ageInMonths, isLyingDown) {
    let correctedValue = height;

    // Standard: 0-24m use PB (lying), >24m use TB (standing)
    if (ageInMonths <= 24 && !isLyingDown) {
        // Under 24m but measured standing -> Convert to PB (add 0.7)
        correctedValue += 0.7;
    } else if (ageInMonths > 24 && isLyingDown) {
        // Over 24m but measured lying -> Convert to TB (subtract 0.7)
        correctedValue -= 0.7;
    }

    return correctedValue;
}

/**
 * Calculate all nutrition indices
 */
export function calculateNutritionIndices(weight, rawHeight, ageInMonths, gender, isLyingDown = null) {
    const isMale = gender === 'male';

    // 1. Correct height if measurement method is provided
    const height = isLyingDown !== null
        ? correctHeight(rawHeight, ageInMonths, isLyingDown)
        : rawHeight;

    const results = {};

    // ── BB/U (0-60 months only) ──
    if (ageInMonths <= 60) {
        const wfaTable = isMale ? WFA_BOYS : WFA_GIRLS;
        const wfaLMS = interpolateLMS(wfaTable, 'age', ageInMonths);
        const zBBU = calculateZScore(weight, wfaLMS.L, wfaLMS.M, wfaLMS.S);
        results.bb_u = { zScore: zBBU.toFixed(2), status: getBBUStatus(zBBU) };
    }

    // ── TB/U (0-60 months only) ──
    if (ageInMonths <= 60) {
        const hfaTable = isMale ? HFA_BOYS : HFA_GIRLS;
        const hfaLMS = interpolateLMS(hfaTable, 'age', ageInMonths);
        const zTBU = calculateZScore(height, hfaLMS.L, hfaLMS.M, hfaLMS.S);
        results.tb_u = { zScore: zTBU.toFixed(2), status: getTBUStatus(zTBU) };
    }

    // ── BB/TB (0-60 months only) ──
    if (ageInMonths <= 60) {
        const wfhTable = isMale ? WFH_BOYS : WFH_GIRLS;
        const wfhLMS = interpolateLMS(wfhTable, 'height', height);
        const zBBTB = calculateZScore(weight, wfhLMS.L, wfhLMS.M, wfhLMS.S);
        results.bb_tb = { zScore: zBBTB.toFixed(2), status: getBBTBStatus(zBBTB) };
    }

    // ── IMT/U (0-216 months / 18 years) ──
    const heightInM = height / 100;
    const imt = weight / (heightInM * heightInM);

    if (ageInMonths <= 60) {
        const bmifaTable = isMale ? BMIFA_BOYS : BMIFA_GIRLS;
        const bmifaLMS = interpolateLMS(bmifaTable, 'age', ageInMonths);
        const zIMTU = calculateZScore(imt, bmifaLMS.L, bmifaLMS.M, bmifaLMS.S);
        results.imt_u = {
            zScore: zIMTU.toFixed(2),
            imt: imt.toFixed(1),
            status: getIMTUStatus(zIMTU, true)
        };
    } else if (ageInMonths <= 216) {
        const bmifaTable = isMale ? BMIFA_BOYS_5_18 : BMIFA_GIRLS_5_18;
        const bmifaLMS = interpolateLMS(bmifaTable, 'age', ageInMonths);
        const zIMTU = calculateZScore(imt, bmifaLMS.L, bmifaLMS.M, bmifaLMS.S);
        results.imt_u = {
            zScore: zIMTU.toFixed(2),
            imt: imt.toFixed(1),
            status: getIMTUStatus(zIMTU, false)
        };
    }

    return results;
}

// ═══════════════════════════════════════════════════════════
// Status Classifications (Permenkes RI No. 2 Tahun 2020)
// ═══════════════════════════════════════════════════════════

function getBBUStatus(z) {
    if (z < -3) return 'Berat Badan Sangat Kurang';
    if (z < -2) return 'Berat Badan Kurang';
    if (z <= 1) return 'Berat Badan Normal';
    return 'Risiko Berat Badan Lebih';
}

function getTBUStatus(z) {
    if (z < -3) return 'Sangat Pendek (Severely Stunted)';
    if (z < -2) return 'Pendek (Stunted)';
    if (z <= 3) return 'Normal';
    return 'Tinggi';
}

function getBBTBStatus(z) {
    if (z < -3) return 'Gizi Buruk (Severely Wasted)';
    if (z < -2) return 'Gizi Kurang (Wasted)';
    if (z <= 1) return 'Gizi Baik (Normal)';
    if (z <= 2) return 'Berisiko Gizi Lebih';
    if (z <= 3) return 'Gizi Lebih (Overweight)';
    return 'Obesitas';
}

function getIMTUStatus(z, isUnder5) {
    if (isUnder5) {
        if (z < -3) return 'Gizi Buruk (Severely Wasted)';
        if (z < -2) return 'Gizi Kurang (Wasted)';
        if (z <= 1) return 'Gizi Baik (Normal)';
        if (z <= 2) return 'Berisiko Gizi Lebih';
        if (z <= 3) return 'Gizi Lebih (Overweight)';
        return 'Obesitas';
    } else {
        // 5-18 Years (Permenkes 2/2020 Table 2)
        if (z < -3) return 'Gizi Buruk (Severely Thinness)';
        if (z < -2) return 'Gizi Kurang (Thinness)';
        if (z <= 1) return 'Gizi Baik (Normal)';
        if (z <= 2) return 'Gizi Lebih (Overweight)';
        return 'Obesitas';
    }
}
