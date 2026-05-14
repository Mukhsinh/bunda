/**
 * WHO Growth Standards Data (LMS Method & Approximations)
 * Simplified dataset for Kemenkes (0-60 Months)
 */

export function calculateNutritionIndices(weight, height, ageInMonths, gender) {
    // 1. BB/U (Berat Badan menurut Umur)
    // Approximate Median Weight
    const mBB = gender === 'male' ? 3.3 + (ageInMonths * 0.35) : 3.2 + (ageInMonths * 0.33);
    const sdBB = 0.8 + (ageInMonths * 0.05);
    const zBBU = (weight - mBB) / sdBB;

    // 2. TB/U (Tinggi Badan menurut Umur)
    const mTB = gender === 'male' ? 50 + (ageInMonths * 1.5) : 49 + (ageInMonths * 1.45);
    const sdTB = 2.0 + (ageInMonths * 0.1);
    const zTBU = (height - mTB) / sdTB;

    // 3. IMT/U
    const heightInM = height / 100;
    const imt = weight / (heightInM * heightInM);
    // Approximate median IMT is around 16.5
    const mIMT = 16.5 - (ageInMonths > 12 ? (ageInMonths - 12) * 0.02 : 0);
    const sdIMT = 1.2;
    const zIMTU = (imt - mIMT) / sdIMT;

    // 4. BB/TB
    // Approximate expected weight for given height
    const mBBTB = (heightInM * heightInM) * 16.5;
    const sdBBTB = 1.0;
    const zBBTB = (weight - mBBTB) / sdBBTB;

    return {
        bb_u: { zScore: zBBU.toFixed(2), status: getBBUStatus(zBBU) },
        tb_u: { zScore: zTBU.toFixed(2), status: getTBUStatus(zTBU) },
        bb_tb: { zScore: zBBTB.toFixed(2), status: getBBTBStatus(zBBTB) },
        imt_u: { zScore: zIMTU.toFixed(2), imt: imt.toFixed(1), status: getIMTUStatus(zIMTU) }
    };
}

function getBBUStatus(z) {
    if (z < -3) return 'Sangat Kurang';
    if (z < -2) return 'Kurang';
    if (z <= 1) return 'Normal';
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

function getIMTUStatus(z) {
    if (z < -3) return 'Sangat Kurus';
    if (z < -2) return 'Kurus';
    if (z <= 1) return 'Normal';
    if (z <= 2) return 'Berisiko Gizi Lebih';
    if (z <= 3) return 'Gizi Lebih';
    return 'Obesitas';
}
