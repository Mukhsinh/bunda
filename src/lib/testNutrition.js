import { calculateWeightForAgeZScore, getNutritionStatusLabel } from './nutritionData.js';

const tests = [
    { gender: 'male', age: 2, weight: 5.6299, expected: 0 }, // Median
    { gender: 'male', age: 2, weight: 5.0, expectedLabel: 'Gizi Baik' },
    { gender: 'female', age: 10, weight: 8.5008, expected: 0 }, // Median
    { gender: 'female', age: 10, weight: 6.0, expectedLabel: 'Gizi Buruk' }, // Very low
];

console.log('--- Nutrition Logic Verification ---');
tests.forEach((t, i) => {
    const z = calculateWeightForAgeZScore(t.weight, t.age, t.gender);
    const label = getNutritionStatusLabel(z);
    console.log(`Test ${i + 1}: ${t.gender}, ${t.age}mo, ${t.weight}kg`);
    console.log(`  Z-Score: ${z.toFixed(4)}`);
    console.log(`  Status: ${label}`);
    if (t.expected !== undefined) {
        console.log(`  Check vs Expected 0: ${Math.abs(z) < 0.0001 ? 'PASS' : 'FAIL'}`);
    }
    if (t.expectedLabel) {
        console.log(`  Check Label: ${label === t.expectedLabel ? 'PASS' : 'FAIL'}`);
    }
});
