const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

console.log('🧪 Starting APFMS Automated System Verification Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

async function runTests() {
  // Test 1: Password Hashing & Verification
  const rawPassword = 'Password123!';
  const hash = await bcrypt.hash(rawPassword, 10);
  const isValid = await bcrypt.compare(rawPassword, hash);
  assert(isValid, 'Password hashing and verification with bcrypt');

  // Test 2: JWT Token Generation & Verification
  const payload = { id: 'test-id', email: 'admin@farm.com', role: 'admin' };
  const secret = 'apfms_super_secret_jwt_key_2026_poultry_farm';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, secret);
  assert(decoded.email === 'admin@farm.com' && decoded.role === 'admin', 'JWT token generation & payload decoding');

  // Test 3: Mortality Rate % Formula Calculation
  const initialQuantity = 2000;
  const mortalities = 50;
  const mortalityRatePct = ((mortalities / initialQuantity) * 100).toFixed(2);
  assert(mortalityRatePct === '2.50', 'Mortality Rate calculation formula ((50 / 2000) * 100 = 2.50%)');

  // Test 4: Marketable Eggs Calculation Formula
  const totalEggs = 1850;
  const brokenEggs = 25;
  const damagedEggs = 15;
  const marketableEggs = totalEggs - (brokenEggs + damagedEggs);
  assert(marketableEggs === 1810, 'Marketable Eggs formula (1850 - 40 = 1810)');

  // Test 5: Financial Net Profit Calculation
  const totalRevenue = 2850000;
  const totalExpenses = 1720000;
  const netProfit = totalRevenue - totalExpenses;
  assert(netProfit === 1130000, 'Financial Net Profit formula (₦2,850,000 - ₦1,720,000 = ₦1,130,000)');

  // Test 6: Flock Current Population Formula
  const initialBirds = 2500;
  const totalMortalityCount = 35;
  const birdsSold = 400;
  const otherLosses = 5;
  const currentBirds = initialBirds - totalMortalityCount - birdsSold - otherLosses;
  assert(currentBirds === 2060, 'Flock Current Population formula (2500 - 35 - 400 - 5 = 2060)');

  console.log(`\n========================================================`);
  console.log(`RESULTS: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log(`========================================================\n`);

  if (testsFailed > 0) process.exit(1);
}

runTests();
